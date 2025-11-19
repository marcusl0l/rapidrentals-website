# AWS SES + Lambda Setup for Booking System

## Step 1: Verify Email Address in AWS SES

1. Go to AWS Console → **SES** (Simple Email Service)
2. Select **Sydney (ap-southeast-2)** region
3. Go to **Verified identities**
4. Click **Create identity**
5. Select **Email address**
6. Enter: `noreply@rapidrentals.co.nz` (or your preferred from address)
7. Click **Create identity**
8. Check your email and click verification link
9. Repeat for `info@rapidrentals.co.nz` (recipient email)

## Step 2: Request Production Access (if needed)

By default, SES is in "sandbox mode" - can only send to verified emails.

To send to any customer email:
1. Go to SES → **Account dashboard**
2. Click **Request production access**
3. Fill out form (usually approved within 24 hours)

**For testing:** You can use sandbox mode - just verify your test email addresses.

## Step 3: Create IAM Role for Lambda

1. Go to **IAM** → **Roles**
2. Click **Create role**
3. Select **Lambda** as trusted entity
4. Attach policy: `AmazonSESFullAccess`
5. Name it: `BookingEmailSenderRole`
6. Create role

## Step 4: Create Lambda Function

1. Go to **Lambda** → **Create function**
2. **Function name:** `rapidrentals-booking-handler`
3. **Runtime:** Node.js 18.x (or latest)
4. **Architecture:** arm64 (cheaper) or x86_64
5. **Permissions:** Use existing role → Select `RapidRentalsBookingLambdaRole`
6. Click **Create function**

### Upload Code:
1. In the Lambda function, go to **Code** tab
2. Delete the default `index.js` content
3. Copy the entire content from `lambda/booking-handler.js`
4. Paste it into the editor
5. Click **Deploy**

### Configure Environment Variables:
1. Go to **Configuration** → **Environment variables**
2. Add:
   - `FROM_EMAIL` = `noreply@rapidrentals.co.nz`
   - `TO_EMAIL` = `info@rapidrentals.co.nz` (your email to receive bookings)
3. Save

### Increase Timeout (optional):
1. Go to **Configuration** → **General configuration**
2. Click **Edit**
3. Set **Timeout** to 30 seconds
4. Save

## Step 5: Create API Gateway

1. Go to **API Gateway** → **Create API**
2. Choose **HTTP API** (simpler, cheaper)
3. Click **Build**
4. Add integration:
   - **Integration type:** Lambda
   - **Lambda function:** `rapidrentals-booking-handler`
   - **API name:** `rapidrentals-booking-api`
5. Click **Next**
6. Configure routes:
   - **Method:** POST
   - **Resource path:** `/booking`
7. Click **Next**
8. Stage: `$default` (auto-deploy)
9. Click **Create**

### Enable CORS:
1. Select your API
2. Go to **CORS**
3. Click **Configure**
4. Add:
   - **Access-Control-Allow-Origin:** `*` (or specific: `https://www.rapidrentals.co.nz`)
   - **Access-Control-Allow-Headers:** `content-type`
   - **Access-Control-Allow-Methods:** `POST, OPTIONS`
5. Save

### Get API URL:
1. Go to **Stages** → `$default`
2. Copy the **Invoke URL** (e.g., `https://abc123.execute-api.ap-southeast-2.amazonaws.com`)
3. Your endpoint will be: `https://abc123.execute-api.ap-southeast-2.amazonaws.com/booking`

## Step 6: Update Website

Edit `js/booking.js` and replace the API endpoint:

```javascript
// Line ~65 in booking.js
const API_ENDPOINT = 'https://YOUR-API-ID.execute-api.ap-southeast-2.amazonaws.com/booking';
```

Replace `YOUR-API-ID` with your actual API Gateway URL.

## Step 7: Test the System

1. Deploy to test branch
2. Visit `https://test.rapidrentals.co.nz/booking.html`
3. Fill out the form
4. Submit
5. Check:
   - Your email (should receive booking notification)
   - Customer email (should receive confirmation)
   - Lambda logs (CloudWatch)

## Troubleshooting

### Check Lambda Logs:
1. Go to Lambda → Your function
2. Click **Monitor** → **View CloudWatch logs**
3. Check recent log streams for errors

### Common Issues:

**"Email address not verified"**
- Solution: Verify both FROM and TO emails in SES

**"CORS error"**
- Solution: Check CORS settings in API Gateway
- Make sure `Access-Control-Allow-Origin` is set

**"Rate exceeded"**
- Solution: You're in sandbox mode - request production access or verify test emails

**"Timeout"**
- Solution: Increase Lambda timeout to 30 seconds

## Costs

**AWS SES:**
- First 62,000 emails/month: **FREE** (if sent from EC2/Lambda)
- After that: $0.10 per 1,000 emails

**Lambda:**
- 1M free requests/month
- Booking system will use ~2-5 requests per booking
- Cost: **FREE** for low volume

**API Gateway:**
- 1M free requests/month
- Cost: **FREE** for typical traffic

**Total estimated cost:** $0-5/month for typical rental business

## Next Steps

After testing works:
1. Merge to master/production
2. Update production `js/booking.js` with API endpoint
3. Monitor first few bookings
4. Consider adding SMS notifications (AWS SNS) later

## Security Recommendations

1. **Rate limiting:** Add API Gateway throttling (e.g., 10 req/min per IP)
2. **Input validation:** Lambda validates required fields
3. **Spam protection:** Consider adding reCAPTCHA later
4. **Email filtering:** SES handles bounce/complaint handling
5. **Monitoring:** Set up CloudWatch alarms for failed bookings

## Support

If you need help:
- Check CloudWatch logs first
- AWS SES documentation: https://docs.aws.amazon.com/ses/
- Lambda documentation: https://docs.aws.amazon.com/lambda/
