export interface AdminOrder {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  date: string;
  status: 'entregado' | 'en proceso' | 'pendiente' | 'cancelado';
  paymentMethod: 'Nequi' | 'Tarjeta';
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
}

export const adminOrders: AdminOrder[] = [
  {
    id: 'MS-001234',
    userId: 3,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    date: '2026-04-01',
    status: 'entregado',
    paymentMethod: 'Nequi',
    total: 459.99,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' }
    ],
    shippingAddress: {
      name: 'Ana López',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      phone: '+57 300 1234567'
    }
  },
  {
    id: 'MS-001235',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    date: '2026-04-02',
    status: 'en proceso',
    paymentMethod: 'Tarjeta',
    total: 649.98,
    items: [
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 2, image: 'headphones' }
    ],
    shippingAddress: {
      name: 'Laura Torres',
      address: 'Carrera 7 #12-34',
      city: 'Medellín',
      phone: '+57 310 9876543'
    }
  },
  {
    id: 'MS-001236',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    date: '2026-04-03',
    status: 'pendiente',
    paymentMethod: 'Nequi',
    total: 89.99,
    items: [
      { name: 'Mouse inalámbrico Logitech MX Master 3', price: 89.99, quantity: 1, image: 'mouse' }
    ],
    shippingAddress: {
      name: 'Roberto Silva',
      address: 'Avenida 68 #23-45',
      city: 'Cali',
      phone: '+57 320 5551234'
    }
  },
  {
    id: 'MS-001237',
    userId: 9,
    userName: 'Isabel Ruiz',
    userEmail: 'isabel.ruiz@email.com',
    date: '2026-04-04',
    status: 'cancelado',
    paymentMethod: 'Tarjeta',
    total: 24.99,
    items: [
      { name: 'Camiseta deportiva Nike', price: 24.99, quantity: 1, image: 'tshirt' }
    ],
    shippingAddress: {
      name: 'Isabel Ruiz',
      address: 'Calle 45 #78-90',
      city: 'Barranquilla',
      phone: '+57 315 7778888'
    }
  },
  {
    id: 'MS-001238',
    userId: 3,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    date: '2026-04-05',
    status: 'entregado',
    paymentMethod: 'Nequi',
    total: 32.50,
    items: [
      { name: 'Cafetera italiana Bialetti', price: 32.50, quantity: 1, image: 'coffee' }
    ],
    shippingAddress: {
      name: 'Ana López',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      phone: '+57 300 1234567'
    }
  },
  {
    id: 'MS-001239',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    date: '2026-04-05',
    status: 'en proceso',
    paymentMethod: 'Tarjeta',
    total: 45.00,
    items: [
      { name: 'Balón de fútbol Adidas', price: 45.00, quantity: 1, image: 'ball' }
    ],
    shippingAddress: {
      name: 'Laura Torres',
      address: 'Carrera 7 #12-34',
      city: 'Medellín',
      phone: '+57 310 9876543'
    }
  },
  {
    id: 'MS-001240',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    date: '2026-04-06',
    status: 'pendiente',
    paymentMethod: 'Nequi',
    total: 18.99,
    items: [
      { name: 'El Principito - Antoine de Saint-Exupéry', price: 18.99, quantity: 1, image: 'book' }
    ],
    shippingAddress: {
      name: 'Roberto Silva',
      address: 'Avenida 68 #23-45',
      city: 'Cali',
      phone: '+57 320 5551234'
    }
  },
  {
    id: 'MS-001241',
    userId: 9,
    userName: 'Isabel Ruiz',
    userEmail: 'isabel.ruiz@email.com',
    date: '2026-04-06',
    status: 'entregado',
    paymentMethod: 'Tarjeta',
    total: 67.90,
    items: [
      { name: 'Juego de sartenes antiadherentes', price: 67.90, quantity: 1, image: 'pans' }
    ],
    shippingAddress: {
      name: 'Isabel Ruiz',
      address: 'Calle 45 #78-90',
      city: 'Barranquilla',
      phone: '+57 315 7778888'
    }
  },
  {
    id: 'MS-001242',
    userId: 3,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    date: '2026-04-07',
    status: 'en proceso',
    paymentMethod: 'Nequi',
    total: 149.99,
    items: [
      { name: 'Zapatillas Running Adidas Ultraboost', price: 149.99, quantity: 1, image: 'shoes' }
    ],
    shippingAddress: {
      name: 'Ana López',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      phone: '+57 300 1234567'
    }
  },
  {
    id: 'MS-001243',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    date: '2026-04-07',
    status: 'pendiente',
    paymentMethod: 'Tarjeta',
    total: 39.99,
    items: [
      { name: 'Pantalón de vestir slim fit', price: 39.99, quantity: 1, image: 'pants' }
    ],
    shippingAddress: {
      name: 'Laura Torres',
      address: 'Carrera 7 #12-34',
      city: 'Medellín',
      phone: '+57 310 9876543'
    }
  },
  {
    id: 'MS-001244',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    date: '2026-04-07',
    status: 'cancelado',
    paymentMethod: 'Nequi',
    total: 27.50,
    items: [
      { name: 'Organizador de escritorio bambú', price: 27.50, quantity: 1, image: 'organizer' }
    ],
    shippingAddress: {
      name: 'Roberto Silva',
      address: 'Avenida 68 #23-45',
      city: 'Cali',
      phone: '+57 320 5551234'
    }
  },
  {
    id: 'MS-001245',
    userId: 9,
    userName: 'Isabel Ruiz',
    userEmail: 'isabel.ruiz@email.com',
    date: '2026-04-07',
    status: 'entregado',
    paymentMethod: 'Tarjeta',
    total: 15.99,
    items: [
      { name: 'Cuerda de saltar profesional', price: 15.99, quantity: 1, image: 'rope' }
    ],
    shippingAddress: {
      name: 'Isabel Ruiz',
      address: 'Calle 45 #78-90',
      city: 'Barranquilla',
      phone: '+57 315 7778888'
    }
  },
  {
    id: 'MS-001246',
    userId: 3,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    date: '2026-04-07',
    status: 'en proceso',
    paymentMethod: 'Nequi',
    total: 932.47,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' },
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 1, image: 'headphones' },
      { name: 'Mouse inalámbrico Logitech MX Master 3', price: 89.99, quantity: 1, image: 'mouse' },
      { name: 'Mouse inalámbrico Logitech MX Master 3', price: 89.99, quantity: 1, image: 'mouse' }
    ],
    shippingAddress: {
      name: 'Ana López',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      phone: '+57 300 1234567'
    }
  },
  {
    id: 'MS-001247',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    date: '2026-04-07',
    status: 'pendiente',
    paymentMethod: 'Tarjeta',
    total: 215.98,
    items: [
      { name: 'Zapatillas Running Adidas Ultraboost', price: 149.99, quantity: 1, image: 'shoes' },
      { name: 'Balón de fútbol Adidas', price: 45.00, quantity: 1, image: 'ball' },
      { name: 'Cuerda de saltar profesional', price: 15.99, quantity: 1, image: 'rope' }
    ],
    shippingAddress: {
      name: 'Laura Torres',
      address: 'Carrera 7 #12-34',
      city: 'Medellín',
      phone: '+57 310 9876543'
    }
  },
  {
    id: 'MS-001248',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    date: '2026-04-07',
    status: 'entregado',
    paymentMethod: 'Nequi',
    total: 137.48,
    items: [
      { name: 'Cafetera italiana Bialetti', price: 32.50, quantity: 1, image: 'coffee' },
      { name: 'Juego de sartenes antiadherentes', price: 67.90, quantity: 1, image: 'pans' },
      { name: 'Organizador de escritorio bambú', price: 27.50, quantity: 1, image: 'organizer' },
      { name: 'El Principito - Antoine de Saint-Exupéry', price: 18.99, quantity: 1, image: 'book' }
    ],
    shippingAddress: {
      name: 'Roberto Silva',
      address: 'Avenida 68 #23-45',
      city: 'Cali',
      phone: '+57 320 5551234'
    }
  }
];
