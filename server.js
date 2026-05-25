const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');
const R2_BUCKET = process.env.R2_BUCKET || 'dps-templates';
const R2_ENDPOINT = (process.env.R2_ENDPOINT||'').trim().replace(/\/$/, '');
const R2_ACCESS_KEY = (process.env.R2_ACCESS_KEY_ID||'').trim();
const R2_SECRET_KEY = (process.env.R2_SECRET_ACCESS_KEY||'').trim();

function hmac(key, str, enc) {
  return crypto.createHmac('sha256', key).update(str, 'utf8').digest(enc||'buffer');
}
function hash(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}
async function r2Request(method, key, body, contentType) {
  const http = require('http'), https = require('https');
  const baseUrl = R2_ENDPOINT.includes(R2_BUCKET) ? R2_ENDPOINT : `${R2_ENDPOINT}/${R2_BUCKET}`;
  const url = new URL(`${baseUrl}/${key}`);
  const now = new Date();
  const date = now.toISOString().replace(/[:-]/g,'').replace(/\.\d{3}/,'');
  const dateShort = date.slice(0,8);
  const region = 'auto';
  const service = 's3';
  const bodyHash = body ? hash(typeof body==='string'?body:body.toString()) : hash('');
  const headers = {
    'host': url.host,
    'x-amz-date': date,
    'x-amz-content-sha256': bodyHash,
    ...(contentType ? {'content-type': contentType} : {}),
  };
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map(k=>`${k}:${headers[k]}\n`).join('');
  const canonicalRequest = [method, url.pathname, url.search.slice(1)||'', canonicalHeaders, signedHeaders, bodyHash].join('\n');
  const credentialScope = `${dateShort}/${region}/${service}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', date, credentialScope, hash(canonicalRequest)].join('\n');
  const signingKey = hmac(hmac(hmac(hmac('AWS4'+R2_SECRET_KEY, dateShort), region), service), 'aws4_request');
  const signature = hmac(signingKey, stringToSign, 'hex');
  const authorization = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return new Promise((resolve, reject) => {
    const opts = {
      hostname: url.hostname,
      port: url.port||443,
      path: url.pathname + (url.search||''),
      method,
      headers: { ...headers, 'Authorization': authorization, ...(body?{'content-length':Buffer.byteLength(body)}:{}) },
    };
    const req = (url.protocol==='https:'?https:http).request(opts, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    if(body) req.write(body);
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
  }catch(e){ res.status(500).json({ error: e.message }); }
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