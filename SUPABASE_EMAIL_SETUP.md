# Manual Supabase Email Setup Guide

This guide will help you set up email sending functionality for your booking system.

## Prerequisites

1. A Supabase account (free tier works): https://supabase.com
2. A Resend account for sending emails (free tier: 3,000 emails/month): https://resend.com
3. Supabase CLI installed: `npm install -g supabase`

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: iq-sowbel-booking (or any name)
   - **Database Password**: Create a strong password (save it)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **Project Reference ID** (e.g., xxxxx)
   - **anon public key** (starts with eyJ...)

## Step 3: Set Up Resend Email Service

1. Go to https://resend.com and sign up
2. Once logged in, click **API Keys** in the left sidebar
3. Click **Create API Key**
4. Name it "iq-sowbel-booking" and click **Create**
5. **IMPORTANT**: Copy the API key immediately (starts with re_...) - you won't see it again

## Step 4: Initialize Supabase in Your Project

Open your terminal in the project directory and run:

```bash
# Login to Supabase CLI
supabase login

# Link to your project (use the Reference ID from Step 2)
supabase link --project-ref YOUR_PROJECT_REFERENCE_ID

# Create the edge function
supabase functions new send-booking-email
```

## Step 5: Create the Email Edge Function

The function code has been created in `supabase/functions/send-booking-email/index.ts`

## Step 6: Set Up Environment Variables

In your terminal, set the Resend API key as a secret:

```bash
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
```

## Step 7: Deploy the Edge Function

```bash
supabase functions deploy send-booking-email
```

You should see output like:
```
Deployed Function send-booking-email on project xxxxx
```

## Step 8: Update Frontend Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

## Step 9: Test the Function

After deployment, the app will automatically send emails when:
- A booking is confirmed (after payment)
- Admin clicks "Send Email" in booking details

## Troubleshooting

### Function not deploying?
```bash
# Check function logs
supabase functions logs send-booking-email
```

### Email not sending?
1. Check Resend dashboard for delivery logs
2. Verify your Resend API key is correct
3. Check Supabase function logs for errors

### CORS errors?
The function includes CORS headers, but if you still see errors, check the browser console.

## Cost Breakdown

- **Supabase**: Free tier includes 500,000 function invocations/month
- **Resend**: Free tier includes 3,000 emails/month
- **Total**: $0/month for most booking operations

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to Git
- Never share your API keys
- This setup is for prototypes/demos, not production with sensitive PII

## Next Steps

Once deployed, test by:
1. Making a test booking through the website
2. Completing payment
3. Check the email inbox for the booking confirmation

The email will include:
- Booking reference number
- Journey details (route, date, time)
- Seat numbers and vehicle names
- Passenger information
- Boarding point
- QR code for easy check-in
