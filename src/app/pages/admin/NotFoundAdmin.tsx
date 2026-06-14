import { Link } from 'react-router';
import { Home, Settings, Calendar, Bus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export function NotFoundAdmin() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          {/* Large 404 */}
          <h1 className="text-[100px] md:text-[140px] font-bold text-primary/10 leading-none mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The admin page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/admin/dashboard">
            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Dashboard</h3>
                    <p className="text-xs text-muted-foreground">Go to dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/bookings">
            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Bookings</h3>
                    <p className="text-xs text-muted-foreground">Manage bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/vehicles">
            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Vehicles</h3>
                    <p className="text-xs text-muted-foreground">Manage fleet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/settings">
            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Settings</h3>
                    <p className="text-xs text-muted-foreground">Configure app</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Link to="/admin/dashboard">
          <Button size="lg" className="px-8">
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
