# Quick Start - AWS SES Booking Setup

## 🚀 Quick Steps (15 minutes)

### 1. Verify Emails in AWS SES (5 min)
```
AWS Console → SES → Verified identities → Create identity
✓ noreply@rapidrentals.co.nz
✓ info@rapidrentals.co.nz (your email)
→ Check inbox and verify both
```

### 2. Create Lambda Function (3 min)
```
AWS Console → Lambda → Create function
Name: rapidrentals-booking-handler
Runtime: Node.js 18.x
Role: Create new role with SES permissions

→ Copy code from: lambda/booking-handler.js
→ Deploy
```

### 3. Add Environment Variables (1 min)
```
Lambda → Configuration → Environment variables:
FROM_EMAIL = noreply@rapidrentals.co.nz
TO_EMAIL = info@rapidrentals.co.nz
```

### 4. Create API Gateway (5 min)
```
API Gateway → Create HTTP API
Integration: Lambda (select your function)
Route: POST /booking
CORS: Enable (allow * or your domain)

→ Copy Invoke URL
```

### 5. Update Website (1 min)
```javascript
// Edit js/booking.js line ~65
const API_ENDPOINT = 'https://YOUR-API-ID.execute-api.ap-southeast-2.amazonaws.com/booking';
```

### 6. Test! 
```
1. Deploy to test branch
2. Fill out booking form
3. Check your email
4. Check CloudWatch logs if issues
```

## 📧 What Emails Look Like

**You receive:**
- Subject: 🚛 New Booking - [Vehicle Name]
- Professional HTML email with:
  - Vehicle & dates
  - Customer details (name, email, phone)
  - Purpose & special requests
  - Action required notice

**Customer receives:**
- Subject: ✅ Booking Received - Rapid Rentals
- Confirmation email with:
  - Their booking details
  - What's next (4 steps)
  - Your contact info
  - Professional branding

## 💰 Cost: $0-5/month
- SES: First 62k emails FREE
- Lambda: 1M requests FREE
- API Gateway: 1M requests FREE

## 🔧 Troubleshooting

**"Email not verified"**
→ Go to SES → Verified identities → Check status

**"CORS error"**
→ API Gateway → CORS → Add `*` to Allow-Origin

**"Function timeout"**
→ Lambda → Configuration → Increase timeout to 30s

**Check logs:**
```
Lambda → Monitor → View CloudWatch logs
```

## 📝 Files Created

```
lambda/
├── booking-handler.js          # Lambda function code
├── package.json                # Dependencies
├── SETUP-INSTRUCTIONS.md       # Detailed guide
└── QUICK-START.md             # This file

js/
└── booking.js                  # Updated with API call

booking.html                    # Booking form page
```

## ✅ Checklist

- [ ] Verified noreply@rapidrentals.co.nz in SES
- [ ] Verified info@rapidrentals.co.nz in SES
- [ ] Created Lambda function
- [ ] Added environment variables
- [ ] Created API Gateway
- [ ] Updated booking.js with API URL
- [ ] Tested booking form
- [ ] Received test emails
- [ ] Merged to production

## 🎯 After Setup

1. Monitor first bookings in CloudWatch
2. Request SES production access (to email any customer)
3. Consider adding:
   - SMS notifications (AWS SNS)
   - Admin dashboard
   - Payment integration (Stripe)
   - Calendar sync

## Need Help?

Check the detailed guide: `lambda/SETUP-INSTRUCTIONS.md`
