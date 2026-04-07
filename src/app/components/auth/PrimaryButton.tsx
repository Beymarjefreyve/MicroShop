import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'danger';
}

export function PrimaryButton({
  children,
  loading = false,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: PrimaryButtonProps) {
  const baseClasses = 'w-full py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = variant === 'danger'
    ? 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      style={{ fontSize: '14px', fontWeight: '500' }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}
