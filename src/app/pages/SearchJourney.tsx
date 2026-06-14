import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar as CalendarIcon, Users, MapPin, Shield, Clock, BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useBooking } from '../contexts/BookingContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SearchJourney() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  
  const [departure, setDeparture] = useState(bookingData.departure || '');
  const [destination, setDestination] = useState(bookingData.destination || '');
  const [date, setDate] = useState<Date | undefined>(bookingData.travelDate);
  const [passengers, setPassengers] = useState(bookingData.passengers || 1);

  const handleContinue = () => {
    if (departure && destination && date && departure !== destination) {
      updateBookingData({
        departure,
        destination,
        travelDate: date,
        passengers,
      });
      navigate('/available-journeys');
    }
  };

  const canContinue = departure && destination && date && departure !== destination;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXMlMjB0cmFuc3BvcnQlMjB0cmF2ZWx8ZW58MXx8fHwxNzgwMjk5MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Bus transport"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-5xl mb-4">Book Your Journey</h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90">
              Travel safely and comfortably between Abuja and Ilorin
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-4xl mx-auto shadow-2xl">
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Departure */}
                <div className="space-y-2">
                  <Label htmlFor="departure" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Departure
                  </Label>
                  <Select value={departure} onValueChange={setDeparture}>
                    <SelectTrigger id="departure" className="h-12">
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Ilorin">Ilorin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destination
                  </Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination" className="h-12">
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Ilorin">Ilorin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Date of Travel
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal"
                      >
                        {date ? format(date, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <Label htmlFor="passengers" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Passengers
                  </Label>
                  <Select value={passengers.toString()} onValueChange={(val) => setPassengers(Number(val))}>
                    <SelectTrigger id="passengers" className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Adult' : 'Adults'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {departure && destination && departure === destination && (
                <p className="text-sm text-destructive mb-4">
                  Departure and destination cities must be different
                </p>
              )}

              <Button 
                onClick={handleContinue} 
                disabled={!canContinue}
                size="lg"
                className="w-full h-12 bg-primary hover:bg-primary/90"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Your safety is our priority. All buses are regularly maintained and inspected.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2">On-Time Service</h3>
              <p className="text-muted-foreground">
                We value your time. Our buses depart on schedule, getting you there when you need to be.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2">Trusted Service</h3>
              <p className="text-muted-foreground">
                Over 3 years of excellence connecting Abuja and Ilorin with reliable service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
