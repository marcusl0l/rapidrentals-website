# AWS SES Setup - Step by Step Walkthrough

## ✅ Step 1: Verify Domain/Email Status (DONE)

You've already verified your DNS records and email. Let's check:

**AWS Console → SES → Verified identities**
- Status should show: ✅ Verified

---

## 🚀 Step 2: Create IAM Role for Lambda (5 minutes)

### A. Go to IAM
```
AWS Console → Search "IAM" → Roles → Create role
```

### B. Configure Role
1. **Trusted entity type:** AWS service
2. **Use case:** Lambda
3. Click **Next**

### C. Add Permissions
Search and select these policies:
- ✅ `AmazonSESFullAccess`
- ✅ `CloudWatchLogsFullAccess` (for debugging)

Click **Next**

### D. Name and Create
- **Role name:** `RapidRentalsBookingLambdaRole`
- **Description:** Allows Lambda to send emails via SES
- Click **Create role**

✅ **Done!** Copy the role name for next step.

---

## 🔧 Step 3: Create Lambda Function (10 minutes)

### A. Go to Lambda
```
AWS Console → Search "Lambda" → Functions → Create function
```

### B. Basic Information
- **Function name:** `rapidrentals-booking-handler`
- **Runtime:** Node.js 18.x (or latest)
- **Architecture:** x86_64 (or arm64 for lower cost)

### C. Permissions
- **Execution role:** Use an existing role
- **Existing role:** Select `RapidRentalsBookingLambdaRole`

Click **Create function**

### D. Upload Code

1. In the Lambda console, you'll see the code editor
2. **Delete** all the default code
3. **Copy** the entire content from `~/rapidrentals-website/lambda/booking-handler.js`
4. **Paste** into the editor
5. Click **Deploy** (orange button at top)

Wait for "Successfully updated..." message

### E. Add Environment Variables

1. Click **Configuration** tab
2. Click **Environment variables** (left sidebar)
3. Click **Edit**
4. Click **Add environment variable** (twice)

Add these:
```
Key: FROM_EMAIL
Value: bookings@rapidrentals.co.nz
```

```
Key: TO_EMAIL  
Value: info@rapidrentals.co.nz
```

5. Click **Save**

### F. Increase Timeout (optional but recommended)

1. Still in **Configuration** tab
2. Click **General configuration**
3. Click **Edit**
4. Change **Timeout** from 3 seconds to **30 seconds**
5. Click **Save**

✅ **Lambda function ready!**

---

## 🌐 Step 4: Create API Gateway (10 minutes)

### A. Go to API Gateway
```
AWS Console → Search "API Gateway" → Create API
```

### B. Choose API Type
- Select **HTTP API** (not REST API)
- Click **Build**

### C. Add Integration
1. **Integration:** Lambda
2. **Lambda function:** Select `rapidrentals-booking-handler`
3. **API name:** `rapidrentals-booking-api`
4. Click **Next**

### D. Configure Routes
1. **Method:** POST
2. **Resource path:** `/booking`
3. Click **Next**

### E. Configure Stage
1. **Stage name:** `$default` (should be pre-filled)
2. **Auto-deploy:** ✅ Enabled
3. Click **Next**

### F. Review and Create
1. Review your settings
2. Click **Create**

### G. Enable CORS (IMPORTANT!)

1. In your API, click **CORS** in left sidebar
2. Click **Configure**
3. Add these settings:
   - **Access-Control-Allow-Origin:** `*` (or `https://www.rapidrentals.co.nz`)
   - **Access-Control-Allow-Headers:** `content-type`
   - **Access-Control-Allow-Methods:** `POST, OPTIONS`
4. Click **Save**

### H. Get Your API URL

1. Click **Stages** in left sidebar
2. Click `$default`
3. Copy the **Invoke URL** - should look like:
   ```
   https://abc123def456.execute-api.ap-southeast-2.amazonaws.com
   ```

✅ **Your complete endpoint is:**
```
https://abc123def456.execute-api.ap-southeast-2.amazonaws.com/booking
```

**📋 SAVE THIS URL - you'll need it for the website!**

---

## 🧪 Step 5: Test Lambda Function (5 minutes)

### Quick Test in Lambda Console

1. Go back to **Lambda** → Your function
2. Click **Test** tab
3. Click **Create new event**
4. **Event name:** `test-booking`
5. Replace JSON with this:

```json
{
  "httpMethod": "POST",
  "body": "{\"vehicle\":\"Auto Truck Tail Lift (11m³) - From $100\",\"pickupDate\":\"2025-11-25\",\"pickupTime\":\"09:00\",\"returnDate\":\"2025-11-25\",\"returnTime\":\"17:00\",\"fullName\":\"Test Customer\",\"email\":\"YOUR_EMAIL@example.com\",\"phone\":\"021 123 4567\",\"address\":\"123 Test St, Auckland\",\"purpose\":\"Testing the booking system\",\"notes\":\"This is a test\",\"timestamp\":\"2025-11-20T00:00:00.000Z\"}"
}
```

**⚠️ Replace `YOUR_EMAIL@example.com` with your actual email!**

6. Click **Test** button
7. Check **Execution results** - should see:
   ```
   Response: {"success":true,"message":"Booking received"}
   ```

8. **Check your email!** You should receive 2 emails:
   - One as business owner (booking details)
   - One as customer (confirmation)

### If it fails:
- Click **Monitor** → **View CloudWatch logs**
- Check the error message
- Common issues:
  - Email not verified → Go back to SES and verify
  - Permission denied → Check IAM role has SES permissions

---

## 🌍 Step 6: Update Website (2 minutes)

Now that you have your API URL, update the website:

### Edit booking.js

1. Open: `~/rapidrentals-website/js/booking.js`
2. Find line ~65 (around where it says `API_ENDPOINT`)
3. Replace:
   ```javascript
   const API_ENDPOINT = 'YOUR_API_GATEWAY_URL/booking';
   ```
   
   With your actual URL:
   ```javascript
   const API_ENDPOINT = 'https://abc123def456.execute-api.ap-southeast-2.amazonaws.com/booking';
   ```

4. Save the file

### Commit and Deploy

```bash
cd ~/rapidrentals-website
git add js/booking.js
git commit -m "Add AWS API Gateway endpoint for bookings"
git push origin test
```

Wait 1-2 minutes for Amplify to build.

---

## ✅ Step 7: Test the Live Form

1. Go to: `https://test.rapidrentals.co.nz/booking.html`
2. Fill out the form with your details
3. Submit
4. You should see: "✅ Booking Request Sent!"
5. Check your emails (both customer and owner emails)

### Troubleshooting

**"Failed to process booking"**
→ Check Lambda CloudWatch logs

**CORS error in browser console**
→ Go back to API Gateway CORS settings

**No emails received**
→ Check SES verified identities status

---

## 🎉 Step 8: Request Production Access (Optional)

By default, SES is in "Sandbox mode" - can only send to verified emails.

### To send to ANY customer email:

1. **SES** → **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Use case:** Transactional (booking confirmations)
   - **Website URL:** https://www.rapidrentals.co.nz
   - **Description:** "Automated booking confirmation emails for truck rental business"
   - **Expected volume:** 50-100 emails/month
4. Submit

**Usually approved within 24 hours!**

### For now (testing):
- Just verify test email addresses in SES
- Can test with your own emails

---

## 📊 Step 9: Monitor Your System

### CloudWatch Logs
```
Lambda → Monitor → View CloudWatch logs
```
- See all booking submissions
- Check for errors

### SES Statistics
```
SES → Account dashboard → Sending statistics
```
- Track emails sent
- Monitor bounce/complaint rates

---

## 🎯 Summary Checklist

- [x] Verified domain/email in SES
- [ ] Created IAM role with SES permissions
- [ ] Created Lambda function
- [ ] Uploaded booking-handler.js code
- [ ] Added environment variables (FROM_EMAIL, TO_EMAIL)
- [ ] Increased timeout to 30 seconds
- [ ] Created API Gateway (HTTP API)
- [ ] Configured CORS
- [ ] Copied API URL
- [ ] Tested Lambda function (check emails!)
- [ ] Updated booking.js with API URL
- [ ] Deployed to test branch
- [ ] Tested live booking form
- [ ] Received test emails
- [ ] (Optional) Requested production access

---

## 💡 What's Next?

Once everything works on test:
1. Merge to master
2. Production site will have booking system
3. Monitor first real bookings
4. Consider adding:
   - SMS notifications
   - Calendar integration
   - Payment system (Stripe)
   - Admin dashboard

---

## 🆘 Need Help?

**Check Lambda logs first:**
```
Lambda → Monitor → CloudWatch logs → Latest log stream
```

**Common issues:**
- Email not verified → SES → Verified identities
- CORS error → API Gateway → CORS settings
- Permission denied → IAM role → Check policies

**Still stuck?** Let me know which step is giving you trouble!

