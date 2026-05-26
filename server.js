const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const ftp = require('basic-ftp');
const iconv = require('iconv-lite');

// FTP ?¤ì • ???ê²©ì¦ëª…?€ ì½”ë“œ/repo??ë°•ì? ?Šê³  ?˜ê²½ë³€?˜ë§Œ ?¬ìš©
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASS = process.env.FTP_PASS || '';
// ???„ë©”??xngolf.co.kr??documentrootê°€ FTP??/public/ ?´ë?ë¡??¤ì œ FTP ê²½ë¡œ??/public/ ?‘ë‘???„ìš”
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/public/SE2/upload/?ì„¸?˜ì´ì§€/';
// FTP ?œë²„ê°€ ?”ë ‰? ë¦¬/?Œì¼ëª…ì— ?¬ìš©?˜ëŠ” ?¸ì½”??(?œêµ­ ?¸ìŠ¤?…ì? ë³´í†µ cp949/euc-kr)
const FTP_PATH_ENCODING = process.env.FTP_PATH_ENCODING || 'cp949';
// ê³µê°œ URL??ë² ì´?? ?œêµ­???”ë ‰? ë¦¬??cp949 URL-encodedë¡?ë°•ì•„??redirect ?†ì´ ë°”ë¡œ 200 ?‘ë‹µ
// ê¸°ë³¸ê°?ê³„ì‚°?€ ëª¨ë“ˆ ë¡œë“œ ?„ì— (urlEncodeCp949 ?¨ìˆ˜ ? ì–¸ ?´í›„ ?„ìš”) ???„ëž˜?ì„œ ì²˜ë¦¬
let FTP_PUBLIC_BASE = process.env.FTP_PUBLIC_BASE || '';

// JS ë¬¸ìž?´ì„ FTP ?œë²„ ?¸ì½”??cp949)?¼ë¡œ ë³€????latin1 string (basic-ftpê°€ byte-perfect ?„ì†¡)
function encPath(s){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return s;
  return iconv.encode(s, FTP_PATH_ENCODING).toString('binary');
}
function decName(latin1){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return latin1;
  return iconv.decode(Buffer.from(latin1, 'binary'), FTP_PATH_ENCODING);
}
// ê³µê°œ URL?? JS ë¬¸ìž?´ì˜ ?œê???cp949 ë°”ì´?¸ë¡œ ë³€????%XX ?œí€€?¤ë¡œ (Apacheê°€ cp949 ê²½ë¡œë¡??¸ì‹?˜ë„ë¡?
function urlEncodeCp949(s){
  const bytes = iconv.encode(s, FTP_PATH_ENCODING);
  let out = '';
  for (const b of bytes) {
    // ASCII ?ˆì „ë¬¸ìž(?ìˆ«?? -_.~)??ê·¸ë?ë¡?
    if ((b>=0x30&&b<=0x39)||(b>=0x41&&b<=0x5A)||(b>=0x61&&b<=0x7A)||b===0x2D||b===0x5F||b===0x2E||b===0x7E) {
      out += String.fromCharCode(b);
    } else {
      out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
    }
  }
  return out;
}

// FTP_PUBLIC_BASE ê¸°ë³¸ê°??ë™ ê³„ì‚°
// ??URL: https://xngolf.co.kr + (FTP_REMOTE_DIR?ì„œ /public ?œê±°??ê²½ë¡œ) ???œêµ­??ë¶€ë¶„ì? cp949 URL-encoded
if (!FTP_PUBLIC_BASE) {
  let webPath = FTP_REMOTE_DIR.replace(/^\/public(\/|$)/, '/');
  if (!webPath.endsWith('/')) webPath += '/';
  // ê²½ë¡œ ?¸ê·¸ë¨¼íŠ¸ë³„ë¡œ cp949 URL ?¸ì½”??(?¬ëž˜?œëŠ” ë³´ì¡´)
  const encodedPath = webPath.split('/').map(seg => seg ? urlEncodeCp949(seg) : seg).join('/');
  FTP_PUBLIC_BASE = 'https://xngolf.co.kr' + encodedPath;
}

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
  return name.replace(/[^a-z0-9ê°€-??-]/gi, '_');
}

// ?œí”Œë¦?ëª©ë¡
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

// ?œí”Œë¦??€??
app.post('/api/templates/save', (req, res) => {
  try {
    const tpl = req.body;
    if (!tpl || !tpl.name) return res.status(400).json({ error: '?´ë¦„ ?„ìš”' });
    const fname = safeName(tpl.name) + '.json';
    tpl.savedAt = new Date().toISOString();
    fs.writeFileSync(path.join(TMPL_DIR, fname), JSON.stringify(tpl), 'utf8');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ?œí”Œë¦?ë¶ˆëŸ¬?¤ê¸°
app.get('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (!fs.existsSync(fpath)) return res.status(404).json({ error: '?†ìŒ' });
    res.json(JSON.parse(fs.readFileSync(fpath, 'utf8')));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ?œí”Œë¦??? œ
app.delete('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FTP ?´ë¼?´ì–¸???ì„± + ?”ë ‰? ë¦¬ ì§„ìž…
// basic-ftp??socket I/O??utf8/binary/utf16leë§?ì§€?? ?œêµ­ ?¸ìŠ¤??cp949 ?”ë ‰? ë¦¬)
// ?¸í™˜???„í•´ encoding??'binary'(latin1)ë¡??ê³ , ?°ë¦¬ê°€ ì§ì ‘ iconvë¡?ë³€?˜í•œ ë°”ì´?¸ë? ?„ë‹¬
async function ftpConnect() {
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    throw new Error('FTP ?˜ê²½ë³€??ë¯¸ì„¤??(FTP_HOST/FTP_USER/FTP_PASS)');
  }
  const client = new ftp.Client(15000);
  client.ftp.encoding = 'binary';
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  // ensureDir: cp949 ë°”ì´?¸ë¡œ ?¸ì½”?©ëœ ê²½ë¡œ. ì¡´ìž¬?˜ì? ?Šìœ¼ë©??ì„±, ?ˆìœ¼ë©?cd
  await client.ensureDir(encPath(FTP_REMOTE_DIR));
  return client;
}

// ?´ë?ì§€ ?…ë¡œ?? dataURL ??FTP ??public URL ë°˜í™˜
app.post('/api/upload', async (req, res) => {
  let client;
  try {
    const { dataURL } = req.body || {};
    if (!dataURL) return res.status(400).json({ error: 'dataURL ?„ìš”' });
    const m = dataURL.match(/^data:image\/([a-z0-9+]+);base64,(.+)$/i);
    if (!m) return res.status(400).json({ error: '?˜ëª»??dataURL ?•ì‹' });
    const extRaw = m[1].toLowerCase();
    const ext = extRaw === 'jpeg' ? 'jpg' : extRaw;
    const buf = Buffer.from(m[2], 'base64');
    const fname = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    client = await ftpConnect();
    // ëª…ì‹œ?ìœ¼ë¡??ˆë? ê²½ë¡œ + ?Œì¼ëª?(cwd ?˜ì¡´ ????
    await client.uploadFrom(Readable.from(buf), encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + fname));
    res.json({ url: FTP_PUBLIC_BASE + encodeURIComponent(fname), name: fname, size: buf.length });
  } catch (e) {
    console.error('[FTP upload error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// ?…ë¡œ?œëœ ?´ë?ì§€ ëª©ë¡
app.get('/api/uploads', async (req, res) => {
  let client;
  try {
    client = await ftpConnect();
    // ëª…ì‹œ??pathë¡?list (cwd ?˜ì¡´?˜ì? ?ŠìŒ)
    const items = await client.list(encPath(FTP_REMOTE_DIR));
    // ì£¼ì˜: basic-ftp??FileInfo??isFile/isDirectoryê°€ getter??spreadë¡??ƒì–´ë²„ë¦¼. ?ë³¸ ê°ì²´?ì„œ ì§ì ‘ ?‰ê?
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

// ?…ë¡œ?œëœ ?´ë?ì§€ ?? œ
app.delete('/api/uploads/:name', async (req, res) => {
  let client;
  try {
    const raw = req.params.name || '';
    // ê²½ë¡œ ?´ë™ ì°¨ë‹¨
    if (raw.includes('/') || raw.includes('\\') || raw.includes('..')) {
      return res.status(400).json({ error: '?˜ëª»???Œì¼ëª? });
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

// ?¸ë? ?´ë?ì§€ë¥?same-origin?¼ë¡œ proxy (html2canvas??CORS taint ?Œí”¼??
// SSRF ë°©ì?: ?˜ê²½ë³€??IMG_PROXY_ALLOW (ì½¤ë§ˆ êµ¬ë¶„) ?ëŠ” ê¸°ë³¸ xngolf.co.kr ë§??ˆìš©
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
  if (!html) return res.status(400).json({ error: 'html ?„ìš”' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise(r => setTimeout(r, 1200));
    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview ?†ìŒ');
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

