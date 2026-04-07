export function SuccessAnimation() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <style>{`
          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          
          .success-circle {
            animation: scaleIn 0.5s ease-out forwards;
          }
          
          .success-checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: checkmark 0.5s 0.3s ease-out forwards;
          }
        `}</style>
        
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Circle background */}
          <circle
            className="success-circle"
            cx="60"
            cy="60"
            r="54"
            fill="#10B981"
            opacity="0.1"
          />
          <circle
            className="success-circle"
            cx="60"
            cy="60"
            r="50"
            fill="#10B981"
          />
          
          {/* Checkmark */}
          <path
            className="success-checkmark"
            d="M 35 60 L 50 75 L 85 40"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
