Add-Type -AssemblyName System.Drawing

$shield = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\shield-logo.png"
$sourceImage = [System.Drawing.Bitmap]::new($shield)

Write-Host "Creating transparent Android app icons..."

# Function to make white background transparent
function Make-Transparent {
    param($bitmap)
    
    $transparent = New-Object System.Drawing.Bitmap($bitmap.Width, $bitmap.Height)
    
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
        for ($y = 0; $y -lt $bitmap.Height; $y++) {
            $pixel = $bitmap.GetPixel($x, $y)
            
            # If pixel is white or very light (RGB > 240), make it transparent
            if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
                $transparent.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            } else {
                $transparent.SetPixel($x, $y, $pixel)
            }
        }
    }
    
    return $transparent
}

Write-Host "Removing white background from shield..."
$transparentShield = Make-Transparent $sourceImage

# Android icon sizes
$sizes = @{mdpi=48; hdpi=72; xhdpi=96; xxhdpi=144; xxxhdpi=192}
$androidRes = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\android\app\src\main\res"

foreach($key in $sizes.Keys) {
    $size = $sizes[$key]
    $folder = Join-Path $androidRes "mipmap-$key"
    
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($transparentShield, 0, 0, $size, $size)
    $g.Dispose()
    
    $resized.Save((Join-Path $folder "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Save((Join-Path $folder "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "Created transparent $key - $size x $size"
}

$transparentShield.Dispose()
$sourceImage.Dispose()

Write-Host ""
Write-Host "SUCCESS! Transparent Android icons created"
Write-Host "Next: Rebuild APK with 'pnpm run android:build'"
