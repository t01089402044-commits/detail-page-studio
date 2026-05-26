const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

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
