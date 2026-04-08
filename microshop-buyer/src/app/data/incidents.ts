export interface Incident {
  id: string;
  orderId: string;
  userId: number;
  userName: string;
  userEmail: string;
  description: string;
  status: 'abierta' | 'en revisión' | 'resuelta';
  createdDate: string;
  observations: Array<{
    id: number;
    author: string;
    text: string;
    date: string;
  }>;
}

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    orderId: 'MS-001235',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    description: 'El producto llegó con la caja dañada. Los audífonos parecen estar bien pero me preocupa que puedan tener algún defecto interno.',
    status: 'en revisión',
    createdDate: '2026-04-06',
    observations: [
      {
        id: 1,
        author: 'Admin María González',
        text: 'Hemos contactado al vendedor para verificar el estado del producto antes del envío. Esperamos respuesta en las próximas 24 horas.',
        date: '2026-04-06'
      }
    ]
  },
  {
    id: 'INC-002',
    orderId: 'MS-001237',
    userId: 9,
    userName: 'Isabel Ruiz',
    userEmail: 'isabel.ruiz@email.com',
    description: 'Solicito cancelación del pedido. Compré por error una talla incorrecta y necesito hacer un nuevo pedido con la talla correcta.',
    status: 'resuelta',
    createdDate: '2026-04-04',
    observations: [
      {
        id: 1,
        author: 'Admin Miguel Sánchez',
        text: 'Pedido cancelado exitosamente. El reembolso se procesará en 3-5 días hábiles.',
        date: '2026-04-04'
      },
      {
        id: 2,
        author: 'Admin Miguel Sánchez',
        text: 'Reembolso procesado. Cliente notificado por email.',
        date: '2026-04-05'
      }
    ]
  },
  {
    id: 'INC-003',
    orderId: 'MS-001239',
    userId: 5,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    description: 'Han pasado 5 días desde que hice el pedido y aún aparece "en proceso". ¿Cuándo será enviado?',
    status: 'abierta',
    createdDate: '2026-04-07',
    observations: []
  },
  {
    id: 'INC-004',
    orderId: 'MS-001240',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    description: 'El libro llegó con algunas páginas dobladas en las esquinas. Me gustaría solicitar un cambio por un ejemplar en perfectas condiciones.',
    status: 'en revisión',
    createdDate: '2026-04-07',
    observations: [
      {
        id: 1,
        author: 'Admin María González',
        text: 'Solicitamos fotos del producto para evaluar el estado. Cliente enviará fotos en las próximas horas.',
        date: '2026-04-07'
      }
    ]
  },
  {
    id: 'INC-005',
    orderId: 'MS-001244',
    userId: 6,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    description: 'Hice el pago pero no recibí confirmación. El dinero fue debitado de mi cuenta Nequi. Solicito verificación urgente.',
    status: 'resuelta',
    createdDate: '2026-04-07',
    observations: [
      {
        id: 1,
        author: 'Admin Miguel Sánchez',
        text: 'Verificamos con el procesador de pagos. La transacción fue exitosa pero hubo un error en la notificación. Pedido confirmado.',
        date: '2026-04-07'
      },
      {
        id: 2,
        author: 'Admin Miguel Sánchez',
        text: 'Cliente solicitó cancelación después de la confirmación. Procedemos con la cancelación y reembolso.',
        date: '2026-04-07'
      }
    ]
  },
  {
    id: 'INC-006',
    orderId: 'MS-001242',
    userId: 3,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    description: 'Las zapatillas no corresponden a la talla que pedí. Solicité talla 38 pero recibí talla 40. Necesito cambio urgente.',
    status: 'abierta',
    createdDate: '2026-04-07',
    observations: []
  }
];
