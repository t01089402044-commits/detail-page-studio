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

## 작업 스타일
- 결과물 먼저
- 설명 최소화
- 막히면 즉시 우회로
- 추측 금지 → 실제 코드 확인 후 진행

---

## 주요 작업 내역 (요약)

### 1. AI 카피라이팅 제거
- 외부 AI API 기반 카피라이팅 기능 완전 제거 → 사용자가 직접 입력하는 방식으로 회귀
- 관련 UI(`#ai-copy*` 영역, 자동 생성 버튼)와 호출 코드 정리
- 잔존 흔적은 `c5089cf fix: AI 소재 스펙 3줄 정상 적용` 정도이며 현재 활성 코드에는 AI 호출 없음

### 2. 템플릿 저장 — 파일시스템 방식 (현재 채택)
- 서버: `server.js`의 `/api/templates` 4종 (목록/저장/불러오기/삭제) 모두 `templates/` 디렉토리에 JSON 파일로 처리
- 파일명 sanitization: `name.replace(/[^a-z0-9가-힣_-]/gi, '_') + '.json'`
- 클라이언트: `editor.js`의 `tplServerList/Save/Load/Delete` → 이 API 사용
- 장점: 외부 의존성 0, Render/Railway 디스크에 그대로 영속됨, 서명 오류 없음

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

### 5. R2 (Cloudflare) 시도 → 폐기
- 목적: 템플릿 영구 저장을 Cloudflare R2에 두려 했음
- 시도 순서: 직접 AWS SigV4 서명 → `aws4` 패키지 → `@aws-sdk/client-s3` (forcePathStyle, region 변경) → `minio` 클라이언트 → 연결 테스트 엔드포인트 추가
- 결과: 모든 시도에서 서명/엔드포인트 오류 지속 (host vs hostname, path-style vs virtual-host, region 매핑 등)
- 교훈: R2 자체 문제가 아니라 환경변수/엔드포인트 형식 디버깅 비용이 과도. 파일시스템으로 단순화하는 게 더 빠르고 안정적
- 현재 상태: `12194c2 refactor: R2 제거, 파일시스템 템플릿 저장으로 복원` 커밋에서 모든 R2 코드/의존성 제거

## 보호 구역 (절대 건드리지 말 것)
- `server.js`: `getBrowser()`, `/api/capture` 라우트
- `public/editor.js`: `_FT_FONTS` 배열, `applyFont()`, `bindTF()` (수정 시 반드시 호출 흐름 확인)
