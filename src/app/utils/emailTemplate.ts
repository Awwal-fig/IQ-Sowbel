import { format } from 'date-fns';

interface EmailTemplateData {
  bookingNumber: string;
  passengerName: string;
  email: string;
  phone: string;
  departure: string;
  destination: string;
  travelDate: Date;
  departureTime: string;
  seats: string;
  passengers: number;
  pickupLocation: string;
  pickupOption: 'station' | 'park';
  totalAmount: number;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  logoUrl: string;
}

export function generateEmailTemplate(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${data.bookingNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, ${data.primaryColor} 0%, ${data.primaryColor}dd 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header img {
      max-height: 50px;
      margin-bottom: 20px;
      filter: brightness(0) invert(1);
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .booking-reference {
      background-color: #f8f9fa;
      padding: 25px 30px;
      text-align: center;
      border-bottom: 3px dashed ${data.secondaryColor};
    }
    .booking-reference p {
      margin: 0 0 8px 0;
      color: #6c757d;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .booking-reference h2 {
      margin: 0;
      color: ${data.primaryColor};
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: ${data.primaryColor};
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${data.secondaryColor};
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }
    .detail-value {
      color: #212529;
      font-size: 14px;
      font-weight: 600;
      text-align: right;
    }
    .highlight {
      color: ${data.secondaryColor};
    }
    .total-section {
      background: linear-gradient(135deg, ${data.primaryColor}15 0%, ${data.secondaryColor}15 100%);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-label {
      font-size: 18px;
      font-weight: 600;
      color: #212529;
    }
    .total-amount {
      font-size: 24px;
      font-weight: 700;
      color: ${data.primaryColor};
    }
    .important-info {
      background-color: #fff8f0;
      border-left: 4px solid ${data.secondaryColor};
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .important-info h3 {
      margin: 0 0 15px 0;
      color: ${data.secondaryColor};
      font-size: 16px;
      font-weight: 600;
    }
    .important-info ul {
      margin: 0;
      padding-left: 20px;
      color: #495057;
      line-height: 1.8;
    }
    .important-info li {
      margin-bottom: 8px;
      font-size: 14px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 8px 0;
      color: #6c757d;
      font-size: 14px;
    }
    .footer .company-name {
      color: ${data.primaryColor};
      font-weight: 600;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${data.primaryColor} 0%, ${data.primaryColor}dd 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      margin: 20px 0;
      box-shadow: 0 4px 12px ${data.primaryColor}40;
    }
    .icon {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .header {
        padding: 30px 20px;
      }
      .content {
        padding: 20px;
      }
      .detail-row {
        flex-direction: column;
        gap: 5px;
      }
      .detail-value {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>✓ Booking Confirmed!</h1>
      <p>Thank you for choosing ${data.companyName}</p>
    </div>

    <!-- Booking Reference -->
    <div class="booking-reference">
      <p>Your Booking Reference</p>
      <h2>${data.bookingNumber}</h2>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Journey Details -->
      <div class="section">
        <div class="section-title">🚌 Journey Details</div>
        <div class="detail-row">
          <span class="detail-label">Route</span>
          <span class="detail-value">${data.departure} → ${data.destination}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travel Date</span>
          <span class="detail-value">${format(data.travelDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Departure Time</span>
          <span class="detail-value">${data.departureTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Seat Number(s)</span>
          <span class="detail-value highlight">${data.seats}</span>
        </div>
      </div>

      <!-- Passenger Information -->
      <div class="section">
        <div class="section-title">👤 Passenger Information</div>
        <div class="detail-row">
          <span class="detail-label">Name</span>
          <span class="detail-value">${data.passengerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${data.phone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Passengers</span>
          <span class="detail-value">${data.passengers}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Boarding Point</span>
          <span class="detail-value">${data.pickupLocation}</span>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Total Amount Paid</span>
          <span class="total-amount">₦${data.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <!-- Important Information -->
      <div class="important-info">
        <h3>⚠️ Important Information</h3>
        <ul>
          <li>Please arrive at your boarding point at least <strong>${data.pickupOption === 'park' ? '30 minutes' : '15 minutes'}</strong> before departure time</li>
          <li>Carry a <strong>valid ID card</strong> and your booking reference number for verification</li>
          <li>Keep this email handy for check-in at the terminal</li>
          <li>For any assistance, contact our 24/7 support at <strong>${data.companyPhone}</strong></li>
        </ul>
      </div>

      <center>
        <a href="tel:${data.companyPhone}" class="button">📞 Contact Support</a>
      </center>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="company-name">${data.companyName}</p>
      <p>Have a safe and pleasant journey!</p>
      <p style="margin-top: 20px;">
        Email: ${data.companyEmail} | Phone: ${data.companyPhone}
      </p>
      <p style="font-size: 12px; margin-top: 15px; color: #adb5bd;">
        © ${new Date().getFullYear()} ${data.companyName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
