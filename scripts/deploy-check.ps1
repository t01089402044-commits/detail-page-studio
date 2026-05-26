# Deploy Agent Checklist
# Railway 배포 검증 스크립트

param([int]$WaitSeconds = 120)

$ErrorCount = 0
$RailwayURL = "https://detail-page-studio-production.up.railway.app"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deploy Agent - Railway Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 0. Railway 배포 대기
if ($WaitSeconds -gt 0) {
    Write-Host "[0/3] Railway 배포 대기 중 ($WaitSeconds 초)..." -NoNewline
    Start-Sleep -Seconds $WaitSeconds
    Write-Host " OK" -ForegroundColor Green
}

# 1. Railway URL health 체크
Write-Host "[1/3] Railway /api/health 체크..." -NoNewline
try {
    $r = Invoke-WebRequest -Uri "$RailwayURL/api/health" -UseBasicParsing
    if ($r.StatusCode -eq 200) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $ErrorCount++
}

# 2. /api/templates 응답 확인
Write-Host "[2/3] Railway /api/templates 체크..." -NoNewline
try {
    $r = Invoke-WebRequest -Uri "$RailwayURL/api/templates" -UseBasicParsing
    if ($r.StatusCode -eq 200) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $ErrorCount++
}

# 3. editor.js 로드 확인
Write-Host "[3/3] editor.js 로드 확인..." -NoNewline
try {
    $r = Invoke-WebRequest -Uri "$RailwayURL/" -UseBasicParsing
    if ($r.StatusCode -eq 200 -and $r.Content -like '*editor.js*') {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $ErrorCount++
}

# 최종 결과
Write-Host "`n========================================" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "  DEPLOY CHECK PASSED" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "  DEPLOY CHECK FAILED - $ErrorCount error(s)" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 1
}