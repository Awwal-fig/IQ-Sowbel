import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { useData } from '../../contexts/DataContext';
import type { Vehicle } from '../../contexts/DataContext';

export function AdminVehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [vehicleName, setVehicleName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState<'active' | 'maintenance'>('active');

  const handleAddVehicle = () => {
    if (!vehicleName || !vehicleModel || !plateNumber) {
      alert('Please fill in all fields');
      return;
    }

    const newVehicle: Vehicle = {
      id: `SIENNA-${Date.now().toString().slice(-6)}`,
      name: vehicleName,
      model: vehicleModel,
      plateNumber: plateNumber,
      capacity: 7,
      status: vehicleStatus,
      bookedSeats: [],
    };

    addVehicle(newVehicle);
    setShowAddDialog(false);
    setVehicleName('');
    setVehicleModel('');
    setPlateNumber('');
    setVehicleStatus('active');
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleName(vehicle.name);
    setVehicleModel(vehicle.model);
    setPlateNumber(vehicle.plateNumber);
    setVehicleStatus(vehicle.status);
    setShowEditDialog(true);
  };

  const handleUpdateVehicle = () => {
    if (!editingVehicle || !vehicleName || !vehicleModel || !plateNumber) {
      alert('Please fill in all fields');
      return;
    }

    updateVehicle(editingVehicle.id, {
      name: vehicleName,
      model: vehicleModel,
      plateNumber: plateNumber,
      status: vehicleStatus,
    });

    setShowEditDialog(false);
    setEditingVehicle(null);
    setVehicleName('');
    setVehicleModel('');
    setPlateNumber('');
    setVehicleStatus('active');
  };

  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    if (confirm(`Are you sure you want to delete ${vehicleName}? This cannot be undone.`)) {
      deleteVehicle(vehicleId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Vehicles Management</h1>
          <p className="text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Enter the details of the new vehicle
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleName">Vehicle Name</Label>
                <Input
                  id="vehicleName"
                  placeholder="e.g., Sienna D"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  placeholder="e.g., Toyota Sienna 2024"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input
                  id="plateNumber"
                  placeholder="e.g., ABJ-123-XY"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleStatus">Status</Label>
                <Select value={vehicleStatus} onValueChange={(value: 'active' | 'maintenance') => setVehicleStatus(value)}>
                  <SelectTrigger id="vehicleStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddVehicle} className="w-full">
                Add Vehicle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the vehicle details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editVehicleName">Vehicle Name</Label>
              <Input
                id="editVehicleName"
                placeholder="e.g., Sienna D"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editVehicleModel">Model</Label>
              <Input
                id="editVehicleModel"
                placeholder="e.g., Toyota Sienna 2024"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPlateNumber">Plate Number</Label>
              <Input
                id="editPlateNumber"
                placeholder="e.g., ABJ-123-XY"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editVehicleStatus">Status</Label>
              <Select value={vehicleStatus} onValueChange={(value: 'active' | 'maintenance') => setVehicleStatus(value)}>
                <SelectTrigger id="editVehicleStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateVehicle} className="w-full">
              Update Vehicle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                </div>
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plate Number</span>
                  <span className="font-medium">{vehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{vehicle.capacity} seats</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle ID</span>
                  <span className="font-mono text-xs">{vehicle.id}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEditClick(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive gap-2"
                  onClick={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
