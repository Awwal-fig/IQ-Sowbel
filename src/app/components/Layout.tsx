import { Outlet, Link } from 'react-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBranding } from '../contexts/BrandingContext';
import { Button } from './ui/button';

export function Layout() {
  const { branding } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={branding.logoUrl}
                alt={branding.companyName}
                className="h-12 w-auto object-contain mix-blend-multiply"
                style={{ filter: 'brightness(1.1) contrast(1.1)' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 md:gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Book Journey
              </Link>
              <Link to="/manage-booking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Manage Booking
              </Link>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Journey
                </Link>
                <Link
                  to="/manage-booking"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage Booking
                </Link>
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  className="h-10 w-auto object-contain mix-blend-multiply"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted bus service connecting Abuja and Ilorin safely and comfortably since 2023.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Our Fleet</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Routes</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Safety</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: {branding.companyEmail}</li>
                <li>Phone: {branding.companyPhone}</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 {branding.companyName}. All rights reserved.</p>
            <div className="mt-2">
              <Link to="/admin/login" className="text-primary hover:underline text-xs">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
