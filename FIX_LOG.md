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

### [2026-06-16] 저장해상도·폰트·AI제거·모바일·템플릿 일괄 개선
- 파일: public/editor.js, public/index.html, public/editor.css
- **저장 해상도 (네이버 860 규격 + 이중압축 대비)**:
  - doSave 저장폭 1080 검토 후 → 860 확정(네이버 규격, 리사이즈 손실 제거). 편집 프리뷰 미변경(clone으로 캡처)
  - JPG 2×(1720)/3×(2580) 옵션, 무손실 **PNG 단일/분할** 추가 (savePNG, saveSplit format 파라미터화)
  - 분할(saveSplit/showSplitGallery)에 format 추가 → PNG 분할 다운로드(.png) 지원
  - 실측: 분할 장당 1720×~3500px, 0.3MB 수준 → 한도 대비 여유 충분
- **출력 폰트 가독성**: index.html #preview 14종 +4~6px 상향(모바일 축소 대비). 에디터 UI 폰트 미변경
- **AI 카피라이팅 완전 제거**: 툴바/탭 버튼, tab-ai 패널, aiGenerate/aiApply 함수, _aiResult 변수, api.anthropic.com 직접호출 제거. 저장 탭 기본 활성
- **모바일 에디터 레이아웃**(@media max-width:820px): 미리보기 화면폭 맞춤 축소(_fitPreviewMobile), 오른쪽 패널 하단으로 + compact
- **템플릿 저장 FTP→localStorage 전환**: 서버 목록 로컬폴백 없음 + 한글 파일명 충돌 버그 → localStorage(tplList/tplSaveAll) 기반으로 통합. tplSaveCurrent/renderTplList/tplLoadByRow/tplDeleteByRow/tplExportByRow 수정. "현재상태 JSON 다운로드" 버튼 추가(_downloadTpl/tplDownloadCurrent). 한글 이름 안전, 카테고리별 템플릿 가능
- 보호: getBrowser(), /api/capture, _FT_FONTS, applyFont(), bindTF() 미변경
- 인코딩: editor.js는 UTF-8 BOM+CRLF → Edit 도구 대신 Node로 BOM/줄바꿈 보존하며 수정
- 교훈: 폰 체감 글자크기 = 디자인폰트 × (폰폭/레이아웃폭). 해상도(배수)는 선명도만, 체감크기는 레이아웃폭이 결정. 네이버/사방넷 이중압축은 큰 폰트+적정용량(분할)으로 방어

### [2026-06-16 추가] 기본폭 1000px + 모바일 큰폰트/볼드 + 모바일캡처 고해상도
- 기본 페이지폭 860→**1000px**(편집 기본버튼+저장 SAVE_W/saveSplit/saveOptimized 모두). 저장 배수 2×=2000/3×=3000, 라벨 일괄 갱신
- 모바일 큰폰트 모드(for-mobile-capture) 본문/설명 20종 +20% 상향 + **font-weight:500**(약간 볼드)
- 누락 보강: s-trust-name/desc, s-cmp-desc-name/txt (신뢰배지·비교설명) for-mobile 오버라이드 추가
- 모바일 JPG/분할(saveOptimized/saveOptimizedSplit) html2canvas scale 1→**2**(고해상도). 목표=쿠팡 수준 가독성
- 교훈: 큰폰트 가독성은 for-mobile-capture 모드(=모바일 JPG 버튼)에서만 적용. 일반 미리보기/JPG는 데스크톱 비율 유지

### [2026-06-16 추가2] 단일 페이지 모바일 가독성(PC/모바일 공통) + 분할 전체다운로드
- 방향: PC/모바일 분리 ❌ → 한 페이지로 모바일 가독성 향상. for-mobile-capture를 #preview에 **항상 적용**(always-on, index.html class)
- 폰트: 360px 기준 스샷 반복 검증으로 본문 35px(쿠팡 수준, 한줄 ~13자)로 확정. for-mobile 전체 폰트 스케일 조정 + weight 500(약간 볼드)
- proof: 숫자 30px/라벨 18px/패딩 축소 → "2,841개" 한 줄
- 정렬: s-feat-desc/s-style-items/s-cmp-desc-txt에 min-height(2줄) → 설명 1/2줄 차이로 생기던 이미지 슬롯 단차 제거
- 분할 저장 갤러리: "⬇ 전체 다운로드" 버튼(모든 파트 일괄, 0.4s 간격, png/jpg 자동)
- 검증: headless puppeteer로 360px 렌더 스샷 직접 확인하며 크기/정렬 튜닝
- 보호구역 미변경

### [2026-06-16 추가3] info 섹션 → 상품정보고시 표 형태로 교체
- info 빌더를 한국형 상품정보고시(2열 라벨-값 표: 상품명/사이즈·색상/제조사·소재/제조국·주소(전체폭)·연락처/취급주의 + 하단 고지문)로 교체
- 편집가능 플레이스홀더. s-info CSS 재작성(상단 굵은선/행 구분선/라벨 볼드/제목 가운데) + for-mobile 가독성 오버라이드
- 기존 체크박스(ck-group) 방식 제거

### [2026-06-16 추가4] HTML 다운로드 → 자체완결형 기능 에디터로 교체
- 문제: 기존 saveHTML이 editor.css 미인라인 정적 출력 → 레이아웃 깨짐+기능없음. 템플릿(localStorage)은 base64 이미지로 용량초과 저장실패.
- 해결: HTML 버튼 → saveStandaloneHTML(). DOM 복제 후 editor.css/editor.js를 인라인(외부참조 제거), makeFixed로 init 재바인딩, API_BASE=프로덕션 유지 → 파일 단독 실행 시 레일웨이와 동일 외관+전기능(캡처/FTP/템플릿은 프로덕션 API 경유).
- 검증: headless로 export→재로드 시 22섹션 렌더/함수 6종 동작/에러0 확인.
- 효과: 이미지 포함 작업도 HTML로 저장→재오픈 편집 가능(localStorage 용량한계 회피).

### [2026-06-16 추가5] 내보낸 HTML 버그 2건 수정
- ① 다운로드 HTML의 기존 이미지 리사이즈 안 됨: makeFixed init이 tf-wrap의 iz-ov 숨김/file input 비활성을 빠뜨려 오버레이(z-index:30)가 이벤트 가로챔(FIX_LOG #3 동일). → init 재바인딩에 iz-ov display:none + file input 비활성 추가.
- ② 단독 HTML에서 재저장 실패: saveStandaloneHTML이 /editor.css·/editor.js를 무조건 fetch → file://엔 없어 throw. → link/script가 외부참조일 때만 fetch(이미 인라인된 단독파일은 fetch 생략하고 그대로 재직렬화).
- 검증: headless로 export→단독로드 재저장 OK(에러0), init에 iz-ov숨김 포함 확인.

### [2026-06-16 추가6] 이미지 슬롯 기본값 정사각형
- 빈 이미지 슬롯(.iz:not(.has-image))에 aspect-ratio:1/1 + height:auto!important → 폭 기준 정사각형(고정 px height 무시). 풀폭 1000×1000, 2단 ~541², 기타 ~360²/299². 모든 화면폭에서 정사각 유지.
- 이미지 넣은 슬롯(has-image)은 기존 tf 리사이즈 유지(영향 없음).

### [2026-06-16 추가7] 정사각 슬롯 - 이미지 넣어도 정사각 유지 + 채움(cover)
- 문제: aspect-ratio를 .iz:not(.has-image)에만 줘서 이미지 넣으면 정사각 풀리고 슬롯이 인라인높이로 줄어 이미지가 작아짐.
- 수정: .iz 전체에 aspect-ratio:1/1+height:auto!important(이미지 넣어도 정사각 유지). tf-wrap은 position:absolute라 슬롯 높이 영향 없음.
- initTF fit을 contain→cover로(부등호 반전) → 이미지가 정사각을 꽉 채움(overflow:hidden로 크롭). 검증: 1500×1000 이미지→슬롯 1000², tf-wrap 1500×1000 정사각 덮음.

### [2026-06-16 추가8] 이미지 삭제 버튼(iz-del) 호버/클릭 안 됨 수정
- 원인: initTF가 만드는 .iz-del에 CSS가 전혀 없어 좌상단 작은 기본버튼으로 뜨고 z-index 없어 tf-wrap(z-index:5)에 가려 호버/클릭 불가.
- 수정: .iz-del 우상단 절대배치 + z-index:61(핸들/래퍼 위) + 32px 빨강원 + .iz:hover시 표시. 검증: 클릭가능 최상단 요소 확인.

### [2026-06-16 추가9] footer 좌측 정렬(끊긴 셀렉터 버그) + 슬롯 위/아래 이동
- footer 왼쪽 붙음: editor.css 521·523줄 끊긴 셀렉터(.s-pd-2col> / .s-pd-3col> 뒤 내용없음)가 파서에서 .s-pd-3col>.s-footer{...}로 합쳐져 .s-footer 패딩(48px) 무력화 → padding 0. 끊긴 셀렉터 2줄 제거 → footer 48px=FAQ 정렬, pd-2col/3col 플렉스도 정상화.
- 슬롯 위/아래 이동: buildIzOverlay에 .iz-move(⬆⬇) 버튼(z-index:61, hover시, 이미지 유무 무관) + izMove(iz,dir): iz 형제 재정렬 후 resize-bar 재생성. 검증 A,B↔B,A.

### [2026-06-16 추가10] 인플루언서 카드 슬롯 카드 채움(정사각 부작용 수정)
- 정사각(aspect-ratio:1/1) 블랭킷이 카드형(세로 긴) 슬롯까지 정사각화 → flex로 늘어난 카드를 못 채워 빈공간.
- .s-infl-card .iz를 position:absolute;inset:0(정사각 해제)로 카드 채움 + 카드 높이(top 560/bot 340) 부여. 검증: iz=카드(360×560), 이미지 카드 채움.
- ⚠ 각도/스타일/무드 카드도 동일 부작용 가능 → 보고 시 동일 패턴 적용.

### [2026-06-16 추가11] 스프링 룩북 섹션 신규(BUCKET/MASTER BUNNY 레퍼런스)
- SEC.spring 빌더 + SEC_META(스프링 룩북) 추가. 섹션 추가 메뉴에서 추가 가능.
- 구성: 히어로(텍스트 오버레이+오프셋 박스), FOR SPRING GOLF(이미지+텍스트), 대형+MASTER BUNNY 워터마크+정사각, 하단 2박스+BRAND. 박스7=izNew 슬롯(호버 업로드), 텍스트9=contenteditable(폰트/크기 디자인 고정 !important로 for-mobile-capture 무시).
- 슬롯은 .ss-box(aspect-ratio로 디자인 비율) + .s-spring .iz absolute inset:0로 채움(cover). 반응형: @container(max-width:600px) 모바일 스택.
- 버그수정: 모바일 히어로가 align-items:flex-start(PC용) 때문에 column에서 박스 폭 붕괴(10px) → @container에 align-items:stretch + 폭100% 추가.
- 검증(headless): 슬롯7 호버7 편집9 이미지cover, PC/모바일 렌더 확인.

### [2026-06-16 추가12] 스프링 모달버튼 추가 + 카드 슬롯(angle/style) 정사각 부작용 수정 + 모달 라벨 정정
- 섹션추가 모달이 index.html 하드코딩이라 SEC_META만 추가하면 안 뜸 → "🌸 스프링 룩북" 버튼을 모달에 추가.
- 전체 섹션 헤드리스 검증(23개 에러0 렌더). 정사각 부작용으로 angle 0/4·style 0/3 미채움 발견 → .s-angle-cell/.s-style-card .iz를 디자인 비율(430/520, 267/400)로 복원(이미지+캡션 구조라 absolute 불필요). 검증: angle 499×603·style 331×496 균일.
- 모달 라벨 불일치 정정: info(상품정보고시로 바뀐) 라벨 "모델 정보"→"상품정보고시", pd(제품디테일) 라벨 "제품 정보 고시"→"제품 디테일".
- 영향범위: 정사각/폰트 등 전역변경은 에디터로 새작업/템플릿 불러오기엔 적용, 이미 export/업로드한 정적 페이지엔 영향 없음.

### [2026-06-16 추가13] 섹션 클릭 반영 버그(스크롤) 수정 + 버킷 PC/모바일 2버전 분리
- "섹션 클릭해도 반영 안됨" 원인: addSection이 #preview 맨아래에 추가만 하고 스크롤 안 함 → 화면(상단) 변화 없어 보임. 모든 섹션 공통. → addSection에 sec.scrollIntoView 추가.
- 검증결과 24섹션 전부 정상 렌더(깨진 섹션 없음) → 제거할 섹션 없음. "안 되던 것"=스크롤 버그.
- 스프링 룩북 → bucketInner() 공통 + bucketpc/bucketmb 2빌더로 분리. CSS .s-spring→.s-bucket(공통)+.s-bucket-pc(가로 비대칭)/.s-bucket-mb(스택). 모달버튼 2개(버킷스토어 템플릿_pc/_모바일).
- 검증: bucketPC heroDir=row, bucketMB heroDir=column, 각 슬롯7/편집9/호버7, 에러0.

### [2026-05-27] editor.js — deviceScaleFactor 방식으로 2× 해상도 수정 (최종)
- **문제**: 여러 시도에도 불구하고 2× JPG 저장 시 860px 출력 지속
- **근본 원인**: `width: 860 * scale, scale: 1` 전송 → viewport만 1720px로 확대, deviceScaleFactor는 1
  - 이 방식은 레이아웃을 1720px로 키우려 했지만 container query 등 부작용 다수
- **최종 해결**: **deviceScaleFactor 방식** (Retina 디스플레이와 동일 원리)
  ```javascript
  // Before: viewport 확대 방식
  { width: 860 * scale, scale: 1 }  // ❌ 1720px viewport, 1x 밀도
  
  // After: deviceScaleFactor 방식
  { width: 860, scale: scale }       // ✅ 860px viewport, 2x 밀도
  ```
- **장점**:
  - viewport 항상 860px → container query 정상 동작
  - 레이아웃/폰트/비율 1×과 완전 동일
  - deviceScaleFactor=2 → 출력만 1720px (고밀도)
  - 리사이징 로직 불필요 (20줄 삭제)
  - 네이버/사방넷 압축 대응 최적 (860px 레이아웃을 고해상도로 저장)
- **변경**:
  - scale=1: 860px (1x 밀도)
  - scale=2: 1720px (860px × 2x 밀도)
  - scale=3: 2580px (860px × 3x 밀도)
- **검증**: `node -c public/editor.js` ✓
- **커밋**: `e464336 fix: deviceScaleFactor 방식으로 변경 (viewport 860 고정, scale로 해상도 배수)`

### [2026-05-27] editor.js — 2× 해상도 container query 반영 수정 (폐기)
- **문제**: 2× JPG 저장 시 최종 출력 이미지가 여전히 860px로 나옴 (1720px 아님)
- **원인**: 
  - `doSave()`에서 `pv.innerHTML`을 캡처할 때, 원본 #preview가 860px 상태
  - CSS container query(`container-type:inline-size`)로 폰트/레이아웃이 860px 기준으로 계산됨
  - 새로운 1720px 컨테이너에 innerHTML을 복사해도 내용물은 이미 860px로 렌더링된 상태
- **해결**:
  - html2canvas 함수들처럼 캡처 **전에** preview를 targetWidth로 임시 리사이징
  - 700ms 대기해서 폰트/레이아웃 재계산 완료 후 innerHTML 캡처
  - finally 블록에서 원본 너비 복원
- **변경 코드**:
  ```javascript
  const origW = pv.style.width;
  pv.style.width = targetWidth + 'px';
  await new Promise(r => setTimeout(r, 700));
  // ... innerHTML 캡처
  pv.style.width = origW;  // 복원
  ```
- **검증**: `node -c public/editor.js` ✓
- **커밋**: `50b40e2 fix: 2× JPG 해상도 버그 수정 - 캡처 전 preview 임시 리사이징`

### [2026-05-26] editor.js — 2× 고화질 버튼 해상도 수정
- **문제**: 2× 버튼 클릭 시 860px로 저장됨 (1720px 아님)
- **원인**: 
  - `setJpgScale(s,btn)` → `_jpgScale = s+1` (불필요한 +1)
  - `doSave(scale)` → `deviceScaleFactor=scale` (픽셀 밀도만 높임, 실제 해상도 증가 없음)
- **해결**:
  - `setJpgScale` → s+1 제거, `_jpgScale = s`
  - `doSave` → `width = 860 * scale`, `deviceScaleFactor = 1`
  - 2× 버튼 → 1720px 실제 출력
- **변경**:
  - scale=1: 860px
  - scale=2: 1720px
  - scale=3: 2580px
- **검증**: `node -c public/editor.js` ✓

### [2026-05-26] CLAUDE.md — 서브 에이전트 구성 추가
- Dev Agent (개발)
- QA Agent (품질 검증)
- Deploy Agent (배포)
- Monitor Agent (모니터링)
- 작업 흐름: Dev → QA → Deploy → Monitor → 총괄 보고

### [2026-05-26] editor.js — 한글 깨짐 수정 (SyntaxError 해결)
- **문제**: PowerShell이 UTF-8 인코딩 없이 파일 저장 → 한글 전체 깨짐 → SyntaxError
- **증상**: 브라우저에서 editor.js 로드 실패, #preview 빈 화면
- **해결**: 
  - ce39657 커밋(한글 정상)으로 editor.js 복원
  - quality 0.97→0.98만 UTF-8 인코딩으로 재적용
  - `(Get-Content -Encoding UTF8) | Set-Content -Encoding UTF8` 사용
- **교훈**: PowerShell 파일 수정 시 반드시 `-Encoding UTF8` 필수
- **확인**: `node -c public/editor.js` SyntaxError 없음 ✓
- **커밋**: `1467ac9 fix: editor.js 한글 깨짐 수정`

### [2026-05-26] editor.js — 템플릿 관련 깨진 한글 메시지 영어로 교체 (REVERTED)
- **문제**: 템플릿 목록 UI에서 깨진 한글로 인해 빈 화면처럼 보임
- **해결**: 
  - "No saved templates" 메시지 영어 교체
  - 버튼 텍스트 "Load", "Delete" 영어 교체
  - confirm 메시지 'Delete "..."?' 영어 교체
- **커밋**: `0ae29a6 fix: editor.js 템플릿 관련 깨진 한글 메시지 영어로 교체`

### [2026-05-26] server.js — FTP 환경변수 없을 때 fallback 처리
- **문제**: Railway에서 FTP 환경변수 미설정 시 `/api/templates` 500 에러
- **해결**: FTP 환경변수 없으면 빈 배열 반환 (에러 대신 graceful degradation)
- **테스트**: Railway API 호출 200 OK 확인
- **커밋**: `bbf332a fix: FTP 환경변수 없을 때 fallback 처리`

### [2026-05-26] server.js — 템플릿 저장을 FTP로 변경
- **문제**: Railway는 ephemeral filesystem → 재배포 시 로컬 `templates/` 폴더 사라짐
- **해결**: 템플릿 저장/불러오기를 FTP로 변경 (이미지 업로드와 동일한 방식)
- **변경 내역**:
  - `GET /api/templates` → FTP에서 templates/*.json 목록 읽기
  - `POST /api/templates/save` → FTP에 JSON 업로드
  - `GET /api/templates/:name` → FTP에서 JSON 다운로드
  - `DELETE /api/templates/:name` → FTP에서 JSON 삭제
- **저장 경로**: `FTP_TEMPLATE_DIR=/public/SE2/upload/templates/`
- **확인**: `node server.js` 정상 시작 (문법 오류 없음)
- **커밋**: `4087ff3 feat: 템플릿 저장을 FTP로 변경 (Railway ephemeral filesystem 대응)`

### [2026-05-26] server.js — 한글 문자열 인코딩 깨짐 수정
- **문제**: server.js 전체에 깨진 한글 주석/에러 메시지로 인한 SyntaxError
- **해결**: 모든 한글 주석과 에러 메시지를 영어로 교체
- **확인**: `node server.js` 정상 시작 (SyntaxError 없음)
- **커밋**: `c8846d1 fix: server.js 한글 문자열 영어로 교체`

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
