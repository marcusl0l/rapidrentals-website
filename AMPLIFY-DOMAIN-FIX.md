# AWS Amplify Domain Configuration Fix

## Problem
Google Search Console shows 6 pages with redirects that aren't being indexed:
- http://rapidrentals.co.nz/
- http://www.rapidrentals.co.nz/
- http://rapidrentals.co.nz/index.html
- http://www.rapidrentals.co.nz/index.html
- http://rapidrentals.co.nz/ContactUs.html
- http://www.rapidrentals.co.nz/ContactUs.html

## Solution Overview

### Part 1: amplify.yml Changes ✅ DONE
Updated to redirect:
- `/ContactUs.html` → `/contact` (301)
- `/index.html` → `/` (301)
- `/*.html` → `/*` (301 - removes .html extension)

### Part 2: AWS Amplify Console Configuration (YOU NEED TO DO THIS)

AWS Amplify handles HTTPS and www redirects at the **domain settings** level, not in amplify.yml.

## Steps to Fix in AWS Amplify Console

### 1. Log into AWS Amplify Console
https://console.aws.amazon.com/amplify/

### 2. Select Your RapidRentals App

### 3. Go to "Domain management" (left sidebar)

### 4. Configure Domain Redirects

**Current setup likely shows:**
- rapidrentals.co.nz
- www.rapidrentals.co.nz

**You need to configure:**

#### Option A: Force www (Recommended)
1. Click "Manage domains"
2. Find `rapidrentals.co.nz`
3. Set redirect: `rapidrentals.co.nz` → `www.rapidrentals.co.nz` (301 permanent)
4. Ensure SSL is enabled for both

#### Option B: Force non-www
1. Set redirect: `www.rapidrentals.co.nz` → `rapidrentals.co.nz` (301 permanent)

**My recommendation: Use www** (Option A)
- More professional
- Better for cookies/subdomains
- Industry standard

### 5. Enable HTTPS Redirect

In the same domain settings:
1. Find "HTTPS redirect" toggle
2. Enable it
3. This forces all HTTP → HTTPS automatically

### 6. Verify Configuration

After saving, your setup should show:
```
http://rapidrentals.co.nz      → https://www.rapidrentals.co.nz (301)
http://www.rapidrentals.co.nz  → https://www.rapidrentals.co.nz (301)
https://rapidrentals.co.nz     → https://www.rapidrentals.co.nz (301)
https://www.rapidrentals.co.nz → ✓ Primary (no redirect)
```

## Expected Result

After both changes:
1. **amplify.yml** handles: `.html` removal, old filenames
2. **Domain settings** handles: www, HTTPS
3. **Final canonical URL:** `https://www.rapidrentals.co.nz`

All variations will 301 redirect to the canonical URL.

## Testing

After deployment, test these URLs (should all redirect to https://www.rapidrentals.co.nz):
```bash
curl -I http://rapidrentals.co.nz
curl -I http://www.rapidrentals.co.nz
curl -I https://rapidrentals.co.nz
curl -I http://rapidrentals.co.nz/index.html
curl -I http://rapidrentals.co.nz/ContactUs.html
```

All should return:
```
HTTP/1.1 301 Moved Permanently
Location: https://www.rapidrentals.co.nz/
```

## Google Search Console Follow-up

After deploying:
1. Wait 48 hours for Google to recrawl
2. Go to Google Search Console
3. Request reindexing of main pages
4. "Page with redirect" errors should disappear within 2-4 weeks
5. Pages will start appearing in search results

## Sitemap Update

Make sure your sitemap.xml uses the canonical URLs:
```xml
<url>
  <loc>https://www.rapidrentals.co.nz/</loc>
  <priority>1.0</priority>
</url>
<url>
  <loc>https://www.rapidrentals.co.nz/prices</loc>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://www.rapidrentals.co.nz/contact</loc>
  <priority>0.8</priority>
</url>
```

## Notes

- amplify.yml changes deploy automatically on git push
- Domain redirect changes in AWS Console are instant
- Google reindexing takes 2-4 weeks
- Use Google Search Console "Request Indexing" to speed up

---

**Date:** November 27, 2025  
**Status:** amplify.yml updated, AWS Console configuration pending
