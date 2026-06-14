import { Link } from 'react-router';
import { Home, Search, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBranding } from '../contexts/BrandingContext';

export function NotFound() {
  const { branding } = useBranding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-muted/30 flex items-center justify-center p-4">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          {/* Animated 404 */}
          <div className="mb-8 relative">
            <div className="relative inline-block">
              {/* Large 404 */}
              <h1 className="text-[120px] md:text-[180px] font-bold text-primary/10 leading-none select-none">
                404
              </h1>

              {/* Bus Icon in the middle zero */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Bus illustration */}
                  <svg
                    className="w-24 h-24 md:w-32 md:h-32 text-primary animate-float"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Bus body */}
                    <rect x="20" y="30" width="60" height="40" rx="8" fill="currentColor" opacity="0.9" />

                    {/* Windows */}
                    <rect x="25" y="35" width="20" height="15" rx="2" fill="white" opacity="0.3" />
                    <rect x="55" y="35" width="20" height="15" rx="2" fill="white" opacity="0.3" />

                    {/* Wheels */}
                    <circle cx="32" cy="70" r="8" fill="#333" />
                    <circle cx="32" cy="70" r="4" fill="#666" />
                    <circle cx="68" cy="70" r="8" fill="#333" />
                    <circle cx="68" cy="70" r="4" fill="#666" />

                    {/* Front bumper */}
                    <rect x="15" y="45" width="5" height="15" rx="2" fill="currentColor" />

                    {/* Headlights */}
                    <circle cx="17" cy="52" r="2" fill="#FFD700" opacity="0.8" />
                  </svg>

                  {/* Question marks floating around */}
                  <div className="absolute -top-4 -right-4 text-4xl text-primary/30 animate-pulse">?</div>
                  <div className="absolute -bottom-2 -left-6 text-3xl text-primary/20 animate-pulse delay-150">?</div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">
              Oops! This Route Doesn't Exist
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Looks like this journey has taken a wrong turn. The page you're looking for can't be found.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <Link to="/" className="block">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold mb-1">Book a Journey</h3>
                      <p className="text-sm text-muted-foreground">Search and book your trip</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/manage-booking" className="block">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold mb-1">Manage Booking</h3>
                      <p className="text-sm text-muted-foreground">View or change your trip</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button size="lg" className="gap-2 px-8">
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
            </Link>

            <a href={`tel:${branding.companyPhone}`}>
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <Phone className="h-5 w-5" />
                Contact Support
              </Button>
            </a>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-border max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error or need assistance, please contact our support team at{' '}
              <a href={`mailto:${branding.companyEmail}`} className="text-primary hover:underline">
                {branding.companyEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
