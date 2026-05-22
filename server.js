const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '30mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Puppeteer 인스턴스 관리 ────────────────────────────────────────────────
let browser = null;

async function getBrowser() {
  if (browser?.isConnected()) return browser;
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });
  console.log('🚀 Puppeteer 시작');
  return browser;
}

// ── 헬스체크 ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ── 전체 페이지 캡처 ──────────────────────────────────────────────────────
// POST /api/capture
// { html, width=860, scale=1, format='jpeg', quality=95 }
app.post('/api/capture', async (req, res) => {
  const { html, width = 860, scale = 1, format = 'jpeg', quality = 95 } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });

  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();

    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    // 에디터 UI 숨기기
    await page.evaluate(() => {
      const hide = ['#topbar','#right','.sec-ov','.iz-ov','.del-btn',
        '.add-btn','.resize-bar','.iz-zone-del','.tf-border',
        '.tf-handle','.tf-dim','.s-size-ctrl','.feat-row-add-wrap',
        '.feat-add-img-row','#ep','#ft','#hint','#add-modal',
        '.iz-lock-badge','.mood-copy-del'];
      hide.forEach(s => document.querySelectorAll(s)
        .forEach(el => el.style.display = 'none'));

      // 미리보기만 표시
      const p = document.getElementById('preview');
      if (p) {
        document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
        p.style.cssText = 'width:'+width+'px;margin:0;padding:0;';
      }
    });

    await new Promise(r => setTimeout(r, 500));

    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview 없음');

    const buf = await preview.screenshot({
      type: format === 'png' ? 'png' : 'jpeg',
      quality: format === 'jpeg' ? quality : undefined,
    });

    res.set('Content-Type', format === 'png' ? 'image/png' : 'image/jpeg');
    res.set('Content-Disposition', `attachment; filename="detail.${format === 'png' ? 'png' : 'jpg'}"`);
    res.send(buf);

    console.log(`✅ 캡처 완료 ${width}px ${buf.length} bytes`);
  } catch (e) {
    console.error('캡처 오류:', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (page) await page.close();
  }
});

// ── 섹션 분할 캡처 ────────────────────────────────────────────────────────
// POST /api/capture/split
// { html, width=860, scale=1, maxH=3500, format='jpeg' }
app.post('/api/capture/split', async (req, res) => {
  const { html, width = 860, scale = 1, maxH = 3500, format = 'jpeg' } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });

  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    await page.evaluate(() => {
      const hide = ['#topbar','#right','.sec-ov','.iz-ov','.del-btn',
        '.add-btn','.resize-bar','.iz-zone-del','.tf-border',
        '.tf-handle','.s-size-ctrl','.feat-row-add-wrap','#ep','#ft',
        '#hint','#add-modal'];
      hide.forEach(s => document.querySelectorAll(s)
        .forEach(el => el.style.display = 'none'));
      document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
    });

    await new Promise(r => setTimeout(r, 500));

    // 섹션별 캡처
    const sections = await page.$$('#preview > .sec-wrap');
    const captured = [];
    for (const sec of sections) {
      const box = await sec.boundingBox();
      if (!box || box.height < 1) continue;
      const buf = await sec.screenshot({
        type: format === 'png' ? 'png' : 'jpeg',
        quality: format === 'jpeg' ? 95 : undefined,
      });
      captured.push({ height: Math.round(box.height), buf: buf.toString('base64') });
    }

    // 3500px 기준 그룹핑
    const chunks = [];
    let group = [], groupH = 0;
    for (const s of captured) {
      if (group.length > 0 && groupH + s.height > maxH) {
        chunks.push(group); group = []; groupH = 0;
      }
      group.push(s); groupH += s.height;
    }
    if (group.length > 0) chunks.push(group);

    // sharp 없이 base64로 반환 (클라이언트에서 Canvas로 합치기)
    res.json({
      ok: true,
      parts: chunks.length,
      chunks: chunks.map((ch, i) => ({
        index: i + 1,
        sections: ch.map(s => ({ height: s.height, data: s.buf })),
      })),
    });

    console.log(`✅ 분할 캡처: ${chunks.length}파트`);
  } catch (e) {
    console.error('분할 캡처 오류:', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (page) await page.close();
  }
});

// ── 서버 시작 ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎨 Detail Page Studio`);
  console.log(`   http://localhost:${PORT}\n`);
  getBrowser().catch(console.error); // 미리 시작
});

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});
