const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const R2_BUCKET = process.env.R2_BUCKET || 'dps-templates';
const R2_ENDPOINT = (process.env.R2_ENDPOINT||'').trim().replace(/\/$/, '');
const R2_ACCESS_KEY = (process.env.R2_ACCESS_KEY_ID||'').trim();
const R2_SECRET_KEY = (process.env.R2_SECRET_ACCESS_KEY||'').trim();

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY
  }
});

async function r2Request(method, key, body, contentType) {
  console.log('[R2 Request]', {
    method,
    key,
    bucket: R2_BUCKET,
    region: 'us-east-1',
    endpoint: R2_ENDPOINT,
    bodyLength: body ? (typeof body === 'string' ? body.length : body.length) : 0,
    contentType: contentType || 'application/json'
  });

  try {
    if (method === 'PUT') {
      const cmd = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType || 'application/json'
      });
      console.log('[R2 PUT] Sending command...', { Bucket: R2_BUCKET, Key: key });
      const result = await s3.send(cmd);
      console.log('[R2 PUT OK]', { key, etag: result.ETag });
      return { status: 200, body: '' };
    }

    if (method === 'GET') {
      if (key.startsWith('?list-type=2')) {
        const result = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET }));
        const xml = (result.Contents || []).map(item =>
          `<Contents><Key>${item.Key}</Key><LastModified>${item.LastModified.toISOString()}</LastModified><Size>${item.Size}</Size></Contents>`
        ).join('');
        return { status: 200, body: `<?xml version="1.0"?><ListBucketResult>${xml}</ListBucketResult>` };
      }

      const result = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      const body = await result.Body.transformToString();
      return { status: 200, body };
    }

    if (method === 'DELETE') {
      await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      return { status: 204, body: '' };
    }

    throw new Error('Unsupported method: ' + method);
  } catch (err) {
    console.error('[R2 Error] 상세 정보:', {
      name: err.name,
      message: err.message,
      code: err.Code || err.code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId,
      method,
      key,
      bucket: R2_BUCKET,
      endpoint: R2_ENDPOINT,
      credentialsPrefix: R2_ACCESS_KEY.substring(0, 4)
    });
    console.error('[R2 Error] Full stack:', err.stack);
    return { status: err.$metadata?.httpStatusCode || 500, body: JSON.stringify({ name: err.name, message: err.message, code: err.Code || err.code }) };
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
    accessKeyPrefix: (process.env.R2_ACCESS_KEY_ID||'').substring(0, 4),
    hasSecret: !!(process.env.R2_SECRET_ACCESS_KEY),
    secretLen: (process.env.R2_SECRET_ACCESS_KEY||'').length,
    secretPrefix: (process.env.R2_SECRET_ACCESS_KEY||'').substring(0, 4),
    endpoint: process.env.R2_ENDPOINT,
    bucket: process.env.R2_BUCKET,
    region: 'us-east-1'
  });
});

app.get('/api/test-r2', async (req, res) => {
  console.log('[R2 Test] Starting connection test...');
  try {
    console.log('[R2 Test] Config:', {
      endpoint: R2_ENDPOINT,
      bucket: R2_BUCKET,
      region: 'us-east-1',
      accessKeyPrefix: R2_ACCESS_KEY.substring(0, 4),
      accessKeyLength: R2_ACCESS_KEY.length,
      secretLength: R2_SECRET_KEY.length
    });

    const result = await s3.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      MaxKeys: 1
    }));

    console.log('[R2 Test] SUCCESS:', {
      objectCount: result.KeyCount,
      isTruncated: result.IsTruncated
    });

    res.json({
      ok: true,
      message: 'R2 연결 성공',
      objectCount: result.KeyCount,
      config: {
        endpoint: R2_ENDPOINT,
        bucket: R2_BUCKET,
        region: 'us-east-1'
      }
    });
  } catch (err) {
    console.error('[R2 Test] FAILED:', {
      name: err.name,
      message: err.message,
      code: err.Code || err.code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId,
      stack: err.stack
    });

    res.status(500).json({
      ok: false,
      error: err.message,
      name: err.name,
      code: err.Code || err.code,
      statusCode: err.$metadata?.httpStatusCode,
      details: {
        endpoint: R2_ENDPOINT,
        bucket: R2_BUCKET,
        region: 'us-east-1',
        credentialsOk: !!(R2_ACCESS_KEY && R2_SECRET_KEY)
      }
    });
  }
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
    const key = tpl.name + '.json';
    tpl.savedAt = new Date().toISOString();
    const body = Buffer.from(JSON.stringify(tpl), 'utf8');
    const r = await r2Request('PUT', key, body, 'application/json');
    if(r.status >= 400) throw new Error('저장 실패: '+r.body);
    res.json({ ok: true });
 }catch(e){ console.error('SAVE ERROR:', e.message, e.stack); res.status(500).json({ error: e.message }); }
});

// 템플릿 불러오기
app.get('/api/templates/:name', async (req, res) => {
  try{
    const key = req.params.name + '.json';
    const r = await r2Request('GET', key);
    if(r.status >= 400) return res.status(404).json({ error: '없음' });
    res.json(JSON.parse(r.body));
  }catch(e){ res.status(404).json({ error: e.message }); }
});

// 템플릿 삭제
app.delete('/api/templates/:name', async (req, res) => {
  try{
    const key = req.params.name + '.json';
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