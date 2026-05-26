# Mr. HJ (BeneMotto) — CLAUDE.md

## 프로젝트별 작업 규칙

### detail-page-studio 작업 시 필수 순서
1. 반드시 파일 읽기 먼저 (Read tool)
2. 수정 전 문자열 존재 확인 (Bash: grep)
3. 로컬 서버 실행 확인 (http://localhost:3000)
4. 수정 → 로컬 브라우저 확인 → push
5. 추측으로 replace 금지

### 코드 수정 규칙
- replace 전 반드시: grep으로 문자열 존재 확인
- 수정 범위 최소화
- 동작 중인 코드 무단 변경 금지
- 수정 후 FIX_LOG.md 업데이트

### 로컬 테스트 명령
```
cd C:\Users\82108\jarvis\detail-page-studio
npm install
node server.js
# → http://localhost:3000 에서 확인
```

### Git push 전 체크리스트
- [ ] 로컬에서 직접 확인 완료
- [ ] 기존 기능 정상 동작
- [ ] FIX_LOG.md 업데이트

## 필수 테스트 절차
1. **로컬 문법 체크**: `node server.js` 실행해서 SyntaxError 없는지 확인
2. **Railway 배포 후 2분 대기**: git push 후 Railway 자동 배포 완료 시간
3. **실제 URL fetch로 응답 확인**: `https://detail-page-studio-production.up.railway.app/api/*` 직접 호출
4. **브라우저에서 동작 확인 요청**: 사용자에게 실제 동작 확인 요청
5. **확인 전까지 "완료" 보고 금지**: 모든 단계 완료 후에만 최종 보고

## 자주 하는 실수
❌ **로컬만 테스트하고 Railway 실제 환경 미확인**
  - Railway 환경변수, ephemeral filesystem 등 배포 환경 차이 간과
  - 해결: 배포 후 반드시 실제 URL로 API 테스트

❌ **한글 문자열 PowerShell로 수정 시 인코딩 깨짐**
  - PowerShell의 기본 인코딩이 UTF-8이 아닐 수 있음
  - 해결: 한글 포함 파일은 Write tool로 전체 재작성 또는 영어로 교체

❌ **git pull 없이 push해서 충돌**
  - 원격 변경사항 무시하고 push → rejected
  - 해결: push 전 `git pull --rebase` 또는 push 실패 시 즉시 pull

## 작업 스타일
- 결과물 먼저
- 설명 최소화
- 막히면 즉시 우회로
- 추측 금지 → 실제 코드 확인 후 진행

## 절대 금지 사항
- ❌ 원인 확인 전 추측으로 코드 수정 금지
- ❌ "이게 원인인 것 같습니다" → 수정 전 반드시 증거 제시
- ❌ 원인 커밋 특정 전 코드 변경 금지
- ❌ 로컬 테스트만 하고 Railway 확인 없이 완료 보고 금지

## PowerShell 파일 수정 시 필수
⚠️ **인코딩 문제로 한글 깨짐 방지**
- `Set-Content` 사용 시 반드시 `-Encoding UTF8` 옵션 추가
- `Get-Content` 사용 시 반드시 `-Encoding UTF8` 옵션 추가
- 잘못하면 한글 전체 깨져서 SyntaxError 발생
- **파일 수정은 Edit tool 사용 권장** (PowerShell 대신)

## 문제 해결 순서
1. **증거 수집** (git log, 코드 확인)
2. **원인 특정** (어느 커밋, 어느 줄)
3. **수정 계획 보고**
4. **승인 후 수정**
5. **Railway 실제 확인**
6. **완료 보고**

---

## 주요 작업 내역 (요약)

### 1. AI 카피라이팅 제거
- 외부 AI API 기반 카피라이팅 기능 완전 제거 → 사용자가 직접 입력하는 방식으로 회귀
- 관련 UI(`#ai-copy*` 영역, 자동 생성 버튼)와 호출 코드 정리
- 잔존 흔적은 `c5089cf fix: AI 소재 스펙 3줄 정상 적용` 정도이며 현재 활성 코드에는 AI 호출 없음

### 2. 템플릿 저장 — FTP 방식 (현재 채택)
- **2026-05-26 변경**: Railway ephemeral filesystem 대응 → 로컬 파일시스템에서 FTP로 전환
- 서버: `server.js`의 `/api/templates` 4종 (목록/저장/불러오기/삭제) 모두 FTP 기반
- 저장 경로: `FTP_TEMPLATE_DIR=/public/SE2/upload/templates/` (환경변수로 설정 가능)
- 파일명 sanitization: `name.replace(/[^\w]/gi, '_') + '.json'`
- 클라이언트: `editor.js`의 `tplServerList/Save/Load/Delete` → 이 API 사용
- 장점: Railway 재배포 후에도 템플릿 영속, 이미지 업로드와 동일한 FTP 인프라 사용
- 커밋: `4087ff3 feat: 템플릿 저장을 FTP로 변경`

### 3. 이미지 bindTF 재연결 버그 (해결됨)
- 증상: 템플릿 불러오기 후 이미지 드래그/리사이즈 불가
- 원인 1: `rebindPreview()`에서 `buildIzOverlay()`로 새 `.iz-ov`(z-index:30)를 만들면서 `.tf-wrap`(z-index:5)의 마우스 이벤트를 가로챔
- 원인 2: `tplSnapshot()`에서 `.tf-handle, .tf-dim`을 저장 전 제거 → 복원 시 핸들 자체가 없어 크기 조절 불가
- 해결: snapshot에서 `.tf-handle/.tf-border/.tf-dim/.tf-lock-badge` 보존 + `rebindPreview()`에서 tf-wrap이 있는 iz는 `.iz-ov`를 `display:none` 처리, file input 비활성화

### 4. HTML 저장 시 CSS 인라인 포함
- 외부 CSS 의존 없이 HTML 단일 파일로 배포 가능하도록 export 시 `<style>` 블록에 모든 사용 CSS 인라인
- 폰트 CDN(`Pretendard`, `Gmarket Sans`, `SUIT`, `Nanum Myeongjo` 등)도 함께 포함
- 에디터 전용 UI 클래스(`iz-ov, tf-handle, tf-dim, tf-lock-badge, resize-bar, sec-toolbar, del-btn, add-btn, ico-btn, iz-zone-del`)는 export clone에서 제거
- 관련 커밋: `ecc3705`, `70f117c`, `0cfb330`

### 5-1. FTP 이미지 업로드 (현재 채택)
- 이미지 업로드 시 클라이언트가 Canvas로 압축 → `/api/upload` POST → 서버가 `basic-ftp`로 외부 FTP에 저장 → public URL 반환
- 템플릿/HTML에는 base64가 아닌 URL만 저장 (저장 용량 폭증 방지)
- 관리 UI: 툴바 "🖼 이미지 관리" → 그리드 썸네일 + 개별 삭제 + URL 복사 + "중복 정리"(프리뷰 미사용 파일 일괄 삭제)
- 한국 호스팅 인코딩 처리: `client.ftp.encoding='binary'` + `iconv-lite`로 CP949 byte-perfect 전송. 공개 URL도 cp949 URL-encoded(`%BB%F3%BC%BC%C6%E4%C0%CC%C1%F6`)로 반환해 301 redirect 회피
- FTP 홈 ≠ 웹 documentroot: 이 호스팅의 경우 FTP `/public/`이 `xngolf.co.kr`의 documentroot. 기본 `FTP_REMOTE_DIR=/public/SE2/upload/상세페이지/`
- 필수 환경변수: `FTP_HOST`, `FTP_USER`, `FTP_PASS`
- 선택 환경변수: `FTP_REMOTE_DIR`, `FTP_PUBLIC_BASE`, `FTP_PATH_ENCODING`(기본 `cp949`)
- ⚠ 자격증명은 코드/repo에 절대 박지 않음 — `process.env`만 사용. 로컬 테스트 시 PowerShell `$env:FTP_PASS='...'` 또는 별도 `.env`+dotenv

### 5. R2 (Cloudflare) 시도 → 폐기
- 목적: 템플릿 영구 저장을 Cloudflare R2에 두려 했음
- 시도 순서: 직접 AWS SigV4 서명 → `aws4` 패키지 → `@aws-sdk/client-s3` (forcePathStyle, region 변경) → `minio` 클라이언트 → 연결 테스트 엔드포인트 추가
- 결과: 모든 시도에서 서명/엔드포인트 오류 지속 (host vs hostname, path-style vs virtual-host, region 매핑 등)
- 교훈: R2 자체 문제가 아니라 환경변수/엔드포인트 형식 디버깅 비용이 과도. 파일시스템으로 단순화하는 게 더 빠르고 안정적
- 현재 상태: `12194c2 refactor: R2 제거, 파일시스템 템플릿 저장으로 복원` 커밋에서 모든 R2 코드/의존성 제거

## 보호 구역 (절대 건드리지 말 것)
- `server.js`: `getBrowser()`, `/api/capture` 라우트
- `public/editor.js`: `_FT_FONTS` 배열, `applyFont()`, `bindTF()` (수정 시 반드시 호출 흐름 확인)
