# QA Agent Checklist
# 코드 품질 검증 스크립트

$ErrorCount = 0

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QA Agent - Quality Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. editor.js 문법 체크
Write-Host "[1/4] editor.js 문법 체크..." -NoNewline
try {
    node -c public/editor.js 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: editor.js 문법 오류 발견" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 2. server.js 문법 체크
Write-Host "[2/4] server.js 문법 체크..." -NoNewline
try {
    node -c server.js 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: server.js 문법 오류 발견" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 3. UTF-8 인코딩 확인 (한글 깨짐 감지)
Write-Host "[3/4] UTF-8 인코딩 확인..." -NoNewline
$koreanTest = Select-String -Path public/editor.js -Pattern "메인 히어로|무료배송" -Quiet
if ($koreanTest) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Warning: editor.js에서 한글 깨짐 감지됨" -ForegroundColor Red
    $ErrorCount++
}

# 4. /api/health 로컬 응답 확인
Write-Host "[4/4] /api/health 로컬 응답 확인..." -NoNewline
try {
    # 서버가 이미 실행 중인지 확인
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200 -and $response.Content -match '"ok"\s*:\s*true') {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ⚠" -ForegroundColor Yellow
        Write-Host "  Warning: 로컬 서버 미실행 또는 응답 오류" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠" -ForegroundColor Yellow
    Write-Host "  Warning: 로컬 서버 미실행 (node server.js 실행 권장)" -ForegroundColor Yellow
}

# 최종 결과
Write-Host "`n========================================" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "  QA CHECK PASSED ✓" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "  QA CHECK FAILED - $ErrorCount error(s) ✗" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 1
}
