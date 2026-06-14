import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, MapPin, Building2, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useBooking } from '../contexts/BookingContext';
import { useBranding } from '../contexts/BrandingContext';

const PICKUP_LOCATIONS = [
  'Berger Junction, Abuja',
  'Kubwa Express, Abuja',
  'Nyanya Motor Park, Abuja',
  'Wuse Market, Abuja',
];

export function PickupOption() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  const { branding } = useBranding();

  const [pickupOption, setPickupOption] = useState<'station' | 'park'>(
    bookingData.pickupOption || 'station'
  );
  const [pickupLocation, setPickupLocation] = useState(bookingData.pickupLocation || '');

  useEffect(() => {
    if (!bookingData.selectedSeats || bookingData.selectedSeats.length === 0) {
      navigate('/');
    }
  }, [bookingData.selectedSeats, navigate]);

  if (!bookingData.selectedSeats || bookingData.selectedSeats.length === 0) {
    return null;
  }

  const seatDisplay = bookingData.selectedSeats
    .map(s => `${s.seat} (${s.vehicle.replace('SIENNA-', '')})`)
    .join(', ');

  const handleContinue = () => {
    const canProceed = pickupOption === 'park' || (pickupOption === 'station' && pickupLocation);
    
    if (canProceed) {
      updateBookingData({
        pickupOption,
        pickupLocation: pickupOption === 'station' ? pickupLocation : branding.parkName,
      });
      navigate('/passenger-details');
    }
  };

  const canContinue = pickupOption === 'park' || (pickupOption === 'station' && pickupLocation);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/seat-selection')}
          className="mb-6"
        >
          ← Back to Seat Selection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pickup Options */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Choose Boarding Option</h2>

                <RadioGroup value={pickupOption} onValueChange={(value: 'station' | 'park') => setPickupOption(value)}>
                  <div className="space-y-4">
                    {/* Pickup Station */}
                    <div
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        pickupOption === 'station'
                          ? 'border-primary bg-accent/50'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setPickupOption('station')}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="station" id="station" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="station" className="cursor-pointer flex items-center gap-2 mb-2">
                            <Home className="h-5 w-5 text-primary" />
                            <span className="text-lg">Pickup Station</span>
                          </Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            We'll pick you up from a convenient location near you
                          </p>

                          {pickupOption === 'station' && (
                            <div className="space-y-2">
                              <Label htmlFor="pickup-location">Select Pickup Location</Label>
                              <Select value={pickupLocation} onValueChange={setPickupLocation}>
                                <SelectTrigger id="pickup-location">
                                  <SelectValue placeholder="Choose a pickup point" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PICKUP_LOCATIONS.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-2">
                                Please arrive 15 minutes before departure time
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Join at Park */}
                    <div
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        pickupOption === 'park'
                          ? 'border-primary bg-accent/50'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setPickupOption('park')}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value="park" id="park" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="park" className="cursor-pointer flex items-center gap-2 mb-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span className="text-lg">Join at Park</span>
                          </Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Board directly from our main terminal
                          </p>

                          {pickupOption === 'park' && (
                            <div className="bg-white border border-border rounded-lg p-4 space-y-3">
                              <div>
                                <div className="text-sm font-medium mb-1">Terminal Name</div>
                                <div className="text-sm">{branding.parkName}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">Address</div>
                                <div className="text-sm text-muted-foreground">{branding.parkAddress}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">Landmark</div>
                                <div className="text-sm text-muted-foreground">{branding.parkLandmarks}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">Terminal Opens</div>
                                <div className="text-sm text-muted-foreground">{branding.parkOpeningTime}</div>
                              </div>
                              <p className="text-xs text-muted-foreground border-t border-border pt-3">
                                Please arrive at least 30 minutes before departure time
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

          {/* Journey Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4">Journey Summary</h3>

                <div className="space-y-4 mb-6">
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
                    <div className="text-sm text-muted-foreground mb-1">Departure</div>
                    <div className="text-sm">{bookingData.selectedBus?.departureTime}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Seats</div>
                    <div className="text-sm font-semibold text-primary">
                      {seatDisplay}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg">
                    <span>Total</span>
                    <span className="font-semibold">₦{((bookingData.selectedBus?.price || 0) * bookingData.passengers).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="w-full"
                  size="lg"
                >
                  Next Step
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
