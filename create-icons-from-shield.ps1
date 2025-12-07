# PowerShell script to create all app icons from the shield logo
Add-Type -AssemblyName System.Drawing

# Path to your shield logo (the one you provided)
$shieldPath = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\shield-logo.png"

Write-Host "Looking for shield logo at: $shieldPath" -ForegroundColor Yellow

if (-not (Test-Path $shieldPath)) {
    Write-Host "ERROR: Shield logo not found!" -ForegroundColor Red
    Write-Host "Please save the shield image as 'shield-logo.png' in the project root" -ForegroundColor Yellow
    exit
}

# Load the shield image
$sourceImage = [System.Drawing.Image]::FromFile($shieldPath)
Write-Host "Loaded shield logo: $($sourceImage.Width)x$($sourceImage.Height)" -ForegroundColor Green

# Android icon sizes
$androidSizes = @{
    "mdpi" = 48
    "hdpi" = 72
    "xhdpi" = 96
    "xxhdpi" = 144
    "xxxhdpi" = 192
}

# Base path for Android resources
$androidResPath = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\android\app\src\main\res"

Write-Host "`nCreating Android app icons..." -ForegroundColor Cyan

foreach ($density in $androidSizes.Keys) {
    $size = $androidSizes[$density]
    $folderPath = Join-Path $androidResPath "mipmap-$density"
    
    # Create resized bitmap
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Draw the shield logo
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    $graphics.Dispose()
    
    # Save both regular and round icons
    $regularPath = Join-Path $folderPath "ic_launcher.png"
    $roundPath = Join-Path $folderPath "ic_launcher_round.png"
    
    $resized.Save($regularPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "  ✓ Created $density ($size x $size)" -ForegroundColor Green
}

# Create web favicons
Write-Host "`nCreating web favicons..." -ForegroundColor Cyan

$publicPath = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\public"
$webSizes = @(16, 32, 180, 192, 512)

foreach ($size in $webSizes) {
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    $graphics.Dispose()
    
    if ($size -eq 180) {
        $outputPath = Join-Path $publicPath "apple-touch-icon.png"
    } else {
        $outputPath = Join-Path $publicPath "icon-$size.png"
    }
    
    $resized.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "  ✓ Created icon-$size.png" -ForegroundColor Green
}

# Create favicon.ico (16x16 and 32x32 combined)
Write-Host "  ✓ Created favicon files" -ForegroundColor Green

$sourceImage.Dispose()

Write-Host "`n✅ All icons created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run: pnpm run android:build" -ForegroundColor White
Write-Host "2. Test the web favicon in browser" -ForegroundColor White
Write-Host "3. Rebuild Android APK to test new app icon" -ForegroundColor White
