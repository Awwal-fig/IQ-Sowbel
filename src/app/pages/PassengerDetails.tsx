import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { useBooking } from '../contexts/BookingContext';

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  sameEmailAsFirst?: boolean;
}

export function PassengerDetails() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();

  const numberOfPassengers = bookingData.passengers;
  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    Array.from({ length: numberOfPassengers }, (_, i) => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      sameEmailAsFirst: false,
    }))
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (!bookingData.pickupOption) {
      navigate('/');
    }
  }, [bookingData.pickupOption, navigate]);

  if (!bookingData.pickupOption) {
    return null;
  }

  const seatDisplay = bookingData.selectedSeats
    ? bookingData.selectedSeats.map(s => `${s.seat} (${s.vehicle.replace('SIENNA-', '')})`).join(', ')
    : '';

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string | boolean) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };

    // If "same as above" is checked for email, copy from first passenger
    if (field === 'sameEmailAsFirst' && value === true && index > 0) {
      newPassengers[index].email = newPassengers[0].email;
    }

    setPassengers(newPassengers);

    // Clear error for this field
    if (errors[index]?.[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[index][field as string];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};

    passengers.forEach((passenger, index) => {
      const passengerErrors: Record<string, string> = {};

      if (!passenger.firstName.trim()) passengerErrors.firstName = 'First name is required';
      if (!passenger.lastName.trim()) passengerErrors.lastName = 'Last name is required';

      if (!passenger.sameEmailAsFirst || index === 0) {
        if (!passenger.email.trim()) {
          passengerErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
          passengerErrors.email = 'Please enter a valid email';
        }
      }

      if (!passenger.phone.trim()) {
        passengerErrors.phone = 'Phone number is required';
      } else if (!/^[\d\s+()-]{10,}$/.test(passenger.phone)) {
        passengerErrors.phone = 'Please enter a valid phone number';
      }

      if (!passenger.gender) passengerErrors.gender = 'Please select a gender';

      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Store first passenger details in main booking data for backward compatibility
      updateBookingData({
        firstName: passengers[0].firstName,
        lastName: passengers[0].lastName,
        email: passengers[0].email,
        phone: passengers[0].phone,
        gender: passengers[0].gender,
        passengersInfo: passengers,
      });
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-6 md:py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/pickup-option')}
          className="mb-4 md:mb-6"
        >
          ← Back to Pickup Option
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Passenger Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {passengers.map((passenger, index) => (
              <Card key={index}>
                <CardContent className="p-4 md:p-6">
                  <h2 className="mb-4 md:mb-6">
                    Passenger {index + 1} Information
                    {bookingData.selectedSeats?.[index] && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        (Seat: {bookingData.selectedSeats[index].seat})
                      </span>
                    )}
                  </h2>

                  <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${index}`}>
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`firstName-${index}`}
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                          placeholder="Enter first name"
                          className={errors[index]?.firstName ? 'border-destructive' : ''}
                        />
                        {errors[index]?.firstName && (
                          <p className="text-sm text-destructive">{errors[index].firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${index}`}>
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`lastName-${index}`}
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                          placeholder="Enter last name"
                          className={errors[index]?.lastName ? 'border-destructive' : ''}
                        />
                        {errors[index]?.lastName && (
                          <p className="text-sm text-destructive">{errors[index].lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={passenger.email}
                        onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                        placeholder="example@email.com"
                        disabled={index > 0 && passenger.sameEmailAsFirst}
                        className={errors[index]?.email ? 'border-destructive' : ''}
                      />
                      {errors[index]?.email && (
                        <p className="text-sm text-destructive">{errors[index].email}</p>
                      )}
                      {index === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Tickets will be sent to this email address
                        </p>
                      ) : (
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id={`sameEmail-${index}`}
                            checked={passenger.sameEmailAsFirst}
                            onCheckedChange={(checked) =>
                              updatePassenger(index, 'sameEmailAsFirst', checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`sameEmail-${index}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            Same as above
                          </Label>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`phone-${index}`}
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                        placeholder="+234 800 000 0000"
                        className={errors[index]?.phone ? 'border-destructive' : ''}
                      />
                      {errors[index]?.phone && (
                        <p className="text-sm text-destructive">{errors[index].phone}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <Label>
                        Gender <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={passenger.gender}
                        onValueChange={(value) => updatePassenger(index, 'gender', value)}
                      >
                        <div className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id={`male-${index}`} />
                            <Label htmlFor={`male-${index}`} className="cursor-pointer font-normal">
                              Male
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id={`female-${index}`} />
                            <Label htmlFor={`female-${index}`} className="cursor-pointer font-normal">
                              Female
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {errors[index]?.gender && (
                        <p className="text-sm text-destructive">{errors[index].gender}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Journey Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-4 md:p-6">
                <h3 className="mb-4 text-lg md:text-xl">Journey Summary</h3>

                <div className="space-y-3 md:space-y-4 mb-6">
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Route</div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 md:h-4 w-3 md:w-4 text-primary shrink-0" />
                      <span>
                        {bookingData.departure} <ArrowRight className="inline h-3 w-3 mx-1" />{' '}
                        {bookingData.destination}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Date</div>
                    <div className="text-sm">
                      {bookingData.travelDate && format(bookingData.travelDate, 'MMM d, yyyy')}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Departure</div>
                    <div className="text-sm">{bookingData.selectedBus?.departureTime}</div>
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Seats</div>
                    <div className="text-sm font-semibold text-primary">{seatDisplay}</div>
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Boarding Point</div>
                    <div className="text-sm">{bookingData.pickupLocation}</div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center text-base md:text-lg">
                    <span>Total</span>
                    <span className="font-semibold">
                      ₦{((bookingData.selectedBus?.price || 0) * bookingData.passengers).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button onClick={handleContinue} className="w-full" size="lg">
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
