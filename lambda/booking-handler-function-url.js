// AWS Lambda for Booking via Function URL (CORS handled by Function URL)
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: 'ap-southeast-2' });

const FROM_EMAIL = process.env.FROM_EMAIL || 'marcus@mccallitsolutions.co.nz';
const TO_EMAIL = process.env.TO_EMAIL || 'marcus@mccallitsolutions.co.nz';

exports.handler = async (event) => {
    console.log('Received:', JSON.stringify(event, null, 2));
    
    try {
        const data = JSON.parse(event.body);
        
        if (!data.vehicle || !data.pickupDate || !data.fullName || !data.email || !data.phone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Missing fields' })
            };
        }
        
        const pickupDate = new Date(data.pickupDate);
        const returnDate = new Date(data.returnDate);
        
        await ses.send(new SendEmailCommand({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [TO_EMAIL] },
            Message: {
                Subject: { Data: `New Booking - ${data.vehicle}` },
                Body: { Html: { Data: `<h1>New Booking</h1><p>Vehicle: ${data.vehicle}</p><p>Customer: ${data.fullName}</p><p>Email: ${data.email}</p><p>Phone: ${data.phone}</p><p>Pickup: ${pickupDate.toLocaleDateString()} at ${data.pickupTime}</p>` } }
            }
        }));
        
        await ses.send(new SendEmailCommand({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [data.email] },
            Message: {
                Subject: { Data: `Booking Confirmed - Rapid Rentals` },
                Body: { Html: { Data: `<h1>Booking Received!</h1><p>Hi ${data.fullName},</p><p>We'll contact you within 24 hours.</p>` } }
            }
        }));
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Booking received' })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Failed' })
        };
    }
};
