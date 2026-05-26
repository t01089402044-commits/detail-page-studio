const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const ftp = require('basic-ftp');
const iconv = require('iconv-lite');

// FTP 설정 — 자격증명은 코드/repo에 박지 않고 환경변수만 사용
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASS = process.env.FTP_PASS || '';
// 웹 도메인 xngolf.co.kr의 documentroot가 FTP의 /public/ 이므로 실제 FTP 경로는 /public/ 접두사 필요
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/public/SE2/upload/상세페이지/';
// FTP 서버가 디렉토리/파일명에 사용하는 인코딩 (한국 호스팅은 보통 cp949/euc-kr)
const FTP_PATH_ENCODING = process.env.FTP_PATH_ENCODING || 'cp949';
// 공개 URL용 베이스. 한국어 디렉토리는 cp949 URL-encoded로 박아서 redirect 없이 바로 200 응답
// 기본값 계산은 모듈 로드 후에 (urlEncodeCp949 함수 선언 이후 필요) — 아래에서 처리
let FTP_PUBLIC_BASE = process.env.FTP_PUBLIC_BASE || '';

// JS 문자열을 FTP 서버 인코딩(cp949)으로 변환 → latin1 string (basic-ftp가 byte-perfect 전송)
function encPath(s){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return s;
  return iconv.encode(s, FTP_PATH_ENCODING).toString('binary');
}
function decName(latin1){
  if (FTP_PATH_ENCODING === 'utf8' || FTP_PATH_ENCODING === 'utf-8') return latin1;
  return iconv.decode(Buffer.from(latin1, 'binary'), FTP_PATH_ENCODING);
}
// 공개 URL용: JS 문자열의 한글을 cp949 바이트로 변환 후 %XX 시퀀스로 (Apache가 cp949 경로로 인식하도록)
function urlEncodeCp949(s){
  const bytes = iconv.encode(s, FTP_PATH_ENCODING);
  let out = '';
  for (const b of bytes) {
    // ASCII 안전문자(영숫자, -_.~)는 그대로
    if ((b>=0x30&&b<=0x39)||(b>=0x41&&b<=0x5A)||(b>=0x61&&b<=0x7A)||b===0x2D||b===0x5F||b===0x2E||b===0x7E) {
      out += String.fromCharCode(b);
    } else {
      out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
    }
  }
  return out;
}

// FTP_PUBLIC_BASE 기본값 자동 계산
// 웹 URL: https://xngolf.co.kr + (FTP_REMOTE_DIR에서 /public 제거한 경로) — 한국어 부분은 cp949 URL-encoded
if (!FTP_PUBLIC_BASE) {
  let webPath = FTP_REMOTE_DIR.replace(/^\/public(\/|$)/, '/');
  if (!webPath.endsWith('/')) webPath += '/';
  // 경로 세그먼트별로 cp949 URL 인코딩 (슬래시는 보존)
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
// basic-ftp는 socket I/O에 utf8/binary/utf16le만 지원. 한국 호스팅(cp949 디렉토리)
// 호환을 위해 encoding을 'binary'(latin1)로 두고, 우리가 직접 iconv로 변환한 바이트를 전달
async function ftpConnect() {
  if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
    throw new Error('FTP 환경변수 미설정 (FTP_HOST/FTP_USER/FTP_PASS)');
  }
  const client = new ftp.Client(15000);
  client.ftp.encoding = 'binary';
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  // ensureDir: cp949 바이트로 인코딩된 경로. 존재하지 않으면 생성, 있으면 cd
  await client.ensureDir(encPath(FTP_REMOTE_DIR));
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
    // 명시적으로 절대 경로 + 파일명 (cwd 의존 안 함)
    await client.uploadFrom(Readable.from(buf), encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + fname));
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
    // 명시적 path로 list (cwd 의존하지 않음)
    const items = await client.list(encPath(FTP_REMOTE_DIR));
    // 주의: basic-ftp의 FileInfo는 isFile/isDirectory가 getter라 spread로 잃어버림. 원본 객체에서 직접 평가
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
    await client.remove(encPath(FTP_REMOTE_DIR.replace(/\/$/, '') + '/' + raw));
    res.json({ ok: true });
  } catch (e) {
    console.error('[FTP delete error]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (client) client.close();
  }
});

// 외부 이미지를 same-origin으로 proxy (html2canvas의 CORS taint 회피용)
// SSRF 방지: 환경변수 IMG_PROXY_ALLOW (콤마 구분) 또는 기본 xngolf.co.kr 만 허용
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
