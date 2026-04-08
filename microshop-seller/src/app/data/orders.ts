export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'entregado' | 'en proceso' | 'pendiente' | 'cancelado';
  paymentMethod: 'Nequi' | 'Tarjeta';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  timeline: {
    created: string;
    confirmed?: string;
    preparing?: string;
    shipped?: string;
    delivered?: string;
  };
}

export const mockOrders: Order[] = [
  {
    id: 'MS-001234',
    date: '2026-04-01',
    status: 'entregado',
    paymentMethod: 'Nequi',
    total: 849.97,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' },
      { name: 'Mouse inalámbrico Logitech', price: 89.99, quantity: 1, image: 'mouse' },
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 1, image: 'headphones' },
    ],
    shippingAddress: {
      name: 'Juan Pérez',
      address: 'Calle 123 #45-67, Apartamento 301',
      city: 'Bogotá, Colombia',
      phone: '+57 300 123 4567',
    },
    timeline: {
      created: '2026-04-01T10:30:00',
      confirmed: '2026-04-01T10:35:00',
      preparing: '2026-04-01T14:20:00',
      shipped: '2026-04-02T09:15:00',
      delivered: '2026-04-03T16:45:00',
    },
  },
  {
    id: 'MS-001235',
    date: '2026-04-02',
    status: 'entregado',
    paymentMethod: 'Tarjeta',
    total: 599.98,
    items: [
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 2, image: 'headphones' },
    ],
    shippingAddress: {
      name: 'María García',
      address: 'Carrera 45 #23-12',
      city: 'Medellín, Colombia',
      phone: '+57 310 987 6543',
    },
    timeline: {
      created: '2026-04-02T08:15:00',
      confirmed: '2026-04-02T08:20:00',
      preparing: '2026-04-02T11:30:00',
      shipped: '2026-04-03T07:00:00',
      delivered: '2026-04-04T15:20:00',
    },
  },
  {
    id: 'MS-001236',
    date: '2026-04-03',
    status: 'en proceso',
    paymentMethod: 'Nequi',
    total: 459.99,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' },
    ],
    shippingAddress: {
      name: 'Carlos Rodríguez',
      address: 'Avenida 68 #34-56',
      city: 'Cali, Colombia',
      phone: '+57 320 456 7890',
    },
    timeline: {
      created: '2026-04-03T12:00:00',
      confirmed: '2026-04-03T12:05:00',
      preparing: '2026-04-03T15:30:00',
    },
  },
  {
    id: 'MS-001237',
    date: '2026-04-04',
    status: 'en proceso',
    paymentMethod: 'Tarjeta',
    total: 179.98,
    items: [
      { name: 'Mouse inalámbrico Logitech', price: 89.99, quantity: 2, image: 'mouse' },
    ],
    shippingAddress: {
      name: 'Ana López',
      address: 'Transversal 12 #89-34',
      city: 'Barranquilla, Colombia',
      phone: '+57 315 234 5678',
    },
    timeline: {
      created: '2026-04-04T09:20:00',
      confirmed: '2026-04-04T09:25:00',
    },
  },
  {
    id: 'MS-001238',
    date: '2026-04-05',
    status: 'pendiente',
    paymentMethod: 'Nequi',
    total: 549.98,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' },
      { name: 'Mouse inalámbrico Logitech', price: 89.99, quantity: 1, image: 'mouse' },
    ],
    shippingAddress: {
      name: 'Luis Martínez',
      address: 'Diagonal 56 #78-90',
      city: 'Cartagena, Colombia',
      phone: '+57 305 876 5432',
    },
    timeline: {
      created: '2026-04-05T14:45:00',
    },
  },
  {
    id: 'MS-001239',
    date: '2026-04-06',
    status: 'pendiente',
    paymentMethod: 'Tarjeta',
    total: 299.99,
    items: [
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 1, image: 'headphones' },
    ],
    shippingAddress: {
      name: 'Patricia Gómez',
      address: 'Calle 90 #12-34',
      city: 'Bucaramanga, Colombia',
      phone: '+57 318 654 3210',
    },
    timeline: {
      created: '2026-04-06T11:30:00',
    },
  },
  {
    id: 'MS-001240',
    date: '2026-03-28',
    status: 'cancelado',
    paymentMethod: 'Nequi',
    total: 759.97,
    items: [
      { name: 'Laptop HP Pavilion 15', price: 459.99, quantity: 1, image: 'laptop' },
      { name: 'Audífonos Sony WH-1000XM4', price: 299.99, quantity: 1, image: 'headphones' },
    ],
    shippingAddress: {
      name: 'Roberto Sánchez',
      address: 'Carrera 23 #45-67',
      city: 'Pereira, Colombia',
      phone: '+57 312 345 6789',
    },
    timeline: {
      created: '2026-03-28T16:20:00',
    },
  },
  {
    id: 'MS-001241',
    date: '2026-03-25',
    status: 'cancelado',
    paymentMethod: 'Tarjeta',
    total: 89.99,
    items: [
      { name: 'Mouse inalámbrico Logitech', price: 89.99, quantity: 1, image: 'mouse' },
    ],
    shippingAddress: {
      name: 'Laura Fernández',
      address: 'Avenida 15 #34-12',
      city: 'Manizales, Colombia',
      phone: '+57 314 987 6543',
    },
    timeline: {
      created: '2026-03-25T10:10:00',
    },
  },
];
