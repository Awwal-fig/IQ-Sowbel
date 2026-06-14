# IQ Sowbel Bus Booking System - Setup Guide

## 🚀 Welcome to Your Bus Booking Platform!

This is a complete bus booking management system built with React, TypeScript, and Tailwind CSS. Everything is ready to use right out of the box.

---

## 📋 First Time Setup

### 1. **Access the Admin Portal**

Navigate to: `/admin/login`

**Default Credentials:**
- Email: `admin@iqsowbel.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately after your first login!

### 2. **Configure Your Branding** (Admin Settings)

Go to **Admin Portal → Settings → Branding** and customize:

- **Logo**: Drag & drop your company logo or enter an image URL
- **Primary Color**: Your main brand color (used for buttons, headers)
- **Secondary/Coral Color**: Accent color for highlights
- **Accent Color**: Background accents and subtle elements

### 3. **Update Company Information** (Admin Settings)

Go to **Admin Portal → Settings → Company & Park** and update:

**Company Details:**
- Company Name
- Email Address
- Phone Number

**Terminal/Park Information:**
- Terminal Name
- Full Address
- Landmarks (to help passengers find you)
- Opening Time

### 4. **Set Up Pricing** (Admin Settings)

Go to **Admin Portal → Settings → Pricing** and configure:
- Base Price per Seat (in Naira)

### 5. **Add Your Vehicles** (Admin Portal)

Go to **Admin Portal → Vehicles** and:
- Click "Add New Vehicle"
- Enter vehicle details (name, model, plate number)
- Set capacity and status
- All vehicles default to 7-seater Toyota Sienna layout

---

## 🎯 Key Features

### For Customers (Public Site)
- **Book Journey**: Search routes, select dates, choose seats
- **Seat Selection**: Visual car layout with real-time seat availability
- **Pickup Options**: Choose between pickup stations or main terminal
- **Manage Booking**: View, reschedule, and print tickets using booking number
- **Email Tickets**: Automatic ticket delivery via email client

### For Admins (Admin Portal)
- **Dashboard**: Overview of bookings, revenue, and fleet status
- **Bookings Management**: View all bookings, send emails, cancel bookings, export reports
- **Vehicle Management**: Add, edit, and manage your fleet
- **Passengers**: View passenger information and history
- **Settings**: Complete branding and configuration control

---

## 💾 Data Storage

All data is stored in **localStorage** in the browser:
- Bookings
- Vehicles
- Branding Settings
- Company Information

**Note**: For production use, you should integrate with a backend database (Supabase, Firebase, or custom API).

---

## 🔐 Security Notes

1. **Admin Authentication**: Currently uses simple localStorage authentication. For production, implement proper JWT-based authentication.

2. **Payment Integration**: The payment system is currently a demo. For real transactions, integrate with:
   - Paystack
   - Flutterwave
   - Interswitch
   - Or any other Nigerian payment gateway

3. **Email System**: Uses `mailto:` links. For production, integrate with:
   - Supabase Edge Functions + Resend
   - SendGrid
   - Mailgun
   - Or any email service provider

---

## 📱 Mobile Responsive

The entire application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

Navigation automatically switches to hamburger menus on smaller screens.

---

## 🎨 Customization Tips

### Colors
- All colors update in real-time across the entire site
- Colors are stored as CSS variables for consistent theming
- Use your brand colors for a cohesive look

### Logo
- Recommended size: 200x60px (transparent background PNG)
- Supported formats: PNG, JPG, SVG
- Can upload via drag-and-drop or URL

### Routes
Currently supports: Abuja ↔ Ilorin

To add more routes, you'll need to modify:
- `src/app/pages/SearchJourney.tsx` (dropdown options)

---

## 📊 Reports & Analytics

### Export Bookings
From **Admin Portal → Bookings**, click "Export Report" to download:
- CSV file with all booking details
- Filtered by current search/status
- Includes passenger info, amounts, dates, seats

---

## 🚗 Vehicle Management

### Adding Vehicles
1. Go to Admin Portal → Vehicles
2. Click "Add New Vehicle"
3. Fill in all required fields
4. Set status to "Active" for bookings

### Vehicle Status
- **Active**: Available for bookings
- **Maintenance**: Hidden from booking system

---

## 🚌 Routes

**Current Operation:** Abuja ↔ Ilorin

IQ Sowbel has been providing reliable bus service between Abuja and Ilorin since 2023. The system is built to focus on this core route, ensuring quality service and on-time departures.

To add more routes in the future, you'll need to update:
- `src/app/pages/SearchJourney.tsx` (add cities to dropdown)

---

## 📧 Email Templates

Your system includes beautiful, professionally designed HTML email templates that:
- ✅ Automatically use your brand colors
- ✅ Display your company logo
- ✅ Send to all passenger emails
- ✅ Look great on mobile and desktop
- ✅ Work in all major email clients

**Current functionality:**
- **Download Ticket**: Creates beautiful HTML file with your branding
- **Email Ticket**: Opens email client (mailto: link)

**For production:**
See `EMAIL_INTEGRATION_GUIDE.md` for step-by-step instructions on integrating with:
- Resend (recommended)
- SendGrid
- Mailgun
- Supabase Edge Functions

The templates are ready to use - just connect your email service!

## 📞 Customer Support

Set up your support information in:
- **Settings → Company & Park** for terminal/park info
- Footer automatically displays company email and phone

---

## 🔄 Going Live Checklist

- [ ] Update admin credentials (Settings → Account)
- [ ] Upload your company logo
- [ ] Set your brand colors
- [ ] Update company information
- [ ] Configure terminal/park address
- [ ] Set correct pricing
- [ ] Add your vehicles
- [ ] Test the complete booking flow
- [ ] Test manage booking feature
- [ ] Verify email functionality
- [ ] Check mobile responsiveness
- [ ] Integrate payment gateway (for real transactions)
- [ ] Set up proper backend database (optional but recommended)
- [ ] Configure proper email service (for automated emails)

---

## 🆘 Need Help?

### Common Issues

**Q: Bookings not showing up?**
A: Check that vehicles are set to "Active" status.

**Q: Logo not displaying?**
A: Ensure the image URL is correct and accessible. Use drag-and-drop to upload directly.

**Q: Colors not updating?**
A: Click "Save Branding" after making color changes.

**Q: Can't find a booking?**
A: Booking numbers are case-insensitive. Make sure status filter is set to "All" in admin panel.

---

## 🎉 You're All Set!

Your bus booking system is ready to accept bookings. Customers can now:
1. Visit your site
2. Search for journeys
3. Select seats
4. Make bookings
5. Manage their bookings

And you can manage everything from the admin portal!

---

**Happy Booking! 🚌**
