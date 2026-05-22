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

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/health', (req, res) => res.json({ ok: true }));

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
  const { html, width = 860, scale = 1, format = 'jpeg', quality = 95 } = req.body;
  if (!html) return res.status(400).json({ error: 'html 필요' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    await page.evaluate(() => {
      ['#topbar','#right','.sec-ov','.iz-ov','.del-btn','.add-btn','.resize-bar','.iz-zone-del','#ep','#ft','#hint','#add-modal'].forEach(s => document.querySelectorAll(s).forEach(el => el.style.display='none'));
      document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
    });
    await new Promise(r => setTimeout(r, 500));
    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview 없음');
    const buf = await preview.screenshot({ type: format==='png'?'png':'jpeg', quality: format==='jpeg'?quality:undefined });
    res.set('Content-Type', format==='png'?'image/png':'image/jpeg');
    res.send(buf);
  } catch(e) { res.status(500).json({ error: e.message }); }
  finally { if (page) await page.close(); }
});

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
      ['#topbar','#right','.sec-ov','.iz-ov','.del-btn','.add-btn','.resize-bar','#ep','#ft','#hint','#add-modal'].forEach(s => document.querySelectorAll(s).forEach(el => el.style.display='none'));
      document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
    });
    await new Promise(r => setTimeout(r, 500));
    const sections = await page.$$('#preview > .sec-wrap');
    const captured = [];
    for (const sec of sections) {
      const box = await sec.boundingBox();
      if (!box || box.height < 1) continue;
      const buf = await sec.screenshot({ type: 'jpeg', quality: 95 });
      captured.push({ height: Math.round(box.height), buf: buf.toString('base64') });
    }
    const chunks = []; let group = [], groupH = 0;
    for (const s of captured) {
      if (group.length > 0 && groupH + s.height > maxH) { chunks.push(group); group = []; groupH = 0; }
      group.push(s); groupH += s.height;
    }
    if (group.length > 0) chunks.push(group);
    res.json({ ok: true, parts: chunks.length, chunks: chunks.map((ch,i) => ({ index:i+1, sections:ch.map(s=>({ height:s.height, data:s.buf })) })) });
  } catch(e) { res.status(500).json({ error: e.message }); }
  finally { if (page) await page.close(); }
});

app.listen(PORT, () => { console.log('Detail Page Studio on port', PORT); getBrowser().catch(console.error); });
process.on('SIGTERM', async () => { if (browser) await browser.close(); process.exit(0); });
