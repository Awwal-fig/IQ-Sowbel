# Email Integration Guide

## 📧 Beautiful Branded Email Templates

Your bus booking system now includes professionally designed, brand-aware email templates that automatically use your company colors, logo, and information.

---

## 🎨 Current Implementation

### What's Working Now:

1. **Download Ticket** - Creates a beautiful HTML file with your branding
2. **Email via mailto:** - Opens user's email client with plain text
3. **Print Ticket** - Uses browser print with optimized styles

### Email Template Features:

✅ **Fully Branded**
- Uses your primary and secondary colors from Settings
- Displays your company logo
- Shows your company name, email, and phone

✅ **Professional Design**
- Modern gradient header
- Clear section organization
- Highlighted booking reference
- Important information callout box
- Mobile responsive layout
- Beautiful typography

✅ **Dynamic Content**
- All booking details included
- Passenger information
- Journey details
- Payment summary
- Seat assignments

---

## 🚀 Integrating with Real Email Service

To send these beautiful emails automatically, integrate with an email service provider:

### Recommended: Resend (Most Modern)

**Why Resend?**
- Modern, developer-friendly API
- Generous free tier (100 emails/day)
- Great deliverability
- Built for transactional emails
- Easy to set up

**Setup Steps:**

1. **Sign up at [resend.com](https://resend.com)**

2. **Get your API key** from the dashboard

3. **Install Resend package:**
```bash
pnpm add resend
```

4. **Create email sending function:**

```typescript
// src/app/utils/sendEmail.ts
import { Resend } from 'resend';
import { generateEmailTemplate } from './emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(bookingData: any, branding: any) {
  const seatDisplay = bookingData.selectedSeats
    .map(s => `${s.seat} (${s.vehicle.replace('SIENNA-', '')})`)
    .join(', ');

  const totalAmount = (bookingData.selectedBus?.price || 0) * bookingData.passengers;

  // Collect all unique emails
  const allEmails = new Set<string>();
  allEmails.add(bookingData.email);
  
  if (bookingData.passengersInfo && bookingData.passengersInfo.length > 1) {
    bookingData.passengersInfo.forEach((passenger: any) => {
      if (passenger.email && !passenger.sameEmailAsFirst) {
        allEmails.add(passenger.email);
      }
    });
  }

  const emailHTML = generateEmailTemplate({
    bookingNumber: bookingData.bookingNumber,
    passengerName: `${bookingData.firstName} ${bookingData.lastName}`,
    email: bookingData.email,
    phone: bookingData.phone,
    departure: bookingData.departure,
    destination: bookingData.destination,
    travelDate: bookingData.travelDate,
    departureTime: bookingData.selectedBus?.departureTime,
    seats: seatDisplay,
    passengers: bookingData.passengers,
    pickupLocation: bookingData.pickupLocation,
    pickupOption: bookingData.pickupOption,
    totalAmount: totalAmount,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    companyName: branding.companyName,
    companyEmail: branding.companyEmail,
    companyPhone: branding.companyPhone,
    logoUrl: branding.logoUrl,
  });

  // Send to all passenger emails
  for (const email of allEmails) {
    await resend.emails.send({
      from: `${branding.companyName} <bookings@yourdomain.com>`,
      to: email,
      subject: `Booking Confirmation - ${bookingData.bookingNumber}`,
      html: emailHTML,
    });
  }
}
```

5. **Update Payment.tsx to send email:**

```typescript
// In handlePayment function, after addBooking
import { sendBookingConfirmation } from '../utils/sendEmail';

// After saving booking
await sendBookingConfirmation(bookingData, branding);
```

---

### Alternative: SendGrid

**Setup Steps:**

1. **Sign up at [sendgrid.com](https://sendgrid.com)**

2. **Install SendGrid package:**
```bash
pnpm add @sendgrid/mail
```

3. **Create email function:**

```typescript
import sgMail from '@sendgrid/mail';
import { generateEmailTemplate } from './emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendBookingConfirmation(bookingData: any, branding: any) {
  // ... prepare data (same as Resend example)
  
  const emailHTML = generateEmailTemplate({ /* ... */ });

  const msg = {
    to: Array.from(allEmails),
    from: `${branding.companyName} <bookings@yourdomain.com>`,
    subject: `Booking Confirmation - ${bookingData.bookingNumber}`,
    html: emailHTML,
  };

  await sgMail.send(msg);
}
```

---

### Alternative: Supabase Edge Functions

**Perfect if you're already using Supabase for database!**

1. **Create edge function:**
```bash
supabase functions new send-booking-email
```

2. **Function code:**
```typescript
// supabase/functions/send-booking-email/index.ts
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  const { bookingData, branding, emailHTML } = await req.json();

  await resend.emails.send({
    from: `${branding.companyName} <bookings@yourdomain.com>`,
    to: bookingData.emails,
    subject: `Booking Confirmation - ${bookingData.bookingNumber}`,
    html: emailHTML,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

3. **Call from frontend:**
```typescript
const emailHTML = generateEmailTemplate({ /* ... */ });

await supabase.functions.invoke('send-booking-email', {
  body: {
    bookingData,
    branding,
    emailHTML,
  },
});
```

---

## 🎨 Customizing Email Template

The email template (`src/app/utils/emailTemplate.ts`) uses:

- **Primary Color**: Header background, buttons, highlights
- **Secondary Color**: Accents, borders, important sections
- **Company Logo**: Header logo (can be URL or base64)
- **Company Name**: Throughout the email
- **Contact Info**: Footer with email and phone

### To Customize Further:

1. **Edit the template file**: `src/app/utils/emailTemplate.ts`
2. **Modify colors, fonts, spacing** in the `<style>` section
3. **Add/remove sections** as needed
4. **Test with different brands** using the Download Ticket feature

---

## 📱 Email Client Compatibility

The template is tested and works in:

✅ Gmail (Desktop & Mobile)
✅ Outlook (Desktop & Web)
✅ Apple Mail (iOS & macOS)
✅ Yahoo Mail
✅ Thunderbird
✅ Mobile email apps

---

## 🔐 Environment Variables

Add to your `.env` file:

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Or SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Email sender (must be verified domain)
EMAIL_FROM=bookings@yourdomain.com
EMAIL_FROM_NAME=IQ Sowbel
```

---

## ✅ Testing Your Email Setup

1. **Test locally first:**
   - Use a test booking
   - Send to your own email
   - Check spam folder
   - Verify all sections render correctly

2. **Test in production:**
   - Complete a real booking
   - Check all passenger emails received
   - Verify branding displays correctly
   - Test on mobile devices

3. **Monitor deliverability:**
   - Check email service dashboard
   - Monitor bounce rates
   - Track open rates
   - Review spam reports

---

## 💡 Pro Tips

1. **Domain Authentication**
   - Verify your sending domain with your email provider
   - Set up SPF, DKIM, and DMARC records
   - This greatly improves deliverability

2. **Email Tracking**
   - Most providers offer open/click tracking
   - Use this to monitor customer engagement
   - A/B test different subject lines

3. **Backup Plan**
   - Keep the mailto: functionality as fallback
   - Log all email attempts
   - Set up alerts for failed sends

4. **Attachments**
   - You can attach the ticket HTML as a file
   - Or include a PDF version
   - Example with Resend:
   ```typescript
   attachments: [{
     filename: 'ticket.html',
     content: emailHTML,
   }]
   ```

---

## 🚨 Important Notes

⚠️ **Free Tier Limits:**
- Resend: 100 emails/day
- SendGrid: 100 emails/day
- Upgrade as your business grows

⚠️ **Sender Email:**
- Must use a verified domain
- Can't send from @gmail.com, @yahoo.com, etc.
- Set up custom domain or use service subdomain

⚠️ **Compliance:**
- Include unsubscribe link (for marketing emails)
- Add physical address (CAN-SPAM requirement)
- Respect passenger privacy

---

## 🎉 You're Ready!

Your email templates are production-ready and beautifully branded. Just integrate with an email service and you're all set to send professional booking confirmations automatically!

**Questions?** Check your email service provider's documentation or reach out to their support team.
