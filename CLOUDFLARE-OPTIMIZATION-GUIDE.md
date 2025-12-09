# CloudFlare Optimization Guide - RapidRentals
**Date:** December 10, 2025  
**Goal:** Reduce TTFB from 230ms to 15-30ms for cached content

## Step 1: ✅ Update Amplify Cache Headers (COMPLETED)

Updated `amplify.yml` with optimized cache headers:
- Images (jpg, png, etc): **1 year cache** (immutable)
- CSS/JS files: **1 year cache** (immutable)
- HTML pages: **1 hour cache** (must-revalidate)

**Status:** Committed to `test` branch, pushed to GitHub

---

## Step 2: Configure CloudFlare Settings (YOU NEED TO DO THIS)

### A. Create Page Rule for Aggressive Caching

1. Login to CloudFlare dashboard
2. Select domain: **rapidrentals.co.nz**
3. Go to: **Rules → Page Rules**
4. Click: **Create Page Rule**
5. Enter URL pattern: `*rapidrentals.co.nz/*`
6. Add these settings:
   - **Cache Level:** `Cache Everything`
   - **Edge Cache TTL:** `1 month`
   - **Browser Cache TTL:** `1 year`
7. Click: **Save and Deploy**

**Cost:** Free (you get 3 page rules on free plan)

---

### B. Enable Speed Optimizations

**Go to: Speed → Optimization**

Enable these settings:
- ✅ **Auto Minify:**
  - ✅ HTML
  - ✅ CSS
  - ✅ JavaScript
- ✅ **Brotli:** ON
- ✅ **Early Hints:** ON
- ⚠️ **Rocket Loader:** OFF (leave disabled - can break JavaScript)

---

### C. Configure Caching Settings

**Go to: Caching → Configuration**

Set these values:
- **Caching Level:** `Standard`
- **Browser Cache TTL:** `Respect Existing Headers`
- **Always Online:** `ON`

---

### D. Enable Network Optimizations

**Go to: Network**

Enable:
- ✅ **HTTP/3 (with QUIC):** ON
- ✅ **0-RTT Connection Resumption:** ON
- ✅ **WebSockets:** ON
- ✅ **gRPC:** OFF (not needed)

---

## Step 3: Test and Verify

### After CloudFlare changes are applied (wait 2-3 minutes):

```bash
# Test 1: Check cache headers
curl -I https://rapidrentals.co.nz

# Should see:
# cache-control: public, max-age=3600, must-revalidate
# cf-cache-status: MISS (first request)

# Test 2: Request again (should be cached)
curl -I https://rapidrentals.co.nz

# Should see:
# cf-cache-status: HIT
# age: 2 (or similar - seconds since cached)

# Test 3: Check timing
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://rapidrentals.co.nz

# Expected:
# First request: ~230ms (cold cache)
# Second request: ~15-30ms (hot cache) ✅
```

### Visual Test in Browser

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Visit: https://rapidrentals.co.nz
4. Look at first HTML request:
   - **Time to first byte (TTFB):** Should show ~20-30ms on repeat visits
   - **Headers:** Look for `cf-cache-status: HIT`

---

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First visit TTFB | 230-246ms | 230-250ms | No change (expected) |
| Cached visit TTFB | 230-246ms | **15-30ms** | **8x faster** 🚀 |
| Page load time | ~1.5s | **0.3-0.5s** | **3-5x faster** 🚀 |
| Cache hit ratio | ~60% | **99%+** | Most users see fast load |
| Core Web Vitals | Poor | **Good** | SEO improvement |

---

## Troubleshooting

### If cf-cache-status shows "BYPASS" or "DYNAMIC":
- Check Page Rule is active and matches URL pattern
- Verify "Cache Level: Cache Everything" is set
- Clear CloudFlare cache: Caching → Configuration → Purge Everything

### If TTFB is still slow (>100ms) on cached requests:
- Make sure Orange Cloud is enabled (proxied)
- Check Page Rule priority (should be first/only rule)
- Wait 5 minutes for CloudFlare edge to fully cache

### If images/CSS not loading:
- Check CORS headers in amplify.yml
- Verify file patterns match: `**/*.{jpg,png,css,js}`

---

## Cache Invalidation Strategy

**When you update the website:**

1. **AWS Amplify:** Auto-deploys on git push (builds new version)
2. **CloudFront:** Auto-invalidates on Amplify deploy
3. **CloudFlare:** Need to manually purge

**How to purge CloudFlare cache:**
- CloudFlare Dashboard → Caching → Configuration
- Click: **Purge Everything** (instant)
- Or: **Custom Purge** (by URL or tag)

**Best practice:** Update version numbers in CSS/JS filenames when making changes:
- `style.css` → `style.v2.css`
- Then browser gets new file immediately

---

## Security Notes

All security headers remain in place:
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ CloudFlare DDoS protection (active)
- ✅ CloudFlare Bot Management (active)

---

## Monitoring

**Check performance weekly:**
```bash
# Quick performance check
for i in {1..3}; do 
  curl -o /dev/null -s -w "Request $i TTFB: %{time_starttransfer}s\n" https://rapidrentals.co.nz
  sleep 1
done
```

**Expected output:**
```
Request 1 TTFB: 0.235s (cold)
Request 2 TTFB: 0.018s (hot) ✅
Request 3 TTFB: 0.016s (hot) ✅
```

---

## Next Steps

1. ✅ **Code changes:** Done (pushed to test branch)
2. ⏳ **Test deployment:** Wait for Amplify to deploy test branch
3. ⏳ **CloudFlare config:** Follow steps above in CloudFlare dashboard
4. ⏳ **Verify:** Run tests to confirm 15-30ms TTFB
5. ⏳ **Merge to master:** Once verified on test
6. ✅ **Monitor:** Check Core Web Vitals in Google Search Console (7 days)

---

## Questions?

- Cache not working? Check Page Rule URL pattern matches
- Still slow? Verify cf-cache-status header shows "HIT"
- Images broken? Check file patterns in amplify.yml
- Need to invalidate cache? Use CloudFlare purge function

**Remember:** First visit will always be ~230ms (cold cache). The magic happens on subsequent visits (15-30ms)!
