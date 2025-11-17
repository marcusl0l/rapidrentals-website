# Rapid Rentals Website

Modern, responsive website for Rapid Rentals Takanini - Truck, Trailer, and Ride-On Mower Hire.

## 🌐 Live Site

**Current Deployment:** http://rapidrentals.marcus.local

## 📁 Project Structure

```
rapidrentals-website/
├── index.html              # Homepage with vehicle gallery
├── prices.html             # Pricing page with card layout
├── contact.html            # Contact information
├── favicon.ico             # Browser icon
├── css/
│   └── modern.css          # Main stylesheet
└── Photos/
    └── Gallery/            # Vehicle images (35 photos)
```

## ✨ Features

- **Modern Design** - Clean, professional 2025 aesthetic
- **Responsive Layout** - Mobile-first design, works on all devices
- **Vehicle Gallery** - Modal lightbox for browsing vehicle photos
- **Pricing Cards** - Clear, easy-to-read pricing layout
- **Fast Loading** - Optimized images and minimal code
- **SEO Friendly** - Semantic HTML and proper meta tags

## 🚀 Deployment Options

### Option 1: AWS Amplify (Recommended)
**Cost:** ~$0.29/month after first year free

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose GitHub and authorize
4. Select this repository
5. Deploy!

Auto-deploys on every push to main branch.

### Option 2: AWS S3 + CloudFront
**Cost:** ~$0.11/month after first year free

1. Create S3 bucket
2. Upload files
3. Enable static website hosting
4. Add CloudFront distribution
5. Configure DNS

See [AWS-HOSTING-GUIDE.md](../copilot-workspaces/projects/rapidrentals/AWS-HOSTING-GUIDE.md) for detailed instructions.

### Option 3: Any Static Host
Works with: Netlify, Vercel, GitHub Pages, or any web server.

## 💰 Hosting Costs

Based on actual traffic: **1,295 MB/month**

| Service | Year 1 | Year 2+ |
|---------|--------|---------|
| AWS Amplify | FREE | $0.29/month |
| AWS S3 + CloudFront | FREE | $0.11/month |
| Traditional Hosting | $5-15/month | $5-15/month |

**Estimated visitors:** 100-200/month

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern features (Grid, Flexbox, CSS Variables)
- **Vanilla JavaScript** - No frameworks needed
- **JPEG Images** - Optimized for web

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS, Android)

## 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/marcusl0l/rapidrentals-website.git
cd rapidrentals-website

# Open in browser
open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Visit: http://localhost:8000
```

## 📝 Content Updates

### Update Prices
Edit `prices.html` and modify the pricing cards:
```html
<div class="price-row">
    <span class="period">Half Day (4 hours)</span>
    <span class="price">$170</span>
</div>
```

### Update Images
1. Add images to `Photos/Gallery/`
2. Reference in HTML: `Photos/Gallery/your-image.jpg`
3. Images should be JPEG format, optimized for web

### Update Contact Info
Edit `contact.html` to update:
- Phone number
- Address
- Operating hours
- Map location

## 📊 Website Stats

- **Files:** 41 files total
- **Size:** ~12 MB
- **Images:** 35 optimized photos
- **Pages:** 3 main pages
- **Load Time:** <2 seconds

## 🏢 Business Information

**Rapid Rentals Takanini**
- Phone: 09 298 1738
- Location: Takanini, South Auckland
- Hours: Mon-Fri 8am-5pm, Sat 8am-12pm

## 📄 License

© 2025 Rapid Rentals Takanini. All rights reserved.

## 🤝 Contributing

This is a private business website. For updates or changes, please contact the website administrator.

---

**Last Updated:** November 18, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
