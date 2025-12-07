Add-Type -AssemblyName System.Drawing

# Create a 512x512 bitmap
$bitmap = New-Object System.Drawing.Bitmap(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Fill background with white
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillRectangle($whiteBrush, 0, 0, 512, 512)

# Draw shield outline in blue
$bluePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37, 99, 235), 12)
$bluePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

# Create shield path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath

# Shield points (scaled to 512x512)
$points = @(
    [System.Drawing.PointF]::new(256, 80),   # Top center
    [System.Drawing.PointF]::new(400, 120),  # Top right
    [System.Drawing.PointF]::new(400, 260),  # Mid right
    [System.Drawing.PointF]::new(256, 432),  # Bottom
    [System.Drawing.PointF]::new(112, 260),  # Mid left
    [System.Drawing.PointF]::new(112, 120)   # Top left
)

$path.AddPolygon($points)

# Fill with gradient blue
$rect = New-Object System.Drawing.RectangleF(112, 80, 288, 352)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(74, 144, 226),
    [System.Drawing.Color]::FromArgb(93, 165, 245),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
)

$graphics.FillPath($brush, $path)
$graphics.DrawPath($bluePen, $path)

# Save to all required sizes
$sizes = @(
    @{folder="mipmap-mdpi"; size=48},
    @{folder="mipmap-hdpi"; size=72},
    @{folder="mipmap-xhdpi"; size=96},
    @{folder="mipmap-xxhdpi"; size=144},
    @{folder="mipmap-xxxhdpi"; size=192}
)

$basePath = "C:\Users\Jonirao\Desktop\AwarenessHub-NOV1\android\app\src\main\res"

foreach ($sizeInfo in $sizes) {
    $size = $sizeInfo.size
    $folder = $sizeInfo.folder
    $folderPath = Join-Path $basePath $folder
    
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
    }
    
    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bitmap, 0, 0, $size, $size)
    $g.Dispose()
    
    $outputPath = Join-Path $folderPath "ic_launcher.png"
    $resized.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    
    Write-Host "Created: $outputPath"
}

$graphics.Dispose()
$bitmap.Dispose()

Write-Host "`nShield icon created successfully in all sizes!"
