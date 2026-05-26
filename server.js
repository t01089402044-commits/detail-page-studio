const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const ftp = require('basic-ftp');

// FTP 설정 — 자격증명은 코드/repo에 박지 않고 환경변수만 사용
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASS = process.env.FTP_PASS || '';
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/SE2/upload/상세페이지/';
const FTP_PUBLIC_BASE = process.env.FTP_PUBLIC_BASE || 'https://xngolf.co.kr/SE2/upload/상세페이지/';

const TMPL_DIR = path.join(__dirname, 'templates');
if (!fs.existsSync(TMPL_DIR)) fs.mkdirSync(TMPL_DIR);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/health', (req, res) => res.json({ ok: true }));

function safeName(name) {
  return name.replace(/[^a-z0-9가-힣_-]/gi, '_');
}

// 템플릿 목록
app.get('/api/templates', (req, res) => {
  try {
    const files = fs.readdirSync(TMPL_DIR).filter(f => f.endsWith('.json'));
    const list = files.map(f => {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(TMPL_DIR, f), 'utf8'));
        return { name: t.name, savedAt: t.savedAt, width: t.width, font: t.font };
      } catch { return null; }
    }).filter(Boolean);
    list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 템플릿 저장
app.post('/api/templates/save', (req, res) => {
  try {
    const tpl = req.body;
    if (!tpl || !tpl.name) return res.status(400).json({ error: '이름 필요' });
    const fname = safeName(tpl.name) + '.json';
    tpl.savedAt = new Date().toISOString();
    fs.writeFileSync(path.join(TMPL_DIR, fname), JSON.stringify(tpl), 'utf8');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 템플릿 불러오기
app.get('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (!fs.existsSync(fpath)) return res.status(404).json({ error: '없음' });
    res.json(JSON.parse(fs.readFileSync(fpath, 'utf8')));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 템플릿 삭제
app.delete('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FTP 클라이언트 생성 + 디렉토리 진입
async function ftpConnect() {
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    throw new Error('FTP 환경변수 미설정 (FTP_HOST/FTP_USER/FTP_PASS)');
  }
  const client = new ftp.Client(15000);
  client.ftp.encoding = 'utf8';
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  await client.ensureDir(FTP_REMOTE_DIR);
  return client;
}

// 이미지 업로드: dataURL → FTP → public URL 반환
app.post('/api/upload', async (req, res) => {
  let client;
  try {
    const { dataURL } = req.body || {};
    if (!dataURL) return res.status(400).json({ error: 'dataURL 필요' });
    const m = dataURL.match(/^data:image\/([a-z0-9+]+);base64,(.+)$/i);
    if (!m) return res.status(400).json({ error: '잘못된 dataURL 형식' });
    const extRaw = m[1].toLowerCase();
    const ext = extRaw === 'jpeg' ? 'jpg' : extRaw;
    const buf = Buffer.from(m[2], 'base64');
    const fname = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    client = await ftpConnect();
    await client.uploadFrom(Readable.from(buf), fname);
    res.json({ url: FTP_PUBLIC_BASE + encodeURIComponent(fname), name: fname, size: buf.length });
  } catch (e) {
    console.error('[FTP upload error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// 업로드된 이미지 목록
app.get('/api/uploads', async (req, res) => {
  let client;
  try {
    client = await ftpConnect();
    const items = await client.list();
    const list = items
      .filter(it => it.isFile && /\.(jpe?g|png|gif|webp|bmp)$/i.test(it.name))
      .map(it => ({
        name: it.name,
        size: it.size,
        modifiedAt: it.modifiedAt ? new Date(it.modifiedAt).toISOString() : null,
        url: FTP_PUBLIC_BASE + encodeURIComponent(it.name)
      }))
      .sort((a, b) => (b.modifiedAt || '').localeCompare(a.modifiedAt || ''));
    res.json(list);
  } catch (e) {
    console.error('[FTP list error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// 업로드된 이미지 삭제
app.delete('/api/uploads/:name', async (req, res) => {
  let client;
  try {
    const raw = req.params.name || '';
    // 경로 이동 차단
    if (raw.includes('/') || raw.includes('\\') || raw.includes('..')) {
      return res.status(400).json({ error: '잘못된 파일명' });
    }
    client = await ftpConnect();
    await client.remove(raw);
    res.json({ ok: true });
  } catch (e) {
    console.error('[FTP delete error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

let browser = null;
async function getBrowser() {
  if (browser?.isConnected()) return browser;
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
  });
  return browser;
}

app.post('/api/capture', async (req, res) => {
  const { html, width = 860, scale = 2, format = 'jpeg', quality = 95 } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise(r => setTimeout(r, 1200));
    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview 없음');
    const buf = await preview.screenshot({ type: format === 'png' ? 'png' : 'jpeg', quality: format === 'jpeg' ? quality : undefined });
    res.set('Content-Type', format === 'png' ? 'image/png' : 'image/jpeg');
    res.send(buf);
  } catch(e) { res.status(500).json({ error: e.message }); }
  finally { if (page) await page.close(); }
});

app.listen(PORT, () => {
  console.log('Detail Page Studio on port', PORT);
});

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});
