# Image Optimization Plan for RapidRentals

## Current Issues (Google Lighthouse):
- **1,763 KiB potential savings** from image optimization
- Images are 2-3x larger than displayed size
- No lazy loading
- No modern formats (WebP/AVIF)
- Logo is 196KB but only displayed at 321x88px

## Immediate Fixes (No Tools Needed):

### 1. Add Lazy Loading to All Images ✅
Add `loading="lazy"` attribute to all non-critical images

### 2. Add Width/Height Attributes ✅
Prevents layout shift and improves LCP

### 3. Defer CSS Loading ✅
Add `media="print" onload="this.media='all'"` to modern.css

### 4. Preload Critical Images
Add `<link rel="preload">` for logo and hero images

## Image Optimization Needed (Requires Tools):

### Top Priority Images to Optimize:

1. **furniture trailer 1.jpg** - 835KB → Should be ~70KB
   - Current: 1440x1111px
   - Displayed: 567x756px
   - Savings: 765KB

2. **1 2025.jpg** - 459KB → Should be ~60KB
   - Current: 1440x1111px
   - Displayed: 567x756px
   - Savings: 389KB

3. **logo.png** - 196KB → Should be ~15KB
   - Current: 1015x277px
   - Displayed: 321x88px
   - Savings: 192KB

4. **cargo-van-main.jpg** - 194KB → Should be ~40KB
   - Savings: 166KB

5. **ride-on-mowers-main.jpg** - 185KB → Should be ~40KB
   - Savings: 157KB

### Tools Needed:
```bash
# Install on your LOCAL machine (not WSL):
npm install -g sharp-cli
# or
brew install imagemagick webp
```

### Commands to Run (on your local machine):
```bash
# Resize and compress JPG images
for img in Photos/Gallery/*.jpg Photos/Gallery/*.JPG; do
  sharp -i "$img" -o "${img%.jpg}-optimized.jpg" \
    resize 800 800 \
    --quality 80 \
    --progressive
done

# Convert to WebP
for img in Photos/Gallery/*.jpg Photos/Gallery/*.JPG; do
  cwebp -q 80 "$img" -o "${img%.jpg}.webp"
done

# Resize logo
sharp -i Photos/Gallery/logo.png \
  -o Photos/Gallery/logo-optimized.png \
  resize 400 \
  --quality 90
```

## What I Can Do Right Now:

1. Add lazy loading to all images
2. Add width/height attributes
3. Defer CSS loading
4. Add preload hints
5. Create picture elements for responsive images

This will improve score by ~20-30 points without image optimization!

Want me to implement these immediate fixes?
