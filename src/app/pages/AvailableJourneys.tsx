import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBooking } from '../contexts/BookingContext';
import { useBranding } from '../contexts/BrandingContext';

export function AvailableJourneys() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  const { branding } = useBranding();

  useEffect(() => {
    if (!bookingData.departure || !bookingData.destination || !bookingData.travelDate) {
      navigate('/');
    }
  }, [bookingData.departure, bookingData.destination, bookingData.travelDate, navigate]);

  const handleSelectSeats = () => {
    updateBookingData({
      selectedBus: {
        departureTime: '6:00 AM',
        busType: `${branding.companyName} Executive`,
        duration: 'Approximately 5 Hours',
        price: branding.basePrice,
      },
    });
    navigate('/seat-selection');
  };

  if (!bookingData.departure || !bookingData.destination || !bookingData.travelDate) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-6 md:py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Search
          </Button>

          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div className="flex items-start md:items-center gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1 md:mt-0" />
                <div>
                  <h2 className="text-xl md:text-2xl">
                    {bookingData.departure} <ArrowRight className="inline h-4 md:h-5 w-4 md:w-5 mx-2" /> {bookingData.destination}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {format(bookingData.travelDate, 'EEEE, MMMM d, yyyy')} · {bookingData.passengers} {bookingData.passengers === 1 ? 'Passenger' : 'Passengers'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Journey Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-xl md:text-2xl font-medium mb-2">
                      Select Your Seats
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Choose from available vehicles
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl md:text-4xl font-semibold mb-1">
                        ₦{branding.basePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                    <Button
                      onClick={handleSelectSeats}
                      size="lg"
                      className="gap-2"
                    >
                      Choose Seats
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
