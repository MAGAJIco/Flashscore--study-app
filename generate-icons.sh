#!/bin/bash
# Generate PWA icons from a base SVG or create solid color placeholders

# Create a base icon (green circle with "SC" text)
cat > icon-base.svg << 'SVG'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#00ff88"/>
  <text x="50%" y="50%" font-size="280" font-weight="bold" fill="#1a1f3a" text-anchor="middle" dominant-baseline="central">SC</text>
</svg>
SVG

# Generate different sizes if convert is available
if command -v convert &> /dev/null; then
  for size in 16 32 96 192 512; do
    convert icon-base.svg -resize ${size}x${size} icon-${size}x${size}.png
  done
  echo "Icons generated successfully!"
else
  echo "ImageMagick not found. Please install or use an online converter."
  echo "Base SVG created at icon-base.svg"
  echo "Convert to PNG sizes: 16x16, 32x32, 96x96, 192x192, 512x512"
fi
