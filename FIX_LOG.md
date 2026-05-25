# FIX_LOG.md — detail-page-studio
# 코드 수정 전 반드시 확인!

---

## ⚠️ 보호 구역 (절대 건드리지 말 것)

| 파일 | 보호 영역 | 이유 |
|---|---|---|
| server.js | waitForFonts() 함수 | 폰트 로드 대기 핵심 |
| server.js | getBrowser() 함수 | 브라우저 싱글톤 |
| server.js | /api/capture 라우트 | 캡처 API 핵심 |
| editor.js | _FT_FONTS 배열 | 폰트 목록 |
| editor.js | applyFont() 함수 | 폰트 적용 핵심 |

---

## 수정 이력

### [2026-05-26] server.js — R2 서명 aws4 패키지로 교체
- 파일: server.js, package.json
- 수정: 직접 구현한 AWS Signature V4 코드 → aws4 패키지 사용
- 추가: aws4 패키지 (npm install aws4)
- 이유: R2 템플릿 저장 시 시그니처 오류 해결
- 보호: r2Request 호출부 (템플릿 API) 동일 인터페이스 유지

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
