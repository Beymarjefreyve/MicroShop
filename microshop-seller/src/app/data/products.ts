export const products = [
  {
    id: 1,
    name: 'Laptop HP Pavilion 15',
    description: 'Laptop potente con procesador Intel Core i5 de 11va generación, 8GB RAM, 256GB SSD. Perfecta para trabajo y estudios. Incluye Windows 11 Home preinstalado y teclado retroiluminado.',
    price: 459.99,
    category: 'Electrónica',
    stock: 15,
    rating: 4.5,
    reviews: 28,
    image: 'laptop',
    sellerId: 1,
    sellerName: 'TechStore Pro'
  },
  {
    id: 2,
    name: 'Camiseta deportiva Nike',
    description: 'Camiseta deportiva de alta calidad con tecnología Dri-FIT que mantiene la piel seca y cómoda. Ideal para running, gym y deportes al aire libre. Disponible en varios colores.',
    price: 24.99,
    category: 'Ropa',
    stock: 0,
    rating: 4.2,
    reviews: 45,
    image: 'tshirt',
    sellerId: 2,
    sellerName: 'Sports Fashion'
  },
  {
    id: 3,
    name: 'Cafetera italiana Bialetti',
    description: 'Cafetera clásica de aluminio para 6 tazas. Prepara un café aromático y delicioso al estilo italiano tradicional. Fácil de limpiar y muy durable.',
    price: 32.50,
    category: 'Hogar',
    stock: 24,
    rating: 4.8,
    reviews: 156,
    image: 'coffee',
    sellerId: 1,
    sellerName: 'TechStore Pro'
  },
  {
    id: 4,
    name: 'Balón de fútbol Adidas',
    description: 'Balón oficial de fútbol talla 5, costura térmica de alta resistencia. Diseño profesional apto para partidos y entrenamientos. Certificación FIFA Quality.',
    price: 45.00,
    category: 'Deportes',
    stock: 8,
    rating: 4.6,
    reviews: 72,
    image: 'ball',
    sellerId: 2,
    sellerName: 'Sports Fashion'
  },
  {
    id: 5,
    name: 'Audífonos Sony WH-1000XM4',
    description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria. Batería de hasta 30 horas, sonido premium y conexión multipunto. Incluye estuche de viaje.',
    price: 299.99,
    category: 'Electrónica',
    stock: 12,
    rating: 4.9,
    reviews: 234,
    image: 'headphones',
    sellerId: 1,
    sellerName: 'TechStore Pro'
  },
  {
    id: 6,
    name: 'El Principito - Antoine de Saint-Exupéry',
    description: 'Edición especial ilustrada del clásico literario. Incluye las ilustraciones originales del autor. Tapa dura, papel de alta calidad. Regalo perfecto para todas las edades.',
    price: 18.99,
    category: 'Libros',
    stock: 35,
    rating: 4.9,
    reviews: 189,
    image: 'book',
    sellerId: 3,
    sellerName: 'Librería Central'
  },
  {
    id: 7,
    name: 'Juego de sartenes antiadherentes',
    description: 'Set de 3 sartenes de diferentes tamaños con recubrimiento antiadherente de cerámica. Libres de PFOA, aptas para todo tipo de cocinas incluyendo inducción.',
    price: 67.90,
    category: 'Hogar',
    stock: 18,
    rating: 4.3,
    reviews: 93,
    image: 'pans',
    sellerId: 1,
    sellerName: 'TechStore Pro'
  },
  {
    id: 8,
    name: 'Zapatillas Running Adidas Ultraboost',
    description: 'Zapatillas de running con tecnología Boost para máximo retorno de energía. Suela Continental de alto agarre. Upper Primeknit adaptable y transpirable.',
    price: 149.99,
    category: 'Deportes',
    stock: 6,
    rating: 4.7,
    reviews: 167,
    image: 'shoes',
    sellerId: 2,
    sellerName: 'Sports Fashion'
  },
  {
    id: 9,
    name: 'Mouse inalámbrico Logitech MX Master 3',
    description: 'Mouse ergonómico para productividad con sensor de 4000 DPI, desplazamiento electromagnético MagSpeed y batería recargable de hasta 70 días.',
    price: 89.99,
    category: 'Electrónica',
    stock: 22,
    rating: 4.8,
    reviews: 312,
    image: 'mouse',
    sellerId: 1,
    sellerName: 'TechStore Pro'
  },
  {
    id: 10,
    name: 'Pantalón de vestir slim fit',
    description: 'Pantalón formal de corte moderno en mezcla de algodón con elastano. Perfecto para oficina y eventos formales. Disponible en negro, azul marino y gris.',
    price: 39.99,
    category: 'Ropa',
    stock: 14,
    rating: 4.1,
    reviews: 56,
    image: 'pants',
    sellerId: 2,
    sellerName: 'Sports Fashion'
  },
  {
    id: 11,
    name: 'Organizador de escritorio bambú',
    description: 'Organizador multiuso de bambú natural con compartimentos para papelería, teléfono y accesorios. Diseño minimalista y ecológico.',
    price: 27.50,
    category: 'Hogar',
    stock: 29,
    rating: 4.4,
    reviews: 78,
    image: 'organizer',
    sellerId: 3,
    sellerName: 'Librería Central'
  },
  {
    id: 12,
    name: 'Cuerda de saltar profesional',
    description: 'Cuerda de saltar con rodamientos de alta velocidad y mangos antideslizantes. Longitud ajustable. Ideal para crossfit, boxing y cardio.',
    price: 15.99,
    category: 'Deportes',
    stock: 41,
    rating: 4.5,
    reviews: 124,
    image: 'rope',
    sellerId: 2,
    sellerName: 'Sports Fashion'
  }
];

export const reviews: Record<number, Array<{
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}>> = {
  1: [
    {
      id: 1,
      userName: 'María González',
      rating: 5,
      comment: 'Excelente laptop, muy rápida y perfecta para mis necesidades de trabajo. La batería dura mucho.',
      date: '2026-03-15'
    },
    {
      id: 2,
      userName: 'Carlos Ramírez',
      rating: 4,
      comment: 'Buena relación calidad-precio. El teclado retroiluminado es un plus.',
      date: '2026-03-20'
    },
    {
      id: 3,
      userName: 'Ana López',
      rating: 5,
      comment: 'Llegó en perfectas condiciones. Muy recomendada para estudiantes.',
      date: '2026-03-28'
    }
  ],
  5: [
    {
      id: 4,
      userName: 'Pedro Martínez',
      rating: 5,
      comment: 'Los mejores audífonos con cancelación de ruido que he probado. El sonido es espectacular.',
      date: '2026-03-10'
    },
    {
      id: 5,
      userName: 'Laura Torres',
      rating: 5,
      comment: 'La batería dura realmente 30 horas. Perfectos para viajes largos.',
      date: '2026-03-18'
    },
    {
      id: 6,
      userName: 'Roberto Silva',
      rating: 4,
      comment: 'Excelente calidad, aunque un poco caros. Valen la pena.',
      date: '2026-03-25'
    }
  ]
};
