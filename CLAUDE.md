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
