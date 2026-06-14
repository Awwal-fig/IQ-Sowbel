import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const mockPassengers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    totalBookings: 5,
    totalSpent: 150000,
    lastBooking: 'Jun 5, 2026',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    totalBookings: 3,
    totalSpent: 90000,
    lastBooking: 'Jun 6, 2026',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+234 803 456 7890',
    totalBookings: 8,
    totalSpent: 240000,
    lastBooking: 'Jun 7, 2026',
  },
];

export function AdminPassengers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Passengers</h1>
        <p className="text-muted-foreground">View and manage passenger information</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search passengers by name, email, or phone..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Passengers Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Passengers ({mockPassengers.length})</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Total Spent
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Last Booking
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPassengers.map((passenger) => (
                  <tr key={passenger.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">{passenger.name}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{passenger.email}</div>
                        <div className="text-muted-foreground">{passenger.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{passenger.totalBookings}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ₦{passenger.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">{passenger.lastBooking}</td>
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
