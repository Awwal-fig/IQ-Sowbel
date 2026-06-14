import { useState } from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, Users, Bus, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Info, X, Settings, Palette, Car } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useBranding } from '../../contexts/BrandingContext';

export function AdminDashboard() {
  const { bookings, vehicles } = useData();
  const { branding } = useBranding();
  const [showWelcome, setShowWelcome] = useState(() => {
    const dismissed = localStorage.getItem('welcomeBannerDismissed');
    return !dismissed && bookings.length === 0;
  });

  const handleDismissWelcome = () => {
    localStorage.setItem('welcomeBannerDismissed', 'true');
    setShowWelcome(false);
  };

  // Calculate real stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.amount, 0);
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const totalPassengers = bookings.reduce((sum, b) => sum + b.passengers, 0);

  const stats = [
    {
      name: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
    },
    {
      name: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      name: 'Active Vehicles',
      value: activeVehicles.toString(),
      icon: Bus,
    },
    {
      name: 'Total Passengers',
      value: totalPassengers.toString(),
      icon: Users,
    },
  ];

  // Get recent bookings
  const recentBookings = bookings
    .slice()
    .sort((a, b) => b.travelDate.getTime() - a.travelDate.getTime())
    .slice(0, 5)
    .map(booking => ({
      id: booking.id,
      passenger: booking.passenger,
      route: `${booking.departure} → ${booking.destination}`,
      date: format(booking.travelDate, 'MMM d, yyyy'),
      amount: `₦${booking.amount.toLocaleString()}`,
      status: booking.status,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your bus booking operations
        </p>
      </div>

      {/* Welcome Banner for New Users */}
      {showWelcome && (
        <Alert className="bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Welcome to your Admin Portal! 🎉</h3>
              <AlertDescription>
                <p className="mb-3">Get started by setting up your bus booking system:</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <Palette className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <Link to="/admin/settings" className="font-medium text-primary hover:underline">
                        Customize your branding
                      </Link>
                      <span className="text-muted-foreground"> - Upload logo, set colors, configure company info</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Car className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <Link to="/admin/vehicles" className="font-medium text-primary hover:underline">
                        Add your vehicles
                      </Link>
                      <span className="text-muted-foreground"> - Set up your fleet to start accepting bookings</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Settings className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <Link to="/admin/settings" className="font-medium text-primary hover:underline">
                        Configure terminal address
                      </Link>
                      <span className="text-muted-foreground"> - Update park/terminal details for passengers</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  📖 See <code className="bg-background px-1.5 py-0.5 rounded">SETUP_GUIDE.md</code> for complete instructions
                </p>
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismissWelcome}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                {stat.trend !== 'neutral' && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-destructive'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Passenger
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Route
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-mono text-sm">{booking.id}</td>
                    <td className="py-3 px-4">{booking.passenger}</td>
                    <td className="py-3 px-4 text-sm">{booking.route}</td>
                    <td className="py-3 px-4 text-sm">{booking.date}</td>
                    <td className="py-3 px-4 font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
