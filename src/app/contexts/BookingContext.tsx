import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BookingData {
  // Step 1: Search Journey
  departure: string;
  destination: string;
  travelDate: Date | undefined;
  passengers: number;

  // Step 2: Available Journeys
  selectedBus?: {
    departureTime: string;
    busType: string;
    duration: string;
    price: number;
  };

  // Step 3: Seat Selection
  selectedSeats?: Array<{ seat: string; vehicle: string }>;

  // Step 4: Pickup Option
  pickupOption?: 'station' | 'park';
  pickupLocation?: string;

  // Step 5: Passenger Details
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  passengersInfo?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    sameEmailAsFirst?: boolean;
  }>;

  // Confirmation
  bookingNumber?: string;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookingData: BookingData = {
  departure: '',
  destination: '',
  travelDate: undefined,
  passengers: 1,
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
