const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const ftp = require('basic-ftp');
const iconv = require('iconv-lite');

// FTP ?ㅼ젙 ???먭꺽利앸챸? 肄붾뱶/repo??諛뺤? ?딄퀬 ?섍꼍蹂?섎쭔 ?ъ슜
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASS = process.env.FTP_PASS || '';
// ???꾨찓??xngolf.co.kr??documentroot媛 FTP??/public/ ?대?濡??ㅼ젣 FTP 寃쎈줈??/public/ ?묐몢???꾩슂
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/public/SE2/upload/?곸꽭?섏씠吏/';
// FTP ?쒕쾭媛 ?붾젆?좊━/?뚯씪紐낆뿉 ?ъ슜?섎뒗 ?몄퐫??(?쒓뎅 ?몄뒪?낆? 蹂댄넻 cp949/euc-kr)
const FTP_PATH_ENCODING = process.env.FTP_PATH_ENCODING || 'cp949';
// 怨듦컻 URL??踰좎씠?? ?쒓뎅???붾젆?좊━??cp949 URL-encoded濡?諛뺤븘??redirect ?놁씠 諛붾줈 200 ?묐떟
// 湲곕낯媛?怨꾩궛? 紐⑤뱢 濡쒕뱶 ?꾩뿉 (urlEncodeCp949 ?⑥닔 ?좎뼵 ?댄썑 ?꾩슂) ???꾨옒?먯꽌 泥섎━
let FTP_PUBLIC_BASE = process.env.FTP_PUBLIC_BASE || '';

// JS 臾몄옄?댁쓣 FTP ?쒕쾭 ?몄퐫??cp949)?쇰줈 蹂????latin1 string (basic-ftp媛 byte-perfect ?꾩넚)
function encPath(s){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return s;
  return iconv.encode(s, FTP_PATH_ENCODING).toString('binary');
}
function decName(latin1){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return latin1;
  return iconv.decode(Buffer.from(latin1, 'binary'), FTP_PATH_ENCODING);
}
// 怨듦컻 URL?? JS 臾몄옄?댁쓽 ?쒓???cp949 諛붿씠?몃줈 蹂????%XX ?쒗?ㅻ줈 (Apache媛 cp949 寃쎈줈濡??몄떇?섎룄濡?
function urlEncodeCp949(s){
  const bytes = iconv.encode(s, FTP_PATH_ENCODING);
  let out = '';
  for (const b of bytes) {
    // ASCII ?덉쟾臾몄옄(?곸닽?? -_.~)??洹몃?濡?
    if ((b>=0x30&&b<=0x39)||(b>=0x41&&b<=0x5A)||(b>=0x61&&b<=0x7A)||b===0x2D||b===0x5F||b===0x2E||b===0x7E) {
      out += String.fromCharCode(b);
    } else {
      out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
    }
  }
  return out;
}

// FTP_PUBLIC_BASE 湲곕낯媛??먮룞 怨꾩궛
// ??URL: https://xngolf.co.kr + (FTP_REMOTE_DIR?먯꽌 /public ?쒓굅??寃쎈줈) ???쒓뎅??遺遺꾩? cp949 URL-encoded
if (!FTP_PUBLIC_BASE) {
  let webPath = FTP_REMOTE_DIR.replace(/^\/public(\/|$)/, '/');
  if (!webPath.endsWith('/')) webPath += '/';
  // 寃쎈줈 ?멸렇癒쇳듃蹂꾨줈 cp949 URL ?몄퐫??(?щ옒?쒕뒗 蹂댁〈)
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
  return name.replace(/[^\w]/gi, '_');
}

// ?쒗뵆由?紐⑸줉
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

// ?쒗뵆由????
app.post('/api/templates/save', (req, res) => {
  try {
    const tpl = req.body;
    if (!tpl || !tpl.name) return res.status(400).json({ error: '?대쫫 ?꾩슂' });
    const fname = safeName(tpl.name) + '.json';
    tpl.savedAt = new Date().toISOString();
    fs.writeFileSync(path.join(TMPL_DIR, fname), JSON.stringify(tpl), 'utf8');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ?쒗뵆由?遺덈윭?ㅺ린
app.get('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (!fs.existsSync(fpath)) return res.status(404).json({ error: '?놁쓬' });
    res.json(JSON.parse(fs.readFileSync(fpath, 'utf8')));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ?쒗뵆由???젣
app.delete('/api/templates/:name', (req, res) => {
  try {
    const fname = safeName(req.params.name) + '.json';
    const fpath = path.join(TMPL_DIR, fname);
    if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FTP ?대씪?댁뼵???앹꽦 + ?붾젆?좊━ 吏꾩엯
// basic-ftp??socket I/O??utf8/binary/utf16le留?吏?? ?쒓뎅 ?몄뒪??cp949 ?붾젆?좊━)
// ?명솚???꾪빐 encoding??'binary'(latin1)濡??먭퀬, ?곕━媛 吏곸젒 iconv濡?蹂?섑븳 諛붿씠?몃? ?꾨떖
async function ftpConnect() {
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    throw new Error('FTP ?섍꼍蹂??誘몄꽕??(FTP_HOST/FTP_USER/FTP_PASS)');
  }
  const client = new ftp.Client(15000);
  client.ftp.encoding = 'binary';
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  // ensureDir: cp949 諛붿씠?몃줈 ?몄퐫?⑸맂 寃쎈줈. 議댁옱?섏? ?딆쑝硫??앹꽦, ?덉쑝硫?cd
  await client.ensureDir(encPath(FTP_REMOTE_DIR));
  return client;
}

// ?대?吏 ?낅줈?? dataURL ??FTP ??public URL 諛섑솚
app.post('/api/upload', async (req, res) => {
  let client;
  try {
    const { dataURL } = req.body || {};
    if (!dataURL) return res.status(400).json({ error: 'dataURL ?꾩슂' });
    const m = dataURL.match(/^data:image\/([a-z0-9+]+);base64,(.+)$/i);
    if (!m) return res.status(400).json({ error: '?섎せ??dataURL ?뺤떇' });
    const extRaw = m[1].toLowerCase();
    const ext = extRaw === 'jpeg' ? 'jpg' : extRaw;
    const buf = Buffer.from(m[2], 'base64');
    const fname = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    client = await ftpConnect();
    // 紐낆떆?곸쑝濡??덈? 寃쎈줈 + ?뚯씪紐?(cwd ?섏〈 ????
    await client.uploadFrom(Readable.from(buf), encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + fname));
    res.json({ url: FTP_PUBLIC_BASE + encodeURIComponent(fname), name: fname, size: buf.length });
  } catch (e) {
    console.error('[FTP upload error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// ?낅줈?쒕맂 ?대?吏 紐⑸줉
app.get('/api/uploads', async (req, res) => {
  let client;
  try {
    client = await ftpConnect();
    // 紐낆떆??path濡?list (cwd ?섏〈?섏? ?딆쓬)
    const items = await client.list(encPath(FTP_REMOTE_DIR));
    // 二쇱쓽: basic-ftp??FileInfo??isFile/isDirectory媛 getter??spread濡??껋뼱踰꾨┝. ?먮낯 媛앹껜?먯꽌 吏곸젒 ?됯?
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

// ?낅줈?쒕맂 ?대?吏 ??젣
app.delete('/api/uploads/:name', async (req, res) => {
  let client;
  try {
    const raw = req.params.name || '';
    // 寃쎈줈 ?대룞 李⑤떒
    if (raw.includes('/') || raw.includes('\\') || raw.includes('..')) {
      return res.status(400).json({ error: '?섎せ???뚯씪紐? });
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

// ?몃? ?대?吏瑜?same-origin?쇰줈 proxy (html2canvas??CORS taint ?뚰뵾??
// SSRF 諛⑹?: ?섍꼍蹂??IMG_PROXY_ALLOW (肄ㅻ쭏 援щ텇) ?먮뒗 湲곕낯 xngolf.co.kr 留??덉슜
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
  if (!html) return res.status(400).json({ error: 'html ?꾩슂' });
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width, height: 1080, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise(r => setTimeout(r, 1200));
    const preview = await page.$('#preview');
    if (!preview) throw new Error('#preview ?놁쓬');
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



