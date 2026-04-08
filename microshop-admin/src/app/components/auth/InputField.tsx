import { ReactNode, InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  id: string;
}

export function InputField({ label, icon, error, id, className = '', ...props }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full px-4 py-2.5 border rounded-lg transition-colors outline-none ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#D1D5DB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
          } ${className}`}
          style={{ fontSize: '14px' }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-red-500" style={{ fontSize: '13px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
