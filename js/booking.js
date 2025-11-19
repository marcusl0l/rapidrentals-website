// Booking Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.min = today;
    returnDateInput.min = today;

    // Update return date minimum when pickup date changes
    pickupDateInput.addEventListener('change', function() {
        returnDateInput.min = this.value;
        if (returnDateInput.value && returnDateInput.value < this.value) {
            returnDateInput.value = this.value;
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add timestamp
        data.timestamp = new Date().toISOString();

        try {
            await sendBookingRequest(data);
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Booking error:', error);
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});

async function sendBookingRequest(data) {
    const emailBody = `
NEW BOOKING REQUEST - Rapid Rentals
=====================================

VEHICLE: ${data.vehicle}

RENTAL PERIOD:
Pick-up: ${formatDate(data.pickupDate)} at ${data.pickupTime}
Return: ${formatDate(data.returnDate)} at ${data.returnTime}

CUSTOMER DETAILS:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address || 'Not provided'}

PURPOSE: ${data.purpose || 'Not specified'}

SPECIAL REQUESTS: ${data.notes || 'None'}

Submitted: ${new Date(data.timestamp).toLocaleString('en-NZ')}
    `.trim();

    return new Promise((resolve) => {
        setTimeout(() => {
            saveBookingLocally(data);
            console.log('Booking request:', data);
            resolve({ success: true });
        }, 1500);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function saveBookingLocally(data) {
    try {
        const bookings = JSON.parse(localStorage.getItem('rapidrentals_bookings') || '[]');
        bookings.push(data);
        localStorage.setItem('rapidrentals_bookings', JSON.stringify(bookings));
    } catch (e) {
        console.error('Failed to save booking locally:', e);
    }
}

function showTerms() {
    alert('Terms and Conditions:\n\n' +
        '1. Valid driver\'s licence required\n' +
        '2. Bond payment required at pick-up\n' +
        '3. Vehicle must be returned with full fuel tank\n' +
        '4. Late returns subject to $50/hour fee\n' +
        '5. Customer responsible for any damages\n' +
        '6. Cancellations must be made 24 hours in advance');
}
