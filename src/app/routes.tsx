import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { SearchJourney } from './pages/SearchJourney';
import { AvailableJourneys } from './pages/AvailableJourneys';
import { SeatSelection } from './pages/SeatSelection';
import { PickupOption } from './pages/PickupOption';
import { PassengerDetails } from './pages/PassengerDetails';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { ManageBooking } from './pages/ManageBooking';
import { NotFound } from './pages/NotFound';

// Admin imports
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminBookings } from './pages/admin/Bookings';
import { AdminVehicles } from './pages/admin/Vehicles';
import { AdminPassengers } from './pages/admin/Passengers';
import { AdminSettings } from './pages/admin/Settings';
import { NotFoundAdmin } from './pages/admin/NotFoundAdmin';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: SearchJourney },
      { path: 'available-journeys', Component: AvailableJourneys },
      { path: 'seat-selection', Component: SeatSelection },
      { path: 'pickup-option', Component: PickupOption },
      { path: 'passenger-details', Component: PassengerDetails },
      { path: 'payment', Component: Payment },
      { path: 'confirmation', Component: Confirmation },
      { path: 'manage-booking', Component: ManageBooking },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', Component: AdminDashboard },
      { path: 'bookings', Component: AdminBookings },
      { path: 'vehicles', Component: AdminVehicles },
      { path: 'passengers', Component: AdminPassengers },
      { path: 'settings', Component: AdminSettings },
      { path: '*', Component: NotFoundAdmin },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
