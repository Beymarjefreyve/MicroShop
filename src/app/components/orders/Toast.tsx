import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

export function Toast({ message, isVisible, onClose, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? '#065F46' : '#991B1B';
  const iconColor = type === 'success' ? '#D1FAE5' : '#FEE2E2';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          {type === 'success' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={bgColor} strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={bgColor} strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
        <p className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
