// types/workshop.ts

export interface Workshop {
  idWorkshop?: number;
  workshopName: string;
  address: string;
  phone: string;
  email: string;
  specialty: string;
  status: 'ACTIVO' | 'INACTIVO';
}

export interface Service {
  idService?: number; 
  serviceName: string;
  description: string;
  cost: number;
  durationMinutes: number | null;
  status: 'ACTIVO' | 'INACTIVO';
  workshop: {
    idWorkshop: number;
    workshopName: string;
  };
}

export interface ServiceFormData {
  serviceName: string;
  description: string;
  cost: string;
  durationMinutes: string;
  status: 'ACTIVO' | 'INACTIVO';
}