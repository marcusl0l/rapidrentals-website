# Rapid Rentals - Production Website Files

**Created:** November 18, 2025  
**Purpose:** Clean production-ready version with only necessary files

---

## 📁 Directory Structure

```
rapidrentals-production/
├── index.html              # Homepage
├── prices.html             # Pricing page
├── contact.html            # Contact page
├── favicon.ico             # Browser icon
├── css/
│   └── modern.css          # Main stylesheet
└── Photos/
    └── Gallery/            # Image gallery (35 images)
        ├── Trailers (6)
        ├── Cargo Vans (10)
        ├── Tail Lift Trucks (6)
        ├── Mowers (7)
        └── Other (6)
```

---

## ✅ Files Included (39 total)

### HTML Pages (3):
- `index.html` - Homepage with vehicle gallery
- `prices.html` - Modern pricing page with cards
- `contact.html` - Contact information

### CSS (1):
- `css/modern.css` - All styles (~1010 lines)

### Images (35):
All images located in `Photos/Gallery/`

**Furniture Trailers (6):**
- 1 2025.jpg
- 1 2025 - Copy.jpg
- 2 2025.jpg
- 3 2025.jpg
- 5 2025.jpg
- back 2025.jpg

**Cargo Vans (10):**
- cargo-van-main.jpg
- cargo-van-1.jpg through cargo-van-9.jpg

**Tail Lift Trucks (6):**
- TailLifttruck1large.jpg
- manual-tail-lift-main.jpg
- manual-tail-lift-1.jpg through manual-tail-lift-4.jpg

**Single Axle Trailers (3):**
- furniture trailer 1.jpg
- furniture trailer 2.jpg
- furniture trailer 3.jpg

**Ride-On Mowers (7):**
- Ride On Mower Main.JPG
- Ride On Mower 1.JPG through Ride On Mower 4.JPG

**Zero Turn Mowers (3):**
- ride-on-mowers-main.jpg
- Lawn-Mower.jpg
- lawn-mower-main.jpg
- ride-on-mowers-husqvarna-z242f.jpeg

### Other (1):
- `favicon.ico` - Browser tab icon

---

## ❌ Files NOT Included (Unused)

### HTML Files (2):
- `prices-old.html` - Old backup version
- `Photos/Gallery/untitled.html` - Empty/test file

### Directories (2):
- `Images/` - Empty directory
- `js/` - No JavaScript files needed (inline in HTML)

### Unused Images (64):
All thumbnail images and old gallery images not referenced in current pages:
- Various `*Thumb*.jpg` files (18)
- Old truck images `Truck*Large*.jpg` (8)
- Old van images `Van*.jpg` (12)
- Old trailer images `Trailer*.jpg` (10)
- Old tail lift images `TailLift_truck*.jpg` (12)
- Miscellaneous unused images (4)
  - HomeGallery7.jpg, HomeGallery8.jpg, HomeGallery9.jpg
  - HomeLogoGallery.jpg
  - blower-main.jpg
  - water-blaster.jpg
  - weed-eater-main.jpg
  - truck6.jpg
  - FAVICON.jpg
  - ContactUsPhoto.JPG
  - ContactUsPhoto1.jpg

**Total unused images:** 64 files

---

## 📊 Size Comparison

- **Original modern/ folder:** ~118 files (14MB with all images)
- **Production folder:** 39 files (~12MB)
- **Space saved:** ~2MB (plus cleaner structure)

---

## 🚀 Deployment Ready

This production folder contains ONLY the files needed for the live website:
- All 3 pages functional
- All referenced images included
- Single CSS file
- No unused files
- Clean structure
- Ready to deploy

---

## 🔄 To Deploy

1. Copy entire `rapidrentals-production/` folder to web server
2. Set document root to this folder
3. Ensure file permissions are correct
4. Test all pages load correctly
5. Verify all images display

---

## 📝 Notes

- All JavaScript is inline in HTML files (no separate .js files needed)
- CSS uses modern features (Grid, Flexbox, CSS Variables)
- All images are JPEG/JPG format (no PNG except favicon)
- File paths are relative (portable)
- No external dependencies

---

**Production folder created:** November 18, 2025  
**Tested:** All pages verified working  
**Status:** ✅ Ready for deployment
