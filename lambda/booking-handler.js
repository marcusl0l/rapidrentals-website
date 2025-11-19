// AWS Lambda Function for Booking Email via SES
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'ap-southeast-2' }); // Sydney

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@rapidrentals.co.nz';
const TO_EMAIL = process.env.TO_EMAIL || 'info@rapidrentals.co.nz';

exports.handler = async (event) => {
    console.log('Received booking:', JSON.stringify(event, null, 2));
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }
    
    try {
        const data = JSON.parse(event.body);
        
        if (!data.vehicle || !data.pickupDate || !data.fullName || !data.email || !data.phone) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: false, message: 'Missing required fields' })
            };
        }
        
        const pickupDate = new Date(data.pickupDate);
        const returnDate = new Date(data.returnDate);
        const submittedDate = new Date(data.timestamp);
        
        const ownerEmailHtml = createOwnerEmail(data, pickupDate, returnDate, submittedDate);
        const customerEmailHtml = createCustomerEmail(data, pickupDate, returnDate);
        
        await ses.sendEmail({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [TO_EMAIL] },
            Message: {
                Subject: { Data: `🚛 New Booking - ${data.vehicle}`, Charset: 'UTF-8' },
                Body: { Html: { Data: ownerEmailHtml, Charset: 'UTF-8' } }
            }
        }).promise();
        
        await ses.sendEmail({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [data.email] },
            Message: {
                Subject: { Data: `✅ Booking Received - Rapid Rentals`, Charset: 'UTF-8' },
                Body: { Html: { Data: customerEmailHtml, Charset: 'UTF-8' } }
            }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: 'Booking received' })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Failed to process booking' })
        };
    }
};

function formatDate(date) {
    return date.toLocaleDateString('en-NZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function createOwnerEmail(data, pickupDate, returnDate, submittedDate) {
    return `<!DOCTYPE html><html><body style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:8px;margin-bottom:20px">
<h1 style="margin:0">🚛 New Booking Request</h1></div>
<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
<h2 style="color:#667eea">Vehicle</h2>
<p><b>Vehicle:</b> ${data.vehicle}</p>
<p><b>Pick-up:</b> ${formatDate(pickupDate)} at ${data.pickupTime}</p>
<p><b>Return:</b> ${formatDate(returnDate)} at ${data.returnTime}</p></div>
<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
<h2 style="color:#667eea">Customer</h2>
<p><b>Name:</b> ${data.fullName}</p>
<p><b>Email:</b> <a href="mailto:${data.email}">${data.email}</a></p>
<p><b>Phone:</b> <a href="tel:${data.phone}">${data.phone}</a></p>
${data.address ? `<p><b>Address:</b> ${data.address}</p>` : ''}</div>
${data.purpose ? `<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px"><h2 style="color:#667eea">Purpose</h2><p>${data.purpose}</p></div>` : ''}
${data.notes ? `<div style="background:#fff3cd;padding:20px;border-radius:8px"><h2 style="color:#856404">Special Requests</h2><p>${data.notes}</p></div>` : ''}
<p style="font-size:12px;color:#666">Submitted: ${submittedDate.toLocaleString('en-NZ')}</p>
</body></html>`;
}

function createCustomerEmail(data, pickupDate, returnDate) {
    return `<!DOCTYPE html><html><body style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
<div style="background:linear-gradient(135deg,#28a745,#20c997);color:white;padding:20px;border-radius:8px;margin-bottom:20px">
<h1 style="margin:0">✅ Booking Received!</h1></div>
<div style="background:#d4edda;padding:20px;border-radius:8px;margin-bottom:20px;border-left:4px solid #28a745">
<p style="color:#155724"><b>Hi ${data.fullName},</b><br><br>Thank you! We'll confirm within 24 hours.</p></div>
<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
<h2 style="color:#28a745">Your Booking</h2>
<p><b>Vehicle:</b> ${data.vehicle}</p>
<p><b>Pick-up:</b> ${formatDate(pickupDate)} at ${data.pickupTime}</p>
<p><b>Return:</b> ${formatDate(returnDate)} at ${data.returnTime}</p></div>
<div style="background:#fff3cd;padding:20px;border-radius:8px;margin-bottom:20px">
<h3 style="color:#856404">📋 What's Next?</h3>
<ol style="color:#856404"><li>We'll contact you within 24 hours</li>
<li>Have your licence ready</li><li>Bond ($200+) required at pickup</li>
<li>Return with full fuel tank</li></ol></div>
<div style="background:#e7f3ff;padding:20px;border-radius:8px">
<p style="color:#004085"><b>Contact:</b> 09 298 1738 | info@rapidrentals.co.nz<br>
<b>Hours:</b> Mon-Fri 8am-5pm, Sat 8am-12pm</p></div>
<p style="text-align:center;color:#666;font-size:12px;margin-top:20px">© 2025 Rapid Rentals</p>
</body></html>`;
}
