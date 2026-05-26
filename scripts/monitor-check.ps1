# Monitor Agent Checklist
# 저장된 이미지 해상도 검증 스크립트

param(
    [string]$ImagePath = ""
)

$ErrorCount = 0

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Monitor Agent - Image Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 이미지 경로가 지정되지 않은 경우 Downloads 폴더에서 최근 JPG 찾기
if (-not $ImagePath) {
    Write-Host "[INFO] 이미지 경로 미지정, Downloads 폴더에서 최근 JPG 검색..." -ForegroundColor Yellow
    $downloadsPath = [Environment]::GetFolderPath("UserProfile") + "\Downloads"
    $recentImage = Get-ChildItem -Path $downloadsPath -Filter "*.jpg" -ErrorAction SilentlyContinue |
                   Sort-Object LastWriteTime -Descending |
                   Select-Object -First 1

    if ($recentImage) {
        $ImagePath = $recentImage.FullName
        Write-Host "  최근 파일: $($recentImage.Name)" -ForegroundColor Gray
    } else {
        Write-Host "`n✗ Downloads 폴더에서 JPG 파일을 찾을 수 없습니다." -ForegroundColor Red
        Write-Host "사용법: .\scripts\monitor-check.ps1 -ImagePath '경로\파일명.jpg'" -ForegroundColor Yellow
        exit 1
    }
}

# 파일 존재 확인
if (-not (Test-Path $ImagePath)) {
    Write-Host "`n✗ 파일을 찾을 수 없습니다: $ImagePath" -ForegroundColor Red
    exit 1
}

# 1. 파일 크기 확인
Write-Host "`n[1/2] 파일 크기 확인..." -NoNewline
$fileInfo = Get-Item $ImagePath
$fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host " ✓" -ForegroundColor Green
Write-Host "  크기: $fileSizeMB MB ($($fileInfo.Length) bytes)" -ForegroundColor Gray

# 2. 이미지 해상도 확인 (System.Drawing 사용)
Write-Host "[2/2] 이미지 해상도 확인..." -NoNewline
try {
    Add-Type -AssemblyName System.Drawing
    $image = [System.Drawing.Image]::FromFile($ImagePath)
    $width = $image.Width
    $height = $image.Height
    $image.Dispose()

    Write-Host " ✓" -ForegroundColor Green
    Write-Host "  해상도: ${width} × ${height} px" -ForegroundColor Gray

    # 예상값 검증
    $expected = @{
        "1×" = 860
        "2×" = 1720
        "3×" = 2580
    }

    $scale = ""
    $isValid = $false

    foreach ($key in $expected.Keys) {
        if ($width -eq $expected[$key]) {
            $scale = $key
            $isValid = $true
            break
        }
    }

    Write-Host "`n----------------------------------------" -ForegroundColor Cyan
    if ($isValid) {
        Write-Host "  ✓ 해상도 검증 통과: $scale ($width px)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ 예상 해상도와 다름: $width px" -ForegroundColor Yellow
        Write-Host "  예상값: 860px (1×), 1720px (2×), 2580px (3×)" -ForegroundColor Yellow
        $ErrorCount++
    }

} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $ErrorCount++
}

# 최종 결과
Write-Host "========================================`n" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "MONITOR CHECK PASSED ✓`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "MONITOR CHECK FAILED - $ErrorCount warning(s) ⚠`n" -ForegroundColor Yellow
    exit 1
}
