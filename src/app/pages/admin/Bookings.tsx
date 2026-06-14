import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Filter, Eye, XCircle, Download } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useData } from '../../contexts/DataContext';

export function AdminBookings() {
  const { bookings, vehicles, cancelBooking } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Transform bookings for display
  const displayBookings = bookings.map((booking) => ({
    ...booking,
    route: `${booking.departure} → ${booking.destination}`,
    date: format(booking.travelDate, 'MMM d, yyyy'),
    seatsDisplay: booking.seats.map(s => {
      const vehicle = vehicles.find(v => v.id === s.vehicle);
      const vehicleLetter = vehicle?.name.split(' ')[1] || '';
      return `${s.seat} (${vehicleLetter})`;
    }),
    vehicleNames: [...new Set(booking.seats.map(s => {
      const vehicle = vehicles.find(v => v.id === s.vehicle);
      return vehicle?.name || s.vehicle;
    }))].join(', '),
  }));

  const filteredBookings = displayBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  const handleSendEmail = () => {
    if (!selectedBooking) return;

    try {
      // Collect all unique emails from passengers
      const allEmails = new Set<string>();
      allEmails.add(selectedBooking.email);

      // Add emails from additional passengers if they exist
      if (selectedBooking.passengersInfo && selectedBooking.passengersInfo.length > 1) {
        selectedBooking.passengersInfo.forEach((passenger: any) => {
          if (passenger.email && !passenger.sameEmailAsFirst) {
            allEmails.add(passenger.email);
          }
        });
      }

      const uniqueEmails = Array.from(allEmails);
      const emailSubject = `Booking Confirmation - ${selectedBooking.id}`;
      const emailBody = `
BOOKING CONFIRMED - IQ SOWBEL TRANSPORT

Booking Reference: ${selectedBooking.id}

JOURNEY DETAILS
================
Route: ${selectedBooking.route}
Travel Date: ${selectedBooking.date}
Departure Time: ${selectedBooking.departureTime}
Seat Numbers: ${selectedBooking.seatsDisplay?.join(', ')}
Vehicle: ${selectedBooking.vehicleNames}

PASSENGER INFORMATION
=====================
Name: ${selectedBooking.passenger}
Email: ${selectedBooking.email}
Phone: ${selectedBooking.phone}
Number of Passengers: ${selectedBooking.passengers}

BOARDING POINT
==============
${selectedBooking.pickupLocation}

PAYMENT DETAILS
===============
Total Amount Paid: ₦${selectedBooking.amount.toLocaleString()}

IMPORTANT INFORMATION
=====================
• Please arrive at your boarding point at least 15-30 minutes before departure
• Carry a valid ID card for verification
• Keep this booking reference handy for check-in
• Contact support at +234 800 123 4567 for assistance

Thank you for choosing IQ Sowbel!
Have a safe journey.

© 2026 IQ Sowbel Transport Ltd.
      `.trim();

      // Create mailto link with all unique emails
      const mailtoLink = `mailto:${uniqueEmails.join(',')}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.click();

        if (uniqueEmails.length > 1) {
          alert(`Email will be sent to ${uniqueEmails.length} recipients:\n${uniqueEmails.join('\n')}`);
        }
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Unable to open email client.');
    }
  };

  const handleExportReport = () => {
    // Prepare CSV data
    const headers = [
      'Booking ID',
      'Passenger Name',
      'Email',
      'Phone',
      'Departure',
      'Destination',
      'Travel Date',
      'Departure Time',
      'Vehicle(s)',
      'Seats',
      'Number of Passengers',
      'Pickup Option',
      'Pickup Location',
      'Amount (₦)',
      'Status',
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.passenger,
      booking.email,
      booking.phone,
      booking.departure,
      booking.destination,
      booking.date,
      booking.departureTime,
      booking.vehicleNames,
      booking.seatsDisplay.join('; '),
      booking.passengers,
      booking.pickupOption,
      booking.pickupLocation,
      booking.amount,
      booking.status,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Bookings Management</h1>
        <p className="text-muted-foreground">View and manage all passenger bookings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Bookings</div>
            <div className="text-2xl font-semibold">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Confirmed</div>
            <div className="text-2xl font-semibold text-green-600">{confirmedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Pending</div>
            <div className="text-2xl font-semibold text-yellow-600">{pendingBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-2xl font-semibold">₦{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by booking ID, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              All Bookings ({filteredBookings.length})
            </h2>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="gap-2"
              disabled={filteredBookings.length === 0}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No bookings found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Bookings will appear here once customers make reservations'}
              </p>
            </div>
          ) : (
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
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Seats
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                      <td className="py-3 px-4 font-mono text-sm">{booking.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{booking.passenger}</div>
                          <div className="text-xs text-muted-foreground">{booking.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{booking.route}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>{booking.date}</div>
                        <div className="text-xs text-muted-foreground">{booking.departureTime}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{booking.seatsDisplay.join(', ')}</td>
                      <td className="py-3 px-4 font-semibold">₦{booking.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={booking.status === 'cancelled'}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking {selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Passenger Name</div>
                  <div className="font-medium">{selectedBooking.passenger}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
                  <div className="font-mono">{selectedBooking.id}</div>
                </div>
                <div className={(() => {
                  const uniqueEmails = new Set<string>();
                  uniqueEmails.add(selectedBooking.email);
                  if (selectedBooking.passengersInfo && selectedBooking.passengersInfo.length > 1) {
                    selectedBooking.passengersInfo.forEach((p: any) => {
                      if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                    });
                  }
                  return uniqueEmails.size > 1 ? 'col-span-2' : '';
                })()}>
                  <div className="text-sm text-muted-foreground mb-1">
                    {(() => {
                      const uniqueEmails = new Set<string>();
                      uniqueEmails.add(selectedBooking.email);
                      if (selectedBooking.passengersInfo && selectedBooking.passengersInfo.length > 1) {
                        selectedBooking.passengersInfo.forEach((p: any) => {
                          if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                        });
                      }
                      return uniqueEmails.size > 1 ? 'Passenger Emails' : 'Email';
                    })()}
                  </div>
                  <div>
                    {(() => {
                      const uniqueEmails = new Set<string>();
                      uniqueEmails.add(selectedBooking.email);
                      if (selectedBooking.passengersInfo && selectedBooking.passengersInfo.length > 1) {
                        selectedBooking.passengersInfo.forEach((p: any) => {
                          if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                        });
                      }
                      const emails = Array.from(uniqueEmails);
                      return emails.length > 1 ? (
                        <div className="flex flex-wrap gap-2">
                          {emails.map((email, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-accent text-xs">
                              {email}
                            </span>
                          ))}
                        </div>
                      ) : selectedBooking.email;
                    })()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone</div>
                  <div>{selectedBooking.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Route</div>
                  <div>{selectedBooking.route}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Travel Date</div>
                  <div>{selectedBooking.date}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Departure Time</div>
                  <div>{selectedBooking.departureTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Vehicle</div>
                  <div>{selectedBooking.vehicleNames}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Seats</div>
                  <div>{selectedBooking.seatsDisplay?.join(', ')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Passengers</div>
                  <div>{selectedBooking.passengers}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pickup Location</div>
                  <div>{selectedBooking.pickupLocation}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="font-semibold text-lg">₦{selectedBooking.amount.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Print Ticket
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSendEmail}
                >
                  {(() => {
                    if (!selectedBooking) return 'Send Email';
                    const uniqueEmails = new Set<string>();
                    uniqueEmails.add(selectedBooking.email);
                    if (selectedBooking.passengersInfo && selectedBooking.passengersInfo.length > 1) {
                      selectedBooking.passengersInfo.forEach((p: any) => {
                        if (p.email && !p.sameEmailAsFirst) uniqueEmails.add(p.email);
                      });
                    }
                    return uniqueEmails.size > 1 ? `Send to All (${uniqueEmails.size})` : 'Send Email';
                  })()}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (selectedBooking) {
                      handleCancelBooking(selectedBooking.id);
                      setShowDetails(false);
                    }
                  }}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
