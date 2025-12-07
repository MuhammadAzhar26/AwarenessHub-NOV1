Add-Type -AssemblyName System.Drawing

$shield = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\shield-logo.png"
$sourceImage = [System.Drawing.Image]::FromFile($shield)

Write-Host "Creating Android icons..."

$sizes = @{mdpi=48; hdpi=72; xhdpi=96; xxhdpi=144; xxxhdpi=192}
$androidRes = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\android\app\src\main\res"

foreach($key in $sizes.Keys) {
    $size = $sizes[$key]
    $folder = Join-Path $androidRes "mipmap-$key"
    
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($sourceImage, 0, 0, $size, $size)
    $g.Dispose()
    
    $resized.Save((Join-Path $folder "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Save((Join-Path $folder "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "Created $key - $size x $size"
}

Write-Host "Creating web favicons..."

$public = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\public"
$webSizes = @(16, 32, 180, 192, 512)

foreach($size in $webSizes) {
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($sourceImage, 0, 0, $size, $size)
    $g.Dispose()
    
    if($size -eq 180) {
        $outPath = Join-Path $public "apple-touch-icon.png"
    } else {
        $outPath = Join-Path $public "icon-$size.png"
    }
    
    $resized.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "Created icon-$size.png"
}

$sourceImage.Dispose()

Write-Host ""
Write-Host "SUCCESS! All icons created"
Write-Host "Next: pnpm run android:build"
