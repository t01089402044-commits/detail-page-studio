const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const r2 = new S3Client({
  region: 'auto',
  endpoint: (process.env.R2_ENDPOINT||'').trim().replace(/\/$/, ''),
  forcePathStyle: true,
  credentials: {
    accessKeyId: (process.env.R2_ACCESS_KEY_ID||'').trim(),
    secretAccessKey: (process.env.R2_SECRET_ACCESS_KEY||'').trim(),
  },
});
const R2_BUCKET = process.env.R2_BUCKET || 'dps-templates';
const fs = require('fs');
const TMPL_DIR = path.join(__dirname, 'templates');
if (!fs.existsSync(TMPL_DIR)) fs.mkdirSync(TMPL_DIR);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '30mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/debug-env', (req, res) => {
  res.json({
    hasAccessKey: !!(process.env.R2_ACCESS_KEY_ID),
    accessKeyLen: (process.env.R2_ACCESS_KEY_ID||'').length,
    hasSecret: !!(process.env.R2_SECRET_ACCESS_KEY),
    secretLen: (process.env.R2_SECRET_ACCESS_KEY||'').length,
    endpoint: process.env.R2_ENDPOINT,
    bucket: process.env.R2_BUCKET,
  });
});
// 템플릿 목록
app.get('/api/templates', async (req, res) => {
  try{
    const data = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET }));
    const list = (data.Contents||[]).map(o => ({
      name: decodeURIComponent(o.Key.replace('.json','')),
      savedAt: o.LastModified,
      size: o.Size
    }));
    list.sort((a,b) => new Date(b.savedAt)-new Date(a.savedAt));
    res.json(list);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// 템플릿 저장
app.post('/api/templates/save', async (req, res) => {
  try{
    const tpl = req.body;
    if(!tpl||!tpl.name) return res.status(400).json({ error: '이름 필요' });
    const key = encodeURIComponent(tpl.name) + '.json';
    tpl.savedAt = new Date().toISOString();
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: JSON.stringify(tpl),
      ContentType: 'application/json',
    }));
    res.json({ ok: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// 템플릿 불러오기
app.get('/api/templates/:name', async (req, res) => {
  try{
    const key = encodeURIComponent(req.params.name) + '.json';
    const data = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    const chunks = [];
    for await (const chunk of data.Body) chunks.push(chunk);
    res.json(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  }catch(e){ res.status(404).json({ error: e.message }); }
});

// 템플릿 삭제
app.delete('/api/templates/:name', async (req, res) => {
  try{
    const key = encodeURIComponent(req.params.name) + '.json';
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    res.json({ ok: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
});
// 템플릿 목록
app.get('/api/templates', (req, res) => {
  const files = fs.readdirSync(TMPL_DIR).filter(f => f.endsWith('.json'));
  const list = files.map(f => {
    const t = JSON.parse(fs.readFileSync(path.join(TMPL_DIR, f), 'utf8'));
    return { name: t.name, savedAt: t.savedAt, width: t.width, font: t.font };
  });
  list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
  res.json(list);
});

// 템플릿 저장
app.post('/api/templates/save', (req, res) => {
  const tpl = req.body;
  if (!tpl || !tpl.name) return res.status(400).json({ error: '이름 필요' });
  const fname = tpl.name.replace(/[^a-z0-9가-힣_-]/gi, '_') + '.json';
  tpl.savedAt = new Date().toISOString();
  fs.writeFileSync(path.join(TMPL_DIR, fname), JSON.stringify(tpl), 'utf8');
  res.json({ ok: true });
});

// 템플릿 불러오기
app.get('/api/templates/:name', (req, res) => {
  const fname = req.params.name.replace(/[^a-z0-9가-힣_-]/gi, '_') + '.json';
  const fpath = path.join(TMPL_DIR, fname);
  if (!fs.existsSync(fpath)) return res.status(404).json({ error: '없음' });
  res.json(JSON.parse(fs.readFileSync(fpath, 'utf8')));
});

// 템플릿 삭제
app.delete('/api/templates/:name', (req, res) => {
  const fname = req.params.name.replace(/[^a-z0-9가-힣_-]/gi, '_') + '.json';
  const fpath = path.join(TMPL_DIR, fname);
  if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
  res.json({ ok: true });
});

let browser = null;
async function getBrowser() {
  if (browser?.isConnected()) return browser;
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',        // ✅ 폰트 렌더링 개선
      '--disable-font-subpixel-positioning', // ✅ 폰트 선명도 개선
      '--enable-font-antialiasing',         // ✅ 폰트 안티앨리어싱
    ],
  });
  return browser;
}

// ✅ 폰트 완전 로드 대기 함수
async function waitForFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // 모든 폰트 face 로드 완료 대기
    const fontPromises = Array.from(document.fonts).map(f => f.load().catch(() => {}));
    await Promise.allSettled(fontPromises);
  });
  await new Promise(r => setTimeout(r, 1200)); // ✅ 외부 폰트(구글폰트 등) 추가 대기
}

// ✅ UI 요소 숨기기
async function hideUIElements(page) {
  await page.evaluate(() => {
    ['#topbar','#right','.sec-ov','.iz-ov','.del-btn','.add-btn',
     '.resize-bar','.iz-zone-del','#ep','#ft','#hint','#add-modal'
    ].forEach(s => document.querySelectorAll(s).forEach(el => el.style.display = 'none'));
    document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
  });
}

// 전체 캡처
app.post('/api/capture', async (req, res) => {
  // ✅ scale 기본값 2로 변경 (레티나 품질)
  const { html, width = 860, scale = 2, format = 'jpeg', quality = 95 } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });

    await waitForFonts(page);   // ✅ 폰트 완전 로드
    await hideUIElements(page); // ✅ UI 숨기기
    await new Promise(r => setTimeout(r, 300));

    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview 없음');

    const buf = await preview.screenshot({
      type: format === 'png' ? 'png' : 'jpeg',
      quality: format === 'jpeg' ? quality : undefined,
      // ✅ 캡처 영역 내 이미지 로드 완료 보장
    });

    res.set('Content-Type', format === 'png' ? 'image/png' : 'image/jpeg');
    res.send(buf);
  } catch(e) {
    res.status(500).json({ error: e.message });
  } finally {
    if (page) await page.close();
  }
});

// 분할 캡처
app.post('/api/capture/split', async (req, res) => {
  // ✅ scale 기본값 2로 변경
  const { html, width = 860, scale = 2, maxH = 3500, format = 'jpeg' } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });

    await waitForFonts(page);   // ✅ 폰트 완전 로드
    await hideUIElements(page); // ✅ UI 숨기기
    await new Promise(r => setTimeout(r, 300));

    const sections = await page.$$('#preview > .sec-wrap');
    const captured = [];

    for (const sec of sections) {
      const box = await sec.boundingBox();
      if (!box || box.height < 1) continue;
      const buf = await sec.screenshot({
        type: 'jpeg',
        quality: 95,  // ✅ 분할 캡처도 고품질 유지
      });
      captured.push({ height: Math.round(box.height), buf: buf.toString('base64') });
    }

    // 청크 분할
    const chunks = []; let group = [], groupH = 0;
    for (const s of captured) {
      if (group.length > 0 && groupH + s.height > maxH) {
        chunks.push(group); group = []; groupH = 0;
      }
      group.push(s); groupH += s.height;
    }
    if (group.length > 0) chunks.push(group);

    res.json({
      ok: true,
      parts: chunks.length,
      chunks: chunks.map((ch, i) => ({
        index: i + 1,
        sections: ch.map(s => ({ height: s.height, data: s.buf }))
      }))
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  } finally {
    if (page) await page.close();
  }
});

app.listen(PORT, () => {
  console.log('Detail Page Studio on port', PORT);
});

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});