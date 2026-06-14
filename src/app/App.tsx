import { RouterProvider } from 'react-router';
import { BookingProvider } from './contexts/BookingContext';
import { BrandingProvider } from './contexts/BrandingContext';
import { DataProvider } from './contexts/DataContext';
import { router } from './routes';
import '../styles/animations.css';
import '../styles/print.css';

export default function App() {
  return (
    <BrandingProvider>
      <DataProvider>
        <BookingProvider>
          <RouterProvider router={router} />
        </BookingProvider>
      </DataProvider>
    </BrandingProvider>
  );
}
