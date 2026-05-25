const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const aws4 = require('aws4');
const R2_BUCKET = process.env.R2_BUCKET || 'dps-templates';
const R2_ENDPOINT = (process.env.R2_ENDPOINT||'').trim().replace(/\/$/, '');
const R2_ACCESS_KEY = (process.env.R2_ACCESS_KEY_ID||'').trim();
const R2_SECRET_KEY = (process.env.R2_SECRET_ACCESS_KEY||'').trim();

async function r2Request(method, key, body, contentType) {
  const http = require('http'), https = require('https');
  const baseUrl = R2_ENDPOINT.includes(R2_BUCKET) ? R2_ENDPOINT : `${R2_ENDPOINT}/${R2_BUCKET}`;
  const url = new URL(`${baseUrl}/${key}`);

  const opts = {
    host: url.hostname,
    path: url.pathname + (url.search || ''),
    method,
    service: 's3',
    region: 'auto',
    headers: {
      'Content-Type': contentType || 'application/octet-stream'
    }
  };

  if (body) {
    opts.body = body;
  }

  aws4.sign(opts, {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY
  });

  return new Promise((resolve, reject) => {
    const requestOpts = {
      hostname: url.hostname,
      port: url.port || 443,
      path: opts.path,
      method: opts.method,
      headers: opts.headers
    };

    const req = (url.protocol === 'https:' ? https : http).request(requestOpts, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
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