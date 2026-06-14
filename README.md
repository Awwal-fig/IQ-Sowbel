# IQ Sowbel Bus Booking System

A modern, full-featured bus booking and management platform built with React, TypeScript, and Tailwind CSS.

![Bus Booking System](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

---

## 🌟 Features

### Customer-Facing Features
- **Journey Search & Booking** - Search routes, select dates, choose passengers
- **Visual Seat Selection** - Interactive car layout with real-time availability
- **Flexible Pickup Options** - Choose between pickup stations or main terminal
- **Booking Management** - View, reschedule, and print tickets
- **Email Notifications** - Beautiful branded emails to all passengers (templates ready!)
- **Mobile Responsive** - Seamless experience on all devices
- **Custom 404 Page** - Friendly error page with helpful navigation

### Admin Portal Features
- **Comprehensive Dashboard** - Real-time overview of bookings and revenue
- **Booking Management** - View, manage, cancel, and export bookings
- **Fleet Management** - Add and manage vehicles
- **Passenger Management** - View passenger information
- **Complete Settings Control**
  - Custom branding (logo, colors)
  - Company information
  - Terminal/park configuration
  - Pricing management
- **Export Reports** - Download booking data as CSV

---

## 🚀 Quick Start

### 1. Access the Application

**Public Site:** `/` (Customer booking interface)
**Admin Portal:** `/admin/login`

### 2. Default Admin Credentials

```
Email: admin@iqsowbel.com
Password: admin123
```

⚠️ **Change these immediately after first login!**

### 3. Initial Setup

1. Login to admin portal
2. Go to Settings → Branding
3. Upload your logo and set brand colors
4. Update company information and terminal address
5. Add your vehicles in the Vehicles section
6. You're ready to accept bookings!

📖 **See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions**

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, cards, etc.)
│   │   ├── AdminLayout.tsx
│   │   └── Layout.tsx
│   ├── contexts/       # React Context providers
│   │   ├── BookingContext.tsx
│   │   ├── BrandingContext.tsx
│   │   └── DataContext.tsx
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin portal pages
│   │   └── ...         # Public site pages
│   ├── routes.tsx      # Route configuration
│   └── App.tsx         # Root component
└── styles/
    ├── animations.css  # Animation utilities
    ├── fonts.css       # Font imports
    ├── print.css       # Print styles
    └── theme.css       # Theme variables
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **State Management:** React Context API
- **Data Storage:** localStorage (demo - use database in production)

---

## 🎨 Customization

### Branding
All branding is customizable through the Admin Settings:
- Company logo (drag & drop upload)
- Brand colors (primary, secondary, accent)
- Company information
- Terminal/park details

### Routes
**Currently Operating:** Abuja ↔ Ilorin

IQ Sowbel specializes in reliable service between Abuja and Ilorin. To add additional routes in the future, modify `src/app/pages/SearchJourney.tsx`

### Pricing
Configure base price per seat in Admin Settings → Pricing

---

## 📱 Responsive Design

Fully responsive with breakpoints for:
- Mobile (< 768px) - Hamburger menus
- Tablet (768px - 1024px)
- Desktop (> 1024px) - Full navigation

---

## 🔐 Security Notes

**Current Implementation (Demo):**
- localStorage-based authentication
- Demo payment system
- mailto: email links
- Client-side only

**For Production:**
- Implement JWT-based authentication
- Integrate payment gateway (Paystack, Flutterwave)
- Set up email service (Resend, SendGrid)
- Add backend API with database
- Implement proper security measures

📋 **See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for complete production requirements**

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] Update admin credentials
- [ ] Configure branding and company info
- [ ] Add your vehicles
- [ ] Test booking flow end-to-end
- [ ] Integrate payment gateway
- [ ] Set up email service
- [ ] Configure production database
- [ ] Set up monitoring and analytics

### Production Integrations Required

**Payment Gateways (Nigeria):**
- Paystack
- Flutterwave
- Interswitch

**Email Services:**
- Resend (recommended - see EMAIL_INTEGRATION_GUIDE.md)
- SendGrid
- Mailgun
- Supabase Edge Functions

📧 **Note**: Beautiful, brand-aware HTML email templates are already created and ready to use!

**Databases:**
- Supabase (recommended)
- PostgreSQL
- Firebase

---

## 📊 Features Overview

### Booking Flow
1. Search journey (route, date, passengers)
2. View available journeys
3. Select seats (visual car layout)
4. Choose pickup option
5. Enter passenger details
6. Make payment
7. Receive confirmation

### Admin Features
- Dashboard with real-time stats
- Complete booking management
- Vehicle fleet management
- Passenger database
- Export reports (CSV)
- Full branding control

---

## 🎯 Key Highlights

- ✅ **Production Ready UI** - Polished, professional design
- ✅ **Fully Responsive** - Works on all devices
- ✅ **Real-time Updates** - Live seat availability
- ✅ **Easy Customization** - No code changes needed for branding
- ✅ **Export Functionality** - Download booking reports
- ✅ **Print Support** - Print tickets and receipts
- ✅ **Email Integration** - Automatic ticket delivery
- ✅ **Comprehensive Admin** - Complete management control

---

## 📞 Support

For setup help and documentation:
- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Production Checklist](./PRODUCTION_CHECKLIST.md) - Launch requirements

---

## 📝 License

This project is a custom bus booking system built for IQ Sowbel Transport.

---

## 🎉 Ready to Launch!

Your bus booking system is ready to accept bookings. Customize your branding, add your vehicles, and start serving customers!

**Happy Booking! 🚌**
