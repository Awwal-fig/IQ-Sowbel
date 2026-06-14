import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBooking } from '../contexts/BookingContext';
import { useData } from '../contexts/DataContext';
import { cn } from '../components/ui/utils';

// Toyota Sienna 7-seater layout (6 passenger seats + driver)
const SEATS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];

export function SeatSelection() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  const { vehicles, getBookedSeatsForVehicle } = useData();
  const [selectedSeats, setSelectedSeats] = useState<Array<{ seat: string; vehicle: string }>>(
    bookingData.selectedSeats || []
  );
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);

  // Filter only active vehicles
  const activeVehicles = vehicles.filter(v => v.status === 'active');

  useEffect(() => {
    if (!bookingData.selectedBus || activeVehicles.length === 0) {
      navigate('/');
    }
  }, [bookingData.selectedBus, activeVehicles.length, navigate]);

  if (!bookingData.selectedBus || activeVehicles.length === 0) {
    return null;
  }

  const currentVehicle = activeVehicles[currentVehicleIndex];
  const requiredSeats = bookingData.passengers;

  // Get booked seats for this vehicle on the selected date
  const bookedSeats = bookingData.travelDate
    ? getBookedSeatsForVehicle(currentVehicle.id, bookingData.travelDate)
    : [];

  const handleContinue = () => {
    if (selectedSeats.length === requiredSeats) {
      updateBookingData({
        selectedSeats,
      });
      navigate('/pickup-option');
    }
  };

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    const isSelectedInCurrentVehicle = selectedSeats.some(
      s => s.seat === seat && s.vehicle === currentVehicle.id
    );

    if (isSelectedInCurrentVehicle) {
      setSelectedSeats(selectedSeats.filter(s => !(s.seat === seat && s.vehicle === currentVehicle.id)));
    } else {
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats([...selectedSeats, { seat, vehicle: currentVehicle.id }]);
      }
    }
  };

  const getSeatStatus = (seat: string) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.some(s => s.seat === seat && s.vehicle === currentVehicle.id)) return 'selected';
    return 'available';
  };

  const handlePrevious = () => {
    setCurrentVehicleIndex((prev) => (prev > 0 ? prev - 1 : activeVehicles.length - 1));
  };

  const handleNext = () => {
    setCurrentVehicleIndex((prev) => (prev < activeVehicles.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-6 md:py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/available-journeys')}
          className="mb-4 md:mb-6"
        >
          ← Back to Available Journeys
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 md:p-6">
                {/* Vehicle Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePrevious}
                    className="rounded-full px-6"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="text-xl md:text-2xl font-semibold">
                    {currentVehicle.name}
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleNext}
                    className="rounded-full px-6"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Info Message */}
                <div className="flex items-start gap-3 mb-6 p-3 bg-accent/50 rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    You can select more than a seat if you're booking for more than a person
                  </p>
                </div>

                {/* Car Visualization */}
                <div className="relative max-w-md mx-auto">
                  {/* Car Outline */}
                  <div className="relative bg-gradient-to-b from-muted/30 via-background to-muted/30 border-4 border-border rounded-[120px] p-6 md:p-10 shadow-xl">
                    {/* Side Mirrors */}
                    <div className="absolute -left-4 top-28 w-8 h-20 bg-gradient-to-r from-muted to-muted-foreground/20 rounded-l-3xl shadow-md border-2 border-border"></div>
                    <div className="absolute -right-4 top-28 w-8 h-20 bg-gradient-to-l from-muted to-muted-foreground/20 rounded-r-3xl shadow-md border-2 border-border"></div>

                    {/* Windshield */}
                    <div className="w-full h-24 bg-gradient-to-b from-primary/10 to-primary/5 rounded-t-[100px] mb-4 border-2 border-border/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-border/50 rounded-full"></div>
                    </div>

                    {/* Driver Area */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Driver Seat with Steering Wheel */}
                      <div className="bg-gradient-to-br from-muted to-muted/70 border-2 border-border rounded-3xl h-20 flex items-center justify-center relative shadow-inner">
                        {/* Steering Wheel */}
                        <div className="relative">
                          <svg className="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" strokeWidth="2.5"></circle>
                            <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
                            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeWidth="2"></path>
                          </svg>
                          <div className="absolute inset-0 bg-primary/5 rounded-full blur-sm"></div>
                        </div>
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 font-medium">DRIVER</div>
                      </div>
                      {/* A1 - Front Passenger */}
                      <SeatButton
                        seat="A1"
                        status={getSeatStatus('A1')}
                        onClick={() => handleSeatClick('A1')}
                      />
                    </div>

                    {/* Door Lines */}
                    <div className="absolute left-0 top-36 w-1 h-32 bg-border/30 rounded-full"></div>
                    <div className="absolute right-0 top-36 w-1 h-32 bg-border/30 rounded-full"></div>

                    {/* Middle Row - Captain Seats */}
                    <div className="grid grid-cols-3 gap-3 mb-6 px-2">
                      <SeatButton
                        seat="A2"
                        status={getSeatStatus('A2')}
                        onClick={() => handleSeatClick('A2')}
                      />
                      <SeatButton
                        seat="A3"
                        status={getSeatStatus('A3')}
                        onClick={() => handleSeatClick('A3')}
                      />
                      <SeatButton
                        seat="A4"
                        status={getSeatStatus('A4')}
                        onClick={() => handleSeatClick('A4')}
                      />
                    </div>

                    {/* Back Row - Bench */}
                    <div className="grid grid-cols-3 gap-3 px-2">
                      <SeatButton
                        seat="A5"
                        status={getSeatStatus('A5')}
                        onClick={() => handleSeatClick('A5')}
                      />
                      <SeatButton
                        seat="A6"
                        status={getSeatStatus('A6')}
                        onClick={() => handleSeatClick('A6')}
                      />
                      <SeatButton
                        seat="A7"
                        status={getSeatStatus('A7')}
                        onClick={() => handleSeatClick('A7')}
                      />
                    </div>

                    {/* Back of Car */}
                    <div className="w-full h-24 bg-gradient-to-t from-primary/10 to-primary/5 rounded-b-[100px] mt-4 border-2 border-border/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tl from-white/20 to-transparent"></div>
                      {/* Tail lights */}
                      <div className="absolute bottom-4 left-8 w-12 h-3 bg-destructive/40 rounded-full"></div>
                      <div className="absolute bottom-4 right-8 w-12 h-3 bg-destructive/40 rounded-full"></div>
                    </div>

                    {/* Subtle car body shine */}
                    <div className="absolute inset-0 rounded-[116px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3 mt-8 bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-full bg-[#e8725c] shadow-md relative">
                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[80%] h-2 rounded-full bg-[#c55a45]"></div>
                      </div>
                      <span className="text-sm font-medium">Unbooked Seat</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-full bg-[#e8725c]/40 relative">
                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[80%] h-2 rounded-full bg-[#c55a45]/40"></div>
                      </div>
                      <span className="text-sm font-medium">Booked Seat</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-full bg-gradient-to-br from-muted to-muted/70 border-2 border-border shadow-inner"></div>
                      <span className="text-sm font-medium">Driver Seat</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-4 md:p-6">
                <h3 className="mb-4 text-lg md:text-xl">Journey Summary</h3>

                <div className="space-y-3 md:space-y-4 mb-6">
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Route</div>
                    <div className="flex items-center gap-2 text-sm md:text-base">
                      <MapPin className="h-3 md:h-4 w-3 md:w-4 text-primary shrink-0" />
                      <span>
                        {bookingData.departure} <ArrowRight className="inline h-3 w-3 mx-1" />{' '}
                        {bookingData.destination}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Date</div>
                    <div className="text-sm md:text-base">
                      {bookingData.travelDate && format(bookingData.travelDate, 'EEE, MMM d, yyyy')}
                    </div>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground mb-2">
                        Selected Seats ({selectedSeats.length}/{requiredSeats})
                      </div>
                      <div className="space-y-2">
                        {activeVehicles.map(vehicle => {
                          const seatsInVehicle = selectedSeats.filter(s => s.vehicle === vehicle.id);
                          if (seatsInVehicle.length === 0) return null;
                          return (
                            <div key={vehicle.id} className="bg-accent/50 rounded-md p-2">
                              <div className="text-xs text-muted-foreground mb-1">{vehicle.name}</div>
                              <div className="flex flex-wrap gap-1.5">
                                {seatsInVehicle.map(({ seat }) => (
                                  <div
                                    key={seat}
                                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium"
                                  >
                                    {seat}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-muted-foreground">Price per person</span>
                    <span>₦{bookingData.selectedBus.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-muted-foreground">Passengers</span>
                    <span>{bookingData.passengers}</span>
                  </div>
                  <div className="flex justify-between items-center text-base md:text-lg border-t border-border pt-2 mt-2">
                    <span>Total</span>
                    <span className="font-semibold">
                      ₦{(bookingData.selectedBus.price * bookingData.passengers).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={selectedSeats.length !== requiredSeats}
                  className="w-full"
                  size="lg"
                >
                  Continue
                  {selectedSeats.length < requiredSeats && (
                    <span className="ml-2 text-xs opacity-80">
                      ({requiredSeats - selectedSeats.length} more)
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeatButton({ seat, status, onClick }: { seat: string; status: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={status === 'booked'}
      className={cn(
        'relative h-16 md:h-20 rounded-full transition-all flex flex-col items-center justify-center font-semibold text-white',
        status === 'available' && 'bg-[#e8725c] hover:bg-[#e8725c]/90 shadow-md',
        status === 'selected' && 'bg-[#3b4a8c] shadow-lg ring-2 ring-[#3b4a8c] ring-offset-2',
        status === 'booked' && 'bg-[#e8725c]/40 cursor-not-allowed'
      )}
    >
      <span className="text-sm md:text-base">{seat}</span>
      <div className={cn(
        'absolute -bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-2 rounded-full',
        status === 'available' && 'bg-[#c55a45]',
        status === 'selected' && 'bg-[#2a3768]',
        status === 'booked' && 'bg-[#c55a45]/40'
      )}></div>
    </button>
  );
}
