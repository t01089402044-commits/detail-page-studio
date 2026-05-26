# FIX_LOG.md — detail-page-studio
# 코드 수정 전 반드시 확인!

---

## ⚠️ 보호 구역 (절대 건드리지 말 것)

| 파일 | 보호 영역 | 이유 |
|---|---|---|
| server.js | getBrowser() 함수 | 브라우저 싱글톤 |
| server.js | /api/capture 라우트 | 캡처 API 핵심 |
| editor.js | _FT_FONTS 배열 | 폰트 목록 |
| editor.js | applyFont() 함수 | 폰트 적용 핵심 |
| editor.js | bindTF() 함수 | tf-wrap 마우스 이벤트 핵심 — 수정 시 호출 흐름 확인 |

---

## 핵심 작업 내역 (Summary)

### 1. AI 카피라이팅 제거
- 외부 AI API 기반 자동 카피 생성 기능 제거 → 사용자 직접 입력 방식
- 잔존 흔적: `c5089cf fix: AI 소재 스펙 3줄 정상 적용` 외 활성 호출 없음

### 2. 템플릿 저장 — 파일시스템 방식 (현재 채택)
- `server.js` `/api/templates` 4종 → `templates/` 디렉토리에 JSON 파일로 처리
- 파일명: `name.replace(/[^a-z0-9가-힣_-]/gi, '_') + '.json'`
- 외부 의존성 0, Render/Railway 디스크에 그대로 영속

### 3. 이미지 bindTF 재연결 버그 → 해결
- 증상: 템플릿 불러오기 후 이미지 드래그/리사이즈 불가
- 원인 1: `rebindPreview()`에서 새로 만든 `.iz-ov`(z-index:30)가 `.tf-wrap`(z-index:5) 마우스 이벤트 가로챔
- 원인 2: `tplSnapshot()`에서 `.tf-handle/.tf-dim` 제거 → 복원 후 핸들 없음
- 해결: snapshot에서 tf 자식 보존 + rebindPreview에서 tf-wrap 있는 iz의 `.iz-ov` `display:none` + file input 비활성화

### 4. HTML 저장 시 CSS 인라인 포함
- 외부 CSS 의존 없이 단일 HTML로 배포 → `<style>` 블록에 모든 사용 CSS + 폰트 CDN 인라인
- 에디터 전용 UI 클래스(iz-ov, tf-handle, tf-dim, tf-lock-badge, resize-bar 등)는 export clone에서 제거
- 관련 커밋: `ecc3705`, `70f117c`, `0cfb330`

### 5. R2 (Cloudflare) 시도 → 폐기
- 시도: 직접 SigV4 → `aws4` → `@aws-sdk/client-s3` (forcePathStyle, region) → `minio`
- 결과: 모든 시도에서 서명/엔드포인트 오류 지속
- 교훈: R2 디버깅 비용 > 파일시스템 단순화 가치
- 폐기: `12194c2 refactor: R2 제거, 파일시스템 템플릿 저장으로 복원`

---

## 수정 이력

### [2026-05-26] editor.js + server.js — JPG 분할 저장 0-canvas 오류 + 이미지 proxy 추가
- 파일: public/editor.js (saveSplit, saveOptimizedSplit), server.js
- 증상: 분할 저장 시 alert "Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The image argument is a canvas element with a width or height of 0."
- 원인: 빈/숨김 섹션에서 html2canvas가 width=0 또는 height=0 canvas를 반환 → 후속 `ctx.drawImage(cv, ...)` 단계에서 throw
- 수정 (editor.js):
  - 캡처 직전 섹션의 `offsetParent !== null` + `getBoundingClientRect()` width/height 양수 검사 (보이지 않는 섹션 스킵)
  - html2canvas 호출 자체를 try/catch로 감싸 캡처 실패 섹션은 captured에서 제외
  - 결과 canvas의 width/height 0이면 captured에서 제외
  - chunk 합치기 시 max-width 사용 (한 섹션 누락돼도 폭 계산 안정)
  - `ctx.drawImage` 직전 한 번 더 0-가드
  - 모든 섹션이 스킵되면 명확한 에러 throw
- 추가 (server.js): `/api/img-proxy?url=...` — 외부 이미지를 same-origin으로 반환 (html2canvas CORS taint 대비). 화이트리스트 `IMG_PROXY_ALLOW`(기본 `xngolf.co.kr`)로 SSRF 차단
- 교훈: html2canvas는 비가시/0-size 요소에서 무조건 에러가 아닌 0-canvas를 돌려줘서 후속 drawImage에서 터짐. 캡처 파이프라인의 모든 단계에 0-가드 필요

### [2026-05-26] editor.js — 이미지 해상도 100% (압축 제거)
- 파일: public/editor.js
- 수정: `compressImage()`에서 Canvas 리사이즈 + JPEG 0.8 재인코딩 로직 제거
- 결과: 원본 파일을 그대로 base64 → FTP 업로드. naturalWidth/Height만 측정해서 initTF에 전달
- 영향: 파일 용량은 커지지만 해상도/품질 100% 유지 (express.json 100mb 한도 내)
- 교훈: 상세페이지는 retina/캡처용 고해상도 필수. 클라이언트 압축은 오버 엔지니어링이었음

### [2026-05-26] server.js — FTP 업로드 한글 경로/인코딩 디버깅 및 수정
- 파일: server.js, package.json (iconv-lite 추가)
- 증상: 업로드는 200 OK + URL 반환되지만 브라우저에서 액박. `/api/uploads` 목록은 항상 `[]`
- 진단:
  1. 한국 호스팅(Apache)이 한국어 디렉토리를 **CP949/EUC-KR 바이트**로 저장. 우리는 `basic-ftp` 기본 UTF-8로 디렉토리 생성 → 별개 디렉토리가 만들어졌고 웹에서 못 찾음 (404)
  2. **FTP 루트(`/`)와 웹 documentroot가 다름** — FTP `/`에는 WordPress 파일들이 있고, 실제 웹 루트는 FTP `/public/` 이었음. 사용자가 알려준 `https://xngolf.co.kr/SE2/upload/상세페이지/`는 FTP의 `/public/SE2/upload/상세페이지/`
  3. `basic-ftp` 의 `FileInfo`는 `isFile/isDirectory`가 **getter** — `{...it}` spread 시 사라져서 filter가 전부 false → `[]`
- 수정:
  - `iconv-lite` 추가, `client.ftp.encoding='binary'` + 모든 경로를 `iconv.encode(s, 'cp949').toString('binary')`로 변환해서 전달 (byte-perfect)
  - `FTP_REMOTE_DIR` 기본값 `/public/SE2/upload/상세페이지/` (`/public/` 접두)
  - `FTP_PUBLIC_BASE` 자동 계산: 한국어 세그먼트를 cp949 URL-encoded (`%BB%F3%BC%BC%C6%E4%C0%CC%C1%F6/`)로 반환 → 브라우저에서 301 redirect 없이 바로 200
  - upload/list/delete 모두 cwd 의존 안 하고 **명시적 절대 경로** 사용
  - list의 `{...it, ...}` 패턴 제거 → filter를 spread 전에 수행
- 환경변수: `FTP_PATH_ENCODING` (선택, 기본 `cp949`) 추가
- 검증: 외부 EUC-KR URL 직접 요청 시 HTTP 200, list 3개 정상 반환, delete OK
- 교훈:
  - 한국 호스팅 FTP는 cp949 디렉토리명 + 웹은 EUC-KR 경로 변환 → byte-perfect 전송 필요
  - basic-ftp의 FileInfo는 클래스 인스턴스. spread 주의
  - FTP 홈 != 웹 documentroot. 항상 실제 경로 탐색 필요

### [2026-05-26] server.js + editor.js + index.html — FTP 이미지 업로드 + 관리 UI
- 파일: server.js, public/editor.js, public/index.html, package.json
- 추가: `basic-ftp` 의존성
- 추가 엔드포인트:
  - `POST /api/upload` — dataURL → FTP 업로드 → public URL 반환
  - `GET /api/uploads` — FTP 디렉토리 내 이미지 목록 (이름/크기/수정시각/URL)
  - `DELETE /api/uploads/:name` — 단일 파일 삭제 (경로이동 차단 검증 포함)
- 환경변수 (Railway/로컬에 설정):
  - `FTP_HOST`, `FTP_USER`, `FTP_PASS` (필수)
  - `FTP_REMOTE_DIR` (선택, 기본 `/SE2/upload/상세페이지/`)
  - `FTP_PUBLIC_BASE` (선택, 기본 `https://xngolf.co.kr/SE2/upload/상세페이지/`)
- 자격증명은 코드/repo에 절대 박지 않음. `process.env` 만 참조
- editor.js:
  - `uploadToFTP(dataURL)` 헬퍼 추가
  - `compressImage()` 흐름 변경: 압축 → /api/upload → URL을 콜백에 전달. 업로드 실패 시 dataURL fallback + 사용자 알림
  - `buildIzOverlay` 내부 업로드 핸들러도 `compressImage` 사용으로 통합 (FTP 일관 적용)
  - 새 UI: 툴바 "🖼 이미지 관리" 버튼 + `#uploads-modal` (그리드형 썸네일 리스트, 개별 삭제/URL 복사, **중복 정리** — 현재 프리뷰에서 사용 중이지 않은 파일 일괄 삭제)
- 보호: 기존 `/api/capture`, `getBrowser()`, 템플릿 4개 API 변경 없음
- 교훈: base64 dataURL을 그대로 템플릿에 저장하면 크기 폭증 → CDN/FTP URL만 저장하는 게 정답

### [2026-05-26] server.js + editor.js — 업로드 용량 증가 + 클라이언트 자동 압축
- 파일: server.js, public/editor.js
- 수정: `app.use(express.json({ limit: '30mb' → '100mb' }))`
- 추가: `compressImage(file, cb)` 헬퍼 (Canvas 리사이즈/JPEG 0.8 인코딩, 너비 860px 초과 시에만 처리, toDataURL 실패 시 원본 fallback)
- 수정: `pv()`, `izClickOpen()` → FileReader/Image 직접 호출 대신 `compressImage` 사용
- 보호: `initTF()`, `buildIzOverlay()` 내부 호출은 미변경 (사용자 명시 범위 외)
- 교훈: payload 한도 늘리는 동시에 클라이언트에서 줄여야 서버 부하/저장 용량 모두 절감

### [2026-05-26] editor.js — 템플릿 불러오기 후 이미지 크기조절 불가 버그 수정
- 파일: public/editor.js
- 수정: tplSnapshot()의 clone clean 대상에서 `.tf-handle,.tf-border,.tf-dim,.tf-lock-badge` 제외 (저장 시 보존)
- 수정: rebindPreview()의 iz 루프에서 `tf-wrap` 있으면 `.iz-ov` `display:none` + file input 비활성화 추가
- 보호: bindTF() 본체, initTF() 본체, tplApply() 본체 — 변경 없음
- 교훈: opacity:0인 오버레이도 pointer-events가 명시 안 되면 이벤트 가로챔 / 저장 시 너무 많이 stripping하면 복원 깨짐

### [2026-05-26] server.js — R2 전체 제거, 파일시스템 템플릿으로 복원
- 파일: server.js, package.json
- 제거: @aws-sdk/client-s3 import, S3Client, r2Request 함수
- 제거: /api/debug-env, /api/test-r2 엔드포인트
- 제거: package.json 의존성 @aws-sdk/client-s3, minio
- 수정: /api/templates, /api/templates/save, /api/templates/:name (GET/DELETE) 모두 fs 기반으로 복원 (templates/ 디렉토리)
- 추가: safeName() 헬퍼 + 모든 API에 try/catch
- 보호: getBrowser(), /api/capture 라우트 유지
- 교훈: R2 서명 오류 해결 시도 반복 → 파일시스템 단순화가 더 안정적

### [2026-05-26] server.js — R2 연결 테스트 API + 상세 로그
- 파일: server.js
- 추가: /api/test-r2 엔드포인트 (ListObjectsV2 테스트)
- 추가: r2Request 함수 상세 에러 로그 (name, code, requestId, stack)
- 추가: /api/debug-env에 credentials prefix 출력
- 목적: 서명 오류 원인 정확히 파악
- 참고: region: 'us-east-1', @aws-sdk/client-s3 사용 중

### [2026-05-26] server.js — R2 AWS SDK 시도 (실패)
- 파일: server.js
- 수정: aws4 → @aws-sdk/client-s3 (S3Client) 사용
- 결과: forcePathStyle 등 모든 옵션 시도했으나 서명 오류 지속
- 보호: API 엔드포인트 동일 (/api/templates/save 등)

### [2026-05-26] server.js — R2 서명 aws4 시도 (실패)
- 파일: server.js, package.json
- 수정: 직접 구현한 AWS Signature V4 코드 → aws4 패키지 시도
- 결과: 서명 오류 지속 (host/hostname 혼동 등)
- 교훈: R2는 공식 AWS SDK 사용이 정답

### [2026-05-25] server.js — 이미지 품질 + 폰트 가독성
- 파일: server.js
- 수정: scale 기본값 1→2, 폰트 대기 시간 500ms→1200ms
- 추가: --font-render-hinting=none, waitForFonts() 함수
- 보호: getBrowser() args 배열

### [2026-05-25] editor.js — 폰트 드롭다운 null 체크
- 파일: public/editor.js
- 수정: mouseover/click 이벤트 null 체크 강화
- 보호: _FT_FONTS 배열 구조

### [2026-05-25] editor.js — 폰트 추가 + 드롭다운 위치
- 파일: public/editor.js, public/index.html
- 추가: Gmarket Sans, SUIT, Nanum Myeongjo
- 수정: ft-font-dropdown position:fixed로 변경
- 수정: ftFontPickerToggle에 위치 계산 추가

### [2026-05-25] editor.css — 모바일 가독성
- 파일: public/editor.css
- 추가: @media max-width:600px 폰트 크기 clamp()
- 보호: 기존 미디어 쿼리

---

## 수정 양식
```
### [YYYY-MM-DD] 파일명 — 수정 내용
- 파일: 
- 수정: 
- 추가: 
- 보호: 
- 교훈: 
```

### [2026-05-25] detail-page-studio 폰트 수정
- 파일: public/editor.js, public/index.html, public/editor.css
- 수정: 폰트 드롭다운 위로 열기, 폰트 클릭 적용, 모바일 가독성
- 보호: _FT_FONTS 배열 구조 유지
- 교훈: 로컬 테스트 없이 Railway 배포 반복 → 비효율

### [2026-05-25] detail-page-studio 폰트 수정
- 파일: public/editor.js, public/index.html, public/editor.css
- 수정: 폰트 드롭다운 위로 열기, 폰트 클릭 적용, 모바일 가독성
- 보호: _FT_FONTS 배열 구조 유지
- 교훈: 로컬 테스트 없이 Railway 배포 반복 → 비효율
