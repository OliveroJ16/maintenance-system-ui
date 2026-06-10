export interface Driver {
  idDriver?: number;
  firstName: string;
  lastName: string;
  idCard: string;
  phone: string;
  email: string;
  licenseCategory: string;
  licenseExpirationDate: string;
  status: 'ACTIVO' | 'INACTIVO';
}