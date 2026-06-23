// types/user.ts
export interface User {
  idUser?: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'ADMINISTRADOR' | 'SUPERVISOR';
  email: string;
  driver?: {
    idDriver: number;
    firstName: string;
    lastName: string;
    idCard: string;
  } | null;
  registrationDate?: string;
}