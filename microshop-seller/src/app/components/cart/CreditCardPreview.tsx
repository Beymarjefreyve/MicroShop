interface CreditCardPreviewProps {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
}

export function CreditCardPreview({ cardNumber, cardName, expiryDate }: CreditCardPreviewProps) {
  // Format card number to show only last 4 digits
  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length === 0) return '•••• •••• •••• ••••';
    if (cleaned.length <= 4) return `•••• •••• •••• ${cleaned}`;
    const lastFour = cleaned.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-2xl p-6 text-white shadow-xl">
        {/* Card chip */}
        <div className="mb-8">
          <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
            <rect width="48" height="36" rx="6" fill="url(#chip-gradient)" />
            <defs>
              <linearGradient id="chip-gradient" x1="0" y1="0" x2="48" y2="36">
                <stop stopColor="#FFD700" />
                <stop offset="1" stopColor="#FFA500" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Card number */}
        <div className="mb-6">
          <div className="text-2xl tracking-wider font-mono">
            {formatCardNumber(cardNumber)}
          </div>
        </div>

        {/* Card details */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70 mb-1">Titular</div>
            <div className="font-medium tracking-wide">
              {cardName || 'NOMBRE APELLIDO'}
            </div>
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Vence</div>
            <div className="font-medium">{expiryDate || 'MM/AA'}</div>
          </div>
        </div>

        {/* Visa/Mastercard logos */}
        <div className="absolute top-6 right-6">
          <svg width="60" height="20" viewBox="0 0 60 20" fill="white" opacity="0.8">
            <text x="0" y="15" fontSize="14" fontWeight="bold">VISA</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
