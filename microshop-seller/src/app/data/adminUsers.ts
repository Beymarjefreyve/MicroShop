export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Comprador' | 'Vendedor' | 'Admin';
  status: 'Activo' | 'Inactivo';
  registrationDate: string;
}

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    role: 'Admin',
    status: 'Activo',
    registrationDate: '2026-01-15'
  },
  {
    id: 2,
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@email.com',
    role: 'Vendedor',
    status: 'Activo',
    registrationDate: '2026-02-10'
  },
  {
    id: 3,
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    role: 'Comprador',
    status: 'Activo',
    registrationDate: '2026-02-20'
  },
  {
    id: 4,
    name: 'Pedro Martínez',
    email: 'pedro.martinez@email.com',
    role: 'Vendedor',
    status: 'Inactivo',
    registrationDate: '2026-01-05'
  },
  {
    id: 5,
    name: 'Laura Torres',
    email: 'laura.torres@email.com',
    role: 'Comprador',
    status: 'Activo',
    registrationDate: '2026-03-01'
  },
  {
    id: 6,
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    role: 'Comprador',
    status: 'Activo',
    registrationDate: '2026-03-15'
  },
  {
    id: 7,
    name: 'Carmen Díaz',
    email: 'carmen.diaz@email.com',
    role: 'Vendedor',
    status: 'Activo',
    registrationDate: '2026-01-20'
  },
  {
    id: 8,
    name: 'José Fernández',
    email: 'jose.fernandez@email.com',
    role: 'Comprador',
    status: 'Inactivo',
    registrationDate: '2026-02-05'
  },
  {
    id: 9,
    name: 'Isabel Ruiz',
    email: 'isabel.ruiz@email.com',
    role: 'Comprador',
    status: 'Activo',
    registrationDate: '2026-03-20'
  },
  {
    id: 10,
    name: 'Miguel Sánchez',
    email: 'miguel.sanchez@email.com',
    role: 'Admin',
    status: 'Activo',
    registrationDate: '2026-01-10'
  }
];
