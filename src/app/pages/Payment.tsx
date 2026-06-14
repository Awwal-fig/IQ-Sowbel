import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, MapPin, CreditCard, Smartphone, Lock, Shield, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useBooking } from '../contexts/BookingContext';
import { useData } from '../contexts/DataContext';

export function Payment() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  const { addBooking } = useData();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!bookingData.email) {
      navigate('/');
    }
  }, [bookingData.email, navigate]);

  if (!bookingData.email) {
    return null;
  }

  const totalAmount = (bookingData.selectedBus?.price || 0) * bookingData.passengers;
  const seatDisplay = bookingData.selectedSeats
    ? bookingData.selectedSeats.map(s => `${s.seat} (${s.vehicle.replace('SIENNA-', '')})`).join(', ')
    : '';

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const bookingNumber = `IQS${Date.now().toString().slice(-8)}`;

      // Save booking to DataContext
      if (bookingData.travelDate && bookingData.selectedSeats) {
        addBooking({
          id: bookingNumber,
          passenger: `${bookingData.firstName} ${bookingData.lastName}`,
          email: bookingData.email || '',
          phone: bookingData.phone || '',
          departure: bookingData.departure || '',
          destination: bookingData.destination || '',
          travelDate: bookingData.travelDate,
          departureTime: bookingData.selectedBus?.departureTime || '6:00 AM',
          seats: bookingData.selectedSeats,
          passengers: bookingData.passengers,
          amount: totalAmount,
          status: 'confirmed',
          pickupOption: bookingData.pickupOption || 'station',
          pickupLocation: bookingData.pickupLocation || '',
          passengersInfo: bookingData.passengersInfo,
        });
      }

      updateBookingData({ bookingNumber });
      navigate('/confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/passenger-details')}
          className="mb-6"
          disabled={isProcessing}
        >
          ← Back to Passenger Details
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey & Passenger Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Review Booking Details</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Route</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {bookingData.departure} <ArrowRight className="inline h-3 w-3 mx-1" /> {bookingData.destination}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Date</div>
                      <div className="text-sm">{bookingData.travelDate && format(bookingData.travelDate, 'MMM d, yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Departure Time</div>
                      <div className="text-sm">{bookingData.selectedBus?.departureTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Seat Numbers</div>
                      <div className="text-sm font-semibold text-primary">
                        {seatDisplay}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Passenger Name</div>
                      <div className="text-sm">{bookingData.firstName} {bookingData.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Email</div>
                      <div className="text-sm">{bookingData.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Phone</div>
                      <div className="text-sm">{bookingData.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Boarding Point</div>
                      <div className="text-sm">{bookingData.pickupLocation}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Payment Method</h2>

                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This is a demo payment system. No real charges will be made. In production, this would integrate with a payment gateway like Paystack or Flutterwave.
                  </AlertDescription>
                </Alert>

                <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'transfer') => setPaymentMethod(value)}>
                  <div className="space-y-4">
                    {/* Card Payment */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-accent/50'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="card" id="card" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="cursor-pointer flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-lg">Pay with Card</span>
                          </Label>

                          {paymentMethod === 'card' && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  maxLength={19}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="cardName">Cardholder Name</Label>
                                <Input
                                  id="cardName"
                                  placeholder="Name on card"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="expiryDate">Expiry Date</Label>
                                  <Input
                                    id="expiryDate"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    maxLength={5}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength={4}
                                    type="password"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                <Lock className="h-4 w-4" />
                                <span>Your payment information is secure and encrypted</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transfer Payment */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-primary bg-accent/50'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setPaymentMethod('transfer')}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="transfer" id="transfer" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="transfer" className="cursor-pointer flex items-center gap-2 mb-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <span className="text-lg">Bank Transfer</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Complete payment via bank transfer or USSD
                          </p>

                          {paymentMethod === 'transfer' && (
                            <div className="mt-4 bg-white border border-border rounded-lg p-4 space-y-3">
                              <p className="text-sm">Transfer ₦{totalAmount.toLocaleString()} to:</p>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-muted-foreground">Bank Name</div>
                                  <div className="font-medium">First Bank of Nigeria</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Account Number</div>
                                  <div className="font-medium">1234567890</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Account Name</div>
                                  <div className="font-medium">IQ Sowbel Transport Ltd</div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground border-t border-border pt-3">
                                After transfer, your booking will be confirmed within 5 minutes
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4">Payment Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span>₦{(bookingData.selectedBus?.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Passengers</span>
                    <span>×{bookingData.passengers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>₦0</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl">
                    <span>Total Amount</span>
                    <span className="font-semibold">₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Secure Payment</div>
                      <p className="text-xs">
                        Your payment is protected by 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
