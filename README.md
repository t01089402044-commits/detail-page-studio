# Detail Page Studio

Korean e-commerce detail page editor with server-side Puppeteer rendering.

## Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

## Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Deploy to Render.com

1. GitHub에 push
2. render.com → New Web Service
3. Build: `npm install`
4. Start: `node server.js`
5. Plan: Starter ($7/월, Puppeteer 안정)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | 서버 상태 |
| POST | /api/capture | 전체 이미지 캡처 |
| POST | /api/capture/split | 섹션 분할 캡처 |

### POST /api/capture
```json
{
  "html": "...",
  "width": 860,
  "scale": 1,
  "format": "jpeg",
  "quality": 95
}
```

### POST /api/capture/split
```json
{
  "html": "...",
  "width": 860,
  "scale": 1,
  "maxH": 3500,
  "format": "jpeg"
}
```
