Add-Type -AssemblyName System.Drawing

$shield = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\shield-logo.png"
$sourceImage = [System.Drawing.Bitmap]::new($shield)

Write-Host "Creating transparent icons from shield..."

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

Write-Host "Removing white background..."
$transparentImage = Make-Transparent $sourceImage

Write-Host "Creating web favicons..."

$public = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\public"
$webSizes = @(16, 32, 180, 192, 512)

foreach($size in $webSizes) {
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($transparentImage, 0, 0, $size, $size)
    $g.Dispose()
    
    if($size -eq 180) {
        $outPath = Join-Path $public "apple-touch-icon.png"
    } else {
        $outPath = Join-Path $public "icon-$size.png"
    }
    
    $resized.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "Created transparent icon-$size.png"
}

$transparentImage.Dispose()
$sourceImage.Dispose()

Write-Host ""
Write-Host "SUCCESS! Transparent favicons created"
Write-Host "The shield icon now has no white background"
