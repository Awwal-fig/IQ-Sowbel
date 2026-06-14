import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingEmailData {
  bookingNumber: string;
  passengerName: string;
  email: string;
  phone: string;
  departure: string;
  destination: string;
  travelDate: string;
  departureTime: string;
  seats: string;
  pickupLocation: string;
  amount: number;
  passengers: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const bookingData: BookingEmailData = await req.json();

    // Generate email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - IQ Sowbel</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist Mono', monospace, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b4a8c 0%, #2d3a6e 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                ✓ Booking Confirmed
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                Thank you for choosing IQ Sowbel
              </p>
            </td>
          </tr>

          <!-- Booking Reference -->
          <tr>
            <td style="padding: 30px; background-color: #e8eaf2; text-align: center; border-bottom: 2px dashed #3b4a8c;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Booking Reference</p>
              <h2 style="margin: 0; color: #3b4a8c; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                ${bookingData.bookingNumber}
              </h2>
            </td>
          </tr>

          <!-- Journey Details -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #3b4a8c; font-size: 18px; font-weight: 600;">Journey Details</h3>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-size: 14px;">Route</span>
                  </td>
                  <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.departure} → ${bookingData.destination}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-size: 14px;">Travel Date</span>
                  </td>
                  <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.travelDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-size: 14px;">Departure Time</span>
                  </td>
                  <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.departureTime}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-size: 14px;">Seat Numbers</span>
                  </td>
                  <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <strong style="color: #e8725c; font-size: 14px;">${bookingData.seats}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-size: 14px;">Boarding Point</span>
                  </td>
                  <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.pickupLocation}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Passenger Info -->
          <tr>
            <td style="padding: 30px; background-color: #fafafa;">
              <h3 style="margin: 0 0 20px 0; color: #3b4a8c; font-size: 18px; font-weight: 600;">Passenger Information</h3>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #666; font-size: 14px;">Name</span>
                  </td>
                  <td align="right" style="padding: 12px 0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.passengerName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #666; font-size: 14px;">Email</span>
                  </td>
                  <td align="right" style="padding: 12px 0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.email}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #666; font-size: 14px;">Phone</span>
                  </td>
                  <td align="right" style="padding: 12px 0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.phone}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #666; font-size: 14px;">Number of Passengers</span>
                  </td>
                  <td align="right" style="padding: 12px 0;">
                    <strong style="color: #333; font-size: 14px;">${bookingData.passengers}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Amount -->
          <tr>
            <td style="padding: 30px; border-top: 2px solid #e8eaf2;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color: #666; font-size: 16px;">Total Amount Paid</span>
                  </td>
                  <td align="right">
                    <strong style="color: #3b4a8c; font-size: 24px;">₦${bookingData.amount.toLocaleString()}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Information -->
          <tr>
            <td style="padding: 30px; background-color: #fff8f0; border-top: 3px solid #e8725c;">
              <h3 style="margin: 0 0 15px 0; color: #e8725c; font-size: 16px; font-weight: 600;">⚠️ Important Information</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                <li>Please arrive at your boarding point at least 15-30 minutes before departure.</li>
                <li>Carry a valid ID card for verification.</li>
                <li>Keep this booking reference handy for check-in.</li>
                <li>Contact support at +234 800 123 4567 for any assistance.</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                Have a safe journey with IQ Sowbel!
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © 2026 IQ Sowbel Transport Ltd. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'IQ Sowbel Bookings <bookings@resend.dev>', // Change to your verified domain
      to: [bookingData.email],
      subject: `Booking Confirmed - ${bookingData.bookingNumber}`,
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
