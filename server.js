const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const Minio = require('minio');

const R2_BUCKET = process.env.R2_BUCKET || 'dps-templates';
const R2_ENDPOINT = (process.env.R2_ENDPOINT||'').trim().replace(/\/$/, '').replace(/^https?:\/\//, '');
const R2_ACCESS_KEY = (process.env.R2_ACCESS_KEY_ID||'').trim();
const R2_SECRET_KEY = (process.env.R2_SECRET_ACCESS_KEY||'').trim();

const minioClient = new Minio.Client({
  endPoint: R2_ENDPOINT,
  accessKey: R2_ACCESS_KEY,
  secretKey: R2_SECRET_KEY,
  useSSL: true
});

async function r2Request(method, key, body, contentType) {
  console.log('[R2 Request]', { method, key, bucket: R2_BUCKET });
  try {
    if (method === 'PUT') {
      const buffer = Buffer.from(body, 'utf8');
      const metadata = { 'Content-Type': contentType || 'application/json' };
      await minioClient.putObject(R2_BUCKET, key, buffer, buffer.length, metadata);
      console.log('[R2 PUT OK]', key);
      return { status: 200, body: '' };
    }

    if (method === 'GET') {
      if (key.startsWith('?list-type=2')) {
        const stream = minioClient.listObjectsV2(R2_BUCKET, '', true);
        const items = [];
        await new Promise((resolve, reject) => {
          stream.on('data', obj => items.push(obj));
          stream.on('end', resolve);
          stream.on('error', reject);
        });
        const xml = items.map(item =>
          `<Contents><Key>${item.name}</Key><LastModified>${item.lastModified.toISOString()}</LastModified><Size>${item.size}</Size></Contents>`
        ).join('');
        return { status: 200, body: `<?xml version="1.0"?><ListBucketResult>${xml}</ListBucketResult>` };
      }

      const stream = await minioClient.getObject(R2_BUCKET, key);
      const chunks = [];
      await new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', resolve);
        stream.on('error', reject);
      });
      return { status: 200, body: Buffer.concat(chunks).toString('utf8') };
    }

    if (method === 'DELETE') {
      await minioClient.removeObject(R2_BUCKET, key);
      return { status: 204, body: '' };
    }

    throw new Error('Unsupported method: ' + method);
  } catch (err) {
    console.error('[R2 Error]', err);
    return { status: 500, body: err.message };
  }
}
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
    const r = await r2Request('GET', `?list-type=2&bucket=${R2_BUCKET}`);
    const matches = [...r.body.matchAll(/<Key>([^<]+)<\/Key>.*?<LastModified>([^<]+)<\/LastModified>.*?<Size>([^<]+)<\/Size>/gs)];
    const list = matches.map(m => ({
      name: decodeURIComponent(m[1].replace('.json','')),
      savedAt: m[2],
      size: parseInt(m[3])
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
    const body = JSON.stringify(tpl);
    const r = await r2Request('PUT', key, body, 'application/json');
    if(r.status >= 400) throw new Error('저장 실패: '+r.body);
    res.json({ ok: true });
 }catch(e){ console.error('SAVE ERROR:', e.message, e.stack); res.status(500).json({ error: e.message }); }
});

// 템플릿 불러오기
app.get('/api/templates/:name', async (req, res) => {
  try{
    const key = encodeURIComponent(req.params.name) + '.json';
    const r = await r2Request('GET', key);
    if(r.status >= 400) return res.status(404).json({ error: '없음' });
    res.json(JSON.parse(r.body));
  }catch(e){ res.status(404).json({ error: e.message }); }
});

// 템플릿 삭제
app.delete('/api/templates/:name', async (req, res) => {
  try{
    const key = encodeURIComponent(req.params.name) + '.json';
    await r2Request('DELETE', key);
    res.json({ ok: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
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