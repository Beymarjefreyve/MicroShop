interface OrderTimelineProps {
  timeline: {
    created: string;
    confirmed?: string;
    preparing?: string;
    shipped?: string;
    delivered?: string;
  };
  status: string;
}

export function OrderTimeline({ timeline, status }: OrderTimelineProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} de ${month}, ${hours}:${minutes}`;
  };

  const steps = [
    {
      label: 'Pedido creado',
      date: timeline.created,
      completed: true,
    },
    {
      label: 'Pago confirmado',
      date: timeline.confirmed,
      completed: !!timeline.confirmed,
    },
    {
      label: 'En preparación',
      date: timeline.preparing,
      completed: !!timeline.preparing,
    },
    {
      label: 'Enviado',
      date: timeline.shipped,
      completed: !!timeline.shipped,
    },
    {
      label: 'Entregado',
      date: timeline.delivered,
      completed: !!timeline.delivered,
    },
  ];

  return (
    <div className="space-y-1">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full ${
                step.completed ? 'bg-[#065F46]' : 'bg-[#E5E7EB]'
              }`}
            />
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 h-8 ${
                  step.completed ? 'bg-[#065F46]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <p
              className={step.completed ? 'text-[#111827]' : 'text-[#6B7280]'}
              style={{ fontSize: '14px', fontWeight: step.completed ? '600' : '400' }}
            >
              {step.label}
            </p>
            {step.date && (
              <p className="text-[#6B7280] mt-0.5" style={{ fontSize: '13px' }}>
                {formatDateTime(step.date)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
