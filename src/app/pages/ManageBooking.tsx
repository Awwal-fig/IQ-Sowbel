import { useState } from 'react';
import { Search, Calendar, MapPin, ArrowRight, Clock, Download, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format, addDays } from 'date-fns';
import { useData } from '../contexts/DataContext';

export function ManageBooking() {
  const { bookings, vehicles } = useData();
  const [bookingNumber, setBookingNumber] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<any>(null);
  const [error, setError] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setError('');
    setSearchedBooking(null);
    setIsSearching(true);

    // Simulate search delay for better UX
    setTimeout(() => {
      const booking = bookings.find(b => b.id.toUpperCase() === bookingNumber.toUpperCase());

      if (booking) {
        // Format booking for display
        const formattedBooking = {
          bookingNumber: booking.id,
          status: booking.status,
          departure: booking.departure,
          destination: booking.destination,
          travelDate: booking.travelDate,
          departureTime: booking.departureTime,
          busType: 'IQ Sowbel Executive',
          seats: booking.seats.map(s => {
            const vehicle = vehicles.find(v => v.id === s.vehicle);
            const vehicleLetter = vehicle?.name.split(' ')[1] || '';
            return `${s.seat} (${vehicleLetter})`;
          }),
          passengers: booking.passengers,
          totalAmount: booking.amount,
          passengerName: booking.passenger,
          email: booking.email,
          phone: booking.phone,
          pickupLocation: booking.pickupLocation,
        };
        setSearchedBooking(formattedBooking);
      } else {
        setError('Booking not found. Please check your booking number and try again.');
      }
      setIsSearching(false);
    }, 500);
  };

  const handleReschedule = () => {
    if (newDate) {
      // Note: In production, this would update the booking in the database
      alert('Reschedule request submitted! You will receive a confirmation email shortly.');
      setSearchedBooking({
        ...searchedBooking,
        travelDate: newDate,
      });
      setIsRescheduling(false);
      setNewDate(null);
    }
  };

  const handlePrintTicket = () => {
    try {
      if (typeof window !== 'undefined' && window.print) {
        window.print();
      } else {
        alert('Print is not supported in this browser');
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Unable to print ticket');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Manage Your Booking</h1>
          <p className="text-muted-foreground">
            View booking details, check status, or reschedule your journey
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingNumber" className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Booking Number
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="bookingNumber"
                    placeholder="Enter your booking number (e.g., IQS123456)"
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!bookingNumber || isSearching}
                    className="h-12 px-6"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground">
                <p>Enter your booking reference number to view or manage your booking.</p>
                <p className="mt-1">You can find this in your confirmation email.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {searchedBooking && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2>Booking Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Booking #{searchedBooking.bookingNumber}
                  </p>
                </div>
                <Badge
                  variant={searchedBooking.status === 'confirmed' ? 'default' : 'secondary'}
                  className="w-fit"
                >
                  {searchedBooking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Journey Information */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground">Journey Information</h3>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{searchedBooking.departure}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{searchedBooking.destination}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {searchedBooking.busType}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Date</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(searchedBooking.travelDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Departure Time</div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{searchedBooking.departureTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Passenger Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div>{searchedBooking.passengerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-sm">{searchedBooking.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div>{searchedBooking.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Seat(s)</div>
                    <div className="font-medium text-primary">
                      {searchedBooking.seats.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Payment Summary</h3>
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Passengers</span>
                    <span>{searchedBooking.passengers}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg border-t border-border pt-2 mt-2">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-semibold">₦{searchedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Dialog open={isRescheduling} onOpenChange={setIsRescheduling}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      Reschedule Journey
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reschedule Journey</DialogTitle>
                      <DialogDescription>
                        Select a new date for your journey. A reschedule fee may apply.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Current Date</Label>
                        <div className="text-sm text-muted-foreground">
                          {format(searchedBooking.travelDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDate">Select New Date</Label>
                        <Select
                          value={newDate ? newDate.toISOString() : ''}
                          onValueChange={(val) => setNewDate(new Date(val))}
                        >
                          <SelectTrigger id="newDate">
                            <SelectValue placeholder="Choose a new date" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 14 }, (_, i) => {
                              const date = addDays(new Date(), i + 1);
                              return (
                                <SelectItem key={i} value={date.toISOString()}>
                                  {format(date, 'EEEE, MMMM d, yyyy')}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs">
                          Note: Reschedule requests are subject to seat availability. You will be contacted for confirmation.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={handleReschedule}
                        disabled={!newDate}
                        className="w-full"
                      >
                        Submit Reschedule Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button onClick={handlePrintTicket} variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
