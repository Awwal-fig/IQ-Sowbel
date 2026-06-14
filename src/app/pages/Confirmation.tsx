import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { CheckCircle2, Download, Mail, ArrowRight, MapPin, Calendar, Clock, User, CreditCard, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBooking } from '../contexts/BookingContext';
import { useBranding } from '../contexts/BrandingContext';
import { generateEmailTemplate } from '../utils/emailTemplate';

export function Confirmation() {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const { branding } = useBranding();

  useEffect(() => {
    if (!bookingData.bookingNumber) {
      navigate('/');
    }
  }, [bookingData.bookingNumber, navigate]);

  if (!bookingData.bookingNumber) {
    return null;
  }

  const seatDisplay = bookingData.selectedSeats
    ? bookingData.selectedSeats.map(s => `${s.seat} (${s.vehicle.replace('SIENNA-', '')})`).join(', ')
    : '';

  const totalAmount = (bookingData.selectedBus?.price || 0) * bookingData.passengers;

  const handleBookAnother = () => {
    resetBooking();
    navigate('/');
  };

  const handleDownloadTicket = () => {
    if (!bookingData.travelDate) return;

    try {
      const ticketHTML = generateEmailTemplate({
        bookingNumber: bookingData.bookingNumber || '',
        passengerName: `${bookingData.firstName} ${bookingData.lastName}`,
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        departure: bookingData.departure || '',
        destination: bookingData.destination || '',
        travelDate: bookingData.travelDate,
        departureTime: bookingData.selectedBus?.departureTime || '',
        seats: seatDisplay,
        passengers: bookingData.passengers,
        pickupLocation: bookingData.pickupLocation || '',
        pickupOption: bookingData.pickupOption || 'station',
        totalAmount: totalAmount,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        companyName: branding.companyName,
        companyEmail: branding.companyEmail,
        companyPhone: branding.companyPhone,
        logoUrl: branding.logoUrl,
      });


      const blob = new Blob([ticketHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${branding.companyName.replace(/\s+/g, '-')}-Ticket-${bookingData.bookingNumber}.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Unable to download ticket. Please try the Print option instead.');
    }
  };

  const handlePrintTicket = () => {
    try {
      if (typeof window !== 'undefined' && window.print) {
        window.print();
      } else {
        alert('Print is not supported in this environment');
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Unable to print. Please use Download Ticket instead.');
    }
  };

  const handleEmailTicket = () => {
    if (!bookingData.travelDate || !bookingData.email) {
      alert('Missing booking information');
      return;
    }

    try {
      // Collect all unique emails from passengers
      const allEmails = new Set<string>();
      allEmails.add(bookingData.email); // First passenger email

      // Add emails from additional passengers if they exist
      if (bookingData.passengersInfo && bookingData.passengersInfo.length > 1) {
        bookingData.passengersInfo.forEach((passenger: any) => {
          if (passenger.email && !passenger.sameEmailAsFirst) {
            allEmails.add(passenger.email);
          }
        });
      }

      const uniqueEmails = Array.from(allEmails);
      const emailSubject = `Booking Confirmation - ${bookingData.bookingNumber}`;
      const emailBody = `
BOOKING CONFIRMED - IQ SOWBEL TRANSPORT

Booking Reference: ${bookingData.bookingNumber}

JOURNEY DETAILS
================
Route: ${bookingData.departure} → ${bookingData.destination}
Travel Date: ${format(bookingData.travelDate, 'EEEE, MMMM d, yyyy')}
Departure Time: ${bookingData.selectedBus?.departureTime}
Seat Numbers: ${seatDisplay}

PASSENGER INFORMATION
=====================
Name: ${bookingData.firstName} ${bookingData.lastName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Number of Passengers: ${bookingData.passengers}

BOARDING POINT
==============
${bookingData.pickupLocation}

PAYMENT DETAILS
===============
Total Amount Paid: ₦${totalAmount.toLocaleString()}

IMPORTANT INFORMATION
=====================
• Please arrive at your boarding point at least ${bookingData.pickupOption === 'park' ? '30 minutes' : '15 minutes'} before departure
• Carry a valid ID card for verification
• Keep this booking reference handy for check-in
• Contact support at +234 800 123 4567 for assistance

Thank you for choosing IQ Sowbel!
Have a safe journey.

© 2026 IQ Sowbel Transport Ltd.
      `.trim();

      // Create mailto link with all unique emails
      const mailtoLink = `mailto:${uniqueEmails.join(',')}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.click();

        if (uniqueEmails.length > 1) {
          alert(`Email will be sent to ${uniqueEmails.length} recipients: ${uniqueEmails.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Unable to open email client. Please manually email the ticket to the passengers.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-accent/50 to-white py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl mb-2">Booking Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Your journey has been confirmed. {bookingData.passengers > 1 && bookingData.passengersInfo ?
              `We've sent tickets to all ${(() => {
                const uniqueEmails = new Set<string>();
                uniqueEmails.add(bookingData.email);
                if (bookingData.passengersInfo) {
                  bookingData.passengersInfo.forEach((p: any) => {
                    if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                  });
                }
                return uniqueEmails.size;
              })()} passenger email${(() => {
                const uniqueEmails = new Set<string>();
                uniqueEmails.add(bookingData.email);
                if (bookingData.passengersInfo) {
                  bookingData.passengersInfo.forEach((p: any) => {
                    if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                  });
                }
                return uniqueEmails.size > 1 ? 's' : '';
              })()}.` :
              "We've sent the details to your email."}
          </p>
        </div>

        {/* Ticket Card */}
        <Card className="mb-6 shadow-lg avoid-break">
          <CardContent className="p-8">
            {/* Booking Number */}
            <div className="text-center pb-6 mb-6 border-b border-dashed border-border">
              <div className="text-sm text-muted-foreground mb-2">Booking Reference</div>
              <div className="text-3xl font-semibold tracking-wider text-primary">
                {bookingData.bookingNumber}
              </div>
            </div>

            {/* Journey Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Route */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Route</span>
                </div>
                <div className="text-lg">
                  {bookingData.departure} <ArrowRight className="inline h-4 w-4 mx-1" /> {bookingData.destination}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Travel Date</span>
                </div>
                <div className="text-lg">
                  {bookingData.travelDate && format(bookingData.travelDate, 'EEEE, MMMM d, yyyy')}
                </div>
              </div>

              {/* Departure Time */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Departure Time</span>
                </div>
                <div className="text-lg">{bookingData.selectedBus?.departureTime}</div>
              </div>

              {/* Seat Numbers */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Seat Numbers</span>
                </div>
                <div className="text-base font-semibold text-primary">
                  {seatDisplay}
                </div>
              </div>

              {/* Passenger Name */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Passenger Name</span>
                </div>
                <div className="text-lg">{bookingData.firstName} {bookingData.lastName}</div>
              </div>

              {/* Boarding Point */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Boarding Point</span>
                </div>
                <div className="text-lg">{bookingData.pickupLocation}</div>
              </div>
            </div>

            {/* Amount */}
            <div className="border-t border-border pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg text-muted-foreground">Amount Paid</span>
                <span className="text-2xl font-semibold">
                  ₦{((bookingData.selectedBus?.price || 0) * bookingData.passengers).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 no-print">
          <Button
            onClick={handleDownloadTicket}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Ticket
          </Button>
          <Button
            onClick={handleEmailTicket}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Mail className="mr-2 h-5 w-5" />
            {(() => {
              const uniqueEmails = new Set<string>();
              uniqueEmails.add(bookingData.email);
              if (bookingData.passengersInfo && bookingData.passengersInfo.length > 1) {
                bookingData.passengersInfo.forEach((p: any) => {
                  if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                });
              }
              return uniqueEmails.size > 1 ? `Email to All (${uniqueEmails.size})` : 'Email Ticket';
            })()}
          </Button>
          <Button
            onClick={handlePrintTicket}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Printer className="mr-2 h-5 w-5" />
            Print Ticket
          </Button>
        </div>

        <div className="text-center mb-8 no-print">
          <Button
            onClick={handleBookAnother}
            size="lg"
            className="px-8"
          >
            Book Another Journey
          </Button>
        </div>

        {/* Important Information */}
        <Card className="bg-accent/50 border-primary/20">
          <CardContent className="p-6">
            <h3 className="mb-4">Important Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Please arrive at your boarding point at least{' '}
                  {bookingData.pickupOption === 'park' ? '30 minutes' : '15 minutes'} before departure time.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Carry a valid ID card and your booking reference number for verification.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Your e-ticket has been sent to {(() => {
                    const uniqueEmails = new Set<string>();
                    uniqueEmails.add(bookingData.email);
                    if (bookingData.passengersInfo && bookingData.passengersInfo.length > 1) {
                      bookingData.passengersInfo.forEach((p: any) => {
                        if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                      });
                    }
                    const emails = Array.from(uniqueEmails);
                    return emails.length > 1
                      ? `all passenger emails (${emails.join(', ')})`
                      : bookingData.email;
                  })()}. Please check your inbox and spam folder.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  For any assistance, contact our 24/7 support at +234 800 123 4567.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Thank You Message */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>Thank you for choosing IQ Sowbel. Have a safe journey!</p>
        </div>
      </div>
    </div>
  );
}
