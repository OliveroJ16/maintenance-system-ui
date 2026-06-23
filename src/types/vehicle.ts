export interface Vehicle {
  idVehicle?: number;
  plate: string;
  serialNumber: string;
  mileage: number;
  acquisitionDate: string;
  status: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';
  fuelType: 'GASOLINA' | 'DIESEL' | 'ELECTRICO' | 'HIBRIDO' | 'OTRO';
  brand: string;
  model: string;
  vehicleType: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'VAN' | 'CAMION' | 'OTRO';
  assignedDriverName?: string;
}