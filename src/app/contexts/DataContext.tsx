import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  capacity: number;
  status: 'active' | 'maintenance';
  bookedSeats: string[];
}

export interface Booking {
  id: string;
  passenger: string;
  email: string;
  phone: string;
  departure: string;
  destination: string;
  travelDate: Date;
  departureTime: string;
  seats: Array<{ seat: string; vehicle: string }>;
  passengers: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  pickupOption: 'station' | 'park';
  pickupLocation: string;
  passengersInfo?: any[];
}

interface DataContextType {
  vehicles: Vehicle[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getBookedSeatsForVehicle: (vehicleId: string, date: Date) => string[];
}

const initialVehicles: Vehicle[] = [
  {
    id: 'SIENNA-A',
    name: 'Sienna A',
    model: 'Toyota Sienna 2024',
    plateNumber: 'ABJ-123-XY',
    capacity: 7,
    status: 'active',
    bookedSeats: [],
  },
  {
    id: 'SIENNA-B',
    name: 'Sienna B',
    model: 'Toyota Sienna 2024',
    plateNumber: 'ABJ-456-ZQ',
    capacity: 7,
    status: 'active',
    bookedSeats: [],
  },
  {
    id: 'SIENNA-C',
    name: 'Sienna C',
    model: 'Toyota Sienna 2023',
    plateNumber: 'ILR-789-AB',
    capacity: 7,
    status: 'active',
    bookedSeats: [],
  },
];

const initialBookings: Booking[] = [];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const stored = localStorage.getItem('vehicles');
    return stored ? JSON.parse(stored) : initialVehicles;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((b: any) => ({
        ...b,
        travelDate: new Date(b.travelDate),
      }));
    }
    return initialBookings;
  });

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const cancelBooking = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const getBookedSeatsForVehicle = (vehicleId: string, date: Date): string[] => {
    const dateStr = date.toDateString();
    return bookings
      .filter(
        b =>
          b.status === 'confirmed' &&
          b.travelDate.toDateString() === dateStr
      )
      .flatMap(b => b.seats)
      .filter(s => s.vehicle === vehicleId)
      .map(s => s.seat);
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        bookings,
        addBooking,
        updateBooking,
        cancelBooking,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        getBookedSeatsForVehicle,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
