# Deploy Agent Checklist
# Railway 배포 검증 스크립트

param(
    [int]$WaitSeconds = 120
)

$ErrorCount = 0
$RailwayURL = "https://detail-page-studio-production.up.railway.app"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deploy Agent - Railway Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 0. Railway 배포 대기
if ($WaitSeconds -gt 0) {
    Write-Host "[0/3] Railway 배포 대기 중 ($WaitSeconds 초)..." -NoNewline
    Start-Sleep -Seconds $WaitSeconds
    Write-Host " ✓" -ForegroundColor Green
}

# 1. Railway URL health 체크
Write-Host "[1/3] Railway /api/health 체크..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$RailwayURL/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match '"ok"\s*:\s*true') {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: Health check 실패 - StatusCode: $($response.StatusCode)" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 2. /api/templates 응답 확인
Write-Host "[2/3] Railway /api/templates 체크..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$RailwayURL/api/templates" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host " ✓" -ForegroundColor Green
        $templates = $response.Content | ConvertFrom-Json
        Write-Host "  템플릿 개수: $($templates.Count)" -ForegroundColor Gray
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: Templates API 실패 - StatusCode: $($response.StatusCode)" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 3. editor.js 로드 확인
Write-Host "[3/3] editor.js 로드 확인..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$RailwayURL/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match 'editor\.js') {
        Write-Host " ✓" -ForegroundColor Green
        Write-Host "  HTML 크기: $($response.Content.Length) bytes" -ForegroundColor Gray
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: editor.js script tag 없음" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 최종 결과
Write-Host "`n========================================" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "  DEPLOY CHECK PASSED ✓" -ForegroundColor Green
    Write-Host "  URL: $RailwayURL" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "  DEPLOY CHECK FAILED - $ErrorCount error(s) ✗" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 1
}
