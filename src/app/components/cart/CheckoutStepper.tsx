interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: 'Resumen' },
    { number: 2, label: 'Pago' },
    { number: 3, label: 'Confirmación' },
  ];

  return (
    <div className="bg-white border-b border-[#E5E7EB] py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Línea de fondo */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E7EB]" style={{ zIndex: 0 }} />

          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;
            const isPending = step.number > currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
                {/* Círculo del paso */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-200 text-[#6B7280]'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-[#2563EB]' : isPending ? 'text-[#6B7280]' : 'text-green-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
