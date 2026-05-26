const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const ftp = require('basic-ftp');
const iconv = require('iconv-lite');

// FTP credentials from env vars only - never hardcode in code/repo
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASS = process.env.FTP_PASS || '';
// This hosting's documentroot is FTP /public/, so FTP path must include /public/
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/public/SE2/upload/detail-page/';
const FTP_TEMPLATE_DIR = process.env.FTP_TEMPLATE_DIR || '/public/SE2/upload/templates/';
// FTP server path encoding (Korean hosting typically uses cp949/euc-kr)
const FTP_PATH_ENCODING = process.env.FTP_PATH_ENCODING || 'cp949';
// Public URL base - calculated below from FTP_REMOTE_DIR if not set
let FTP_PUBLIC_BASE = process.env.FTP_PUBLIC_BASE || '';

// Convert JS string to FTP server encoding (cp949) as latin1 string (basic-ftp sends byte-perfect)
function encPath(s){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return s;
  return iconv.encode(s, FTP_PATH_ENCODING).toString('binary');
}
function decName(latin1){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return latin1;
  return iconv.decode(Buffer.from(latin1, 'binary'), FTP_PATH_ENCODING);
}
// Encode JS string to cp949 bytes then percent-encode for public URL (so Apache reads as cp949 path)
function urlEncodeCp949(s){
  const bytes = iconv.encode(s, FTP_PATH_ENCODING);
  let out = '';
  for (const b of bytes) {
    // Safe ASCII characters (alphanumeric + -_.~)
    if ((b>=0x30&&b<=0x39)||(b>=0x41&&b<=0x5A)||(b>=0x61&&b<=0x7A)||b===0x2D||b===0x5F||b===0x2E||b===0x7E) {
      out += String.fromCharCode(b);
    } else {
      out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
    }
  }
  return out;
}

// Auto-calculate FTP_PUBLIC_BASE default
// Public URL: https://xngolf.co.kr + (FTP_REMOTE_DIR without /public prefix) with Korean parts cp949 URL-encoded
if (!FTP_PUBLIC_BASE) {
  let webPath = FTP_REMOTE_DIR.replace(/^\/public(\/|$)/, '/');
  if (!webPath.endsWith('/')) webPath += '/';
  // Encode each path segment separately (slash preserved)
  const encodedPath = webPath.split('/').map(seg => seg ? urlEncodeCp949(seg) : seg).join('/');
  FTP_PUBLIC_BASE = 'https://xngolf.co.kr' + encodedPath;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/health', (req, res) => res.json({ ok: true }));

function safeName(name) {
  return name.replace(/[^\w]/gi, '_');
}

// Template list (from FTP)
app.get('/api/templates', async (req, res) => {
  // FTP env vars not configured - return empty list
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    return res.json([]);
  }

  let client;
  try {
    client = await ftpConnect();
    await client.ensureDir(encPath(FTP_TEMPLATE_DIR));
    const items = await client.list(encPath(FTP_TEMPLATE_DIR));
    const list = [];
    for (const it of items) {
      if (!it.isFile || !/\.json$/i.test(it.name)) continue;
      try {
        const content = await client.downloadToBuffer(encPath(FTP_TEMPLATE_DIR.replace(/\/$/, '') + '/' + it.name));
        const t = JSON.parse(content.toString('utf8'));
        list.push({ name: t.name, savedAt: t.savedAt, width: t.width, font: t.font });
      } catch (e) {
        console.error('[FTP template list] Failed to parse', it.name, e.message);
      }
    }
    list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
    res.json(list);
  } catch (e) {
    console.error('[FTP template list error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// Save template (to FTP or local fallback)
app.post('/api/templates/save', async (req, res) => {
  const tpl = req.body;
  if (!tpl || !tpl.name) return res.status(400).json({ error: 'name required' });
  const fname = safeName(tpl.name) + '.json';
  tpl.savedAt = new Date().toISOString();
  const content = JSON.stringify(tpl, null, 2);

  // FTP available: save to FTP
  if (FTP_HOST && FTP_USER && FTP_PASS) {
    let client;
    try {
      client = await ftpConnect();
      await client.ensureDir(encPath(FTP_TEMPLATE_DIR));
      await client.uploadFrom(Readable.from(Buffer.from(content, 'utf8')), encPath(FTP_TEMPLATE_DIR.replace(/\/$/, '') + '/' + fname));
      return res.json({ ok: true });
    } catch (e) {
      console.error('[FTP template save error, fallback to local]', e.message);
      // FTP failed, fallback to local
    } finally {
      if (client) client.close();
    }
  }

  // Local fallback: save to templates/ directory
  try {
    const TMPL_DIR = path.join(__dirname, 'templates');
    if (!fs.existsSync(TMPL_DIR)) fs.mkdirSync(TMPL_DIR, { recursive: true });
    fs.writeFileSync(path.join(TMPL_DIR, fname), content, 'utf8');
    res.json({ ok: true, local: true });
  } catch (e) {
    console.error('[Local template save error]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Load template (from FTP)
app.get('/api/templates/:name', async (req, res) => {
  // FTP env vars not configured
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    return res.status(404).json({ error: 'not found' });
  }

  let client;
  try {
    const fname = safeName(req.params.name) + '.json';
    client = await ftpConnect();
    const content = await client.downloadToBuffer(encPath(FTP_TEMPLATE_DIR.replace(/\/$/, '') + '/' + fname));
    res.json(JSON.parse(content.toString('utf8')));
  } catch (e) {
    console.error('[FTP template load error]', e.message);
    if (e.code === 550) return res.status(404).json({ error: 'not found' });
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// Delete template (from FTP)
app.delete('/api/templates/:name', async (req, res) => {
  // FTP env vars not configured
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    return res.status(400).json({ error: 'FTP not configured' });
  }

  let client;
  try {
    const fname = safeName(req.params.name) + '.json';
    client = await ftpConnect();
    await client.remove(encPath(FTP_TEMPLATE_DIR.replace(/\/$/, '') + '/' + fname));
    res.json({ ok: true });
  } catch (e) {
    console.error('[FTP template delete error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// Create FTP client and ensure remote directory exists
// basic-ftp socket I/O only supports utf8/binary/utf16le (not cp949 directly)
// So we use encoding='binary'(latin1) and manually convert strings via iconv
async function ftpConnect() {
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    throw new Error('FTP env vars not configured (FTP_HOST/FTP_USER/FTP_PASS)');
  }
  const client = new ftp.Client(15000);
  client.ftp.encoding = 'binary';
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  // ensureDir: cp949-encoded path. Creates if not exists, cd if exists
  await client.ensureDir(encPath(FTP_REMOTE_DIR));
  return client;
}

// Upload image from dataURL to FTP, return public URL
app.post('/api/upload', async (req, res) => {
  let client;
  try {
    const { dataURL } = req.body || {};
    if (!dataURL) return res.status(400).json({ error: 'dataURL required' });
    const m = dataURL.match(/^data:image\/([a-z0-9+]+);base64,(.+)$/i);
    if (!m) return res.status(400).json({ error: 'invalid dataURL format' });
    const extRaw = m[1].toLowerCase();
    const ext = extRaw === 'jpeg' ? 'jpg' : extRaw;
    const buf = Buffer.from(m[2], 'base64');
    const fname = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    client = await ftpConnect();
    // Upload with explicit path + filename (not relying on cwd)
    await client.uploadFrom(Readable.from(buf), encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + fname));
    res.json({ url: FTP_PUBLIC_BASE + encodeURIComponent(fname), name: fname, size: buf.length });
  } catch (e) {
    console.error('[FTP upload error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// List uploaded images
app.get('/api/uploads', async (req, res) => {
  let client;
  try {
    client = await ftpConnect();
    // List with explicit path (not relying on cwd)
    const items = await client.list(encPath(FTP_REMOTE_DIR));
    // Note: basic-ftp FileInfo.isFile/isDirectory are getters - can't spread. Access directly
    const list = items
      .filter(it => it.isFile)
      .map(it => ({
        name: decName(it.name),
        size: it.size,
        modifiedAt: it.modifiedAt ? new Date(it.modifiedAt).toISOString() : null
      }))
      .filter(it => /\.(jpe?g|png|gif|webp|bmp)$/i.test(it.name))
      .map(it => ({ ...it, url: FTP_PUBLIC_BASE + encodeURIComponent(it.name) }))
      .sort((a, b) => (b.modifiedAt || '').localeCompare(a.modifiedAt || ''));
    res.json(list);
  } catch (e) {
    console.error('[FTP list error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// Delete uploaded image
app.delete('/api/uploads/:name', async (req, res) => {
  let client;
  try {
    const raw = req.params.name || '';
    // Block path traversal
    if (raw.includes('/') || raw.includes('\\') || raw.includes('..')) {
      return res.status(400).json({ error: 'invalid filename' });
    }
    client = await ftpConnect();
    await client.remove(encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + raw));
    res.json({ ok: true });
  } catch (e) {
    console.error('[FTP delete error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// Proxy external images as same-origin (avoid html2canvas CORS taint)
// SSRF protection: only allow IMG_PROXY_ALLOW hostnames (comma-separated), default xngolf.co.kr
const IMG_PROXY_ALLOW = (process.env.IMG_PROXY_ALLOW || 'xngolf.co.kr').split(',').map(s => s.trim()).filter(Boolean);
app.get('/api/img-proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send('url required');
    let parsed;
    try { parsed = new URL(url); } catch (e) { return res.status(400).send('bad url'); }
    if (!IMG_PROXY_ALLOW.includes(parsed.host)) {
      return res.status(403).send('forbidden host');
    }
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) return res.status(r.status).send('upstream ' + r.status);
    const ct = r.headers.get('content-type') || 'image/jpeg';
    if (!ct.startsWith('image/')) return res.status(415).send('not image');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Content-Type', ct);
    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch (e) {
    console.error('[img-proxy]', e.message);
    res.status(500).send(e.message);
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
  const { html, width = 860, scale = 2, format = 'jpeg', quality = 98 } = req.body;
  console.log('[SERVER DEBUG] Received width:', width, 'scale:', scale, 'format:', format);
  if (!html) return res.status(400).json({ error: 'html required' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    console.log('[SERVER DEBUG] Viewport set to:', width, 'x 1080, deviceScaleFactor:', scale);
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
    const loadedHTML = await page.content();
    console.log('[SERVER DEBUG] HTML length:', loadedHTML.length);
    console.log('[SERVER DEBUG] Has #preview:', loadedHTML.includes('id="preview"'));
    await new Promise(r => setTimeout(r, 1200));
    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview not found');

    // Check actual rendered dimensions
    const box = await preview.boundingBox();
    console.log('[SERVER DEBUG] #preview boundingBox:', box);

    const buf = await preview.screenshot({ type: format === 'png' ? 'png' : 'jpeg', quality: format === 'jpeg' ? quality : undefined });
    console.log('[SERVER DEBUG] Screenshot buffer size:', buf.length, 'bytes');
    res.set('Content-Type', format === 'png' ? 'image/png' : 'image/jpeg');
    res.send(buf);
  } catch(e) {
    console.error('[SERVER ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
  finally { if (page) await page.close(); }
});

app.listen(PORT, () => {
  console.log('Detail Page Studio on port', PORT);
});

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});
