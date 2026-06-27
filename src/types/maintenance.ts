export interface Maintenance {
  idMaintenance?: number;
  scheduledDate: string;
  scheduledKm: number;
  executionDate?: string;
  executionKm?: number;
  status: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  description?: string;
  vehicle?: Vehicle;
  maintenanceType?: MaintenanceType;
  workshop?: Workshop;
}

export interface MaintenanceType {
  idMaintenanceType?: number;
  typeName: string;
  description?: string;
  category: 'PREVENTIVO' | 'CORRECTIVO';
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface MaintenanceConfiguration {
  idMaintenanceConfig?: number;
  frequencyKm?: number;
  frequencyMonths?: number;
  description?: string;
  maintenanceType?: MaintenanceType;
  vehicle?: Vehicle;
}

export interface Vehicle {
  idVehicle?: number;
  plate: string;
  brand: string;
  model: string;
  vehicleType?: string;
}

export interface Workshop {
  idWorkshop?: number;
  workshopName: string;
}