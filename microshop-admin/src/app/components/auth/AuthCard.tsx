import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-lg shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] p-8">
          {/* Logo MicroShop */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L9 2H23L26 6M6 6H26M6 6V26C6 27.1046 6.89543 28 8 28H24C25.1046 28 26 27.1046 26 26V6M12 14C12 16.2091 13.7909 18 16 18C18.2091 18 20 16.2091 20 14"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#111827]" style={{ fontSize: '24px', fontWeight: '600' }}>
                MicroShop
              </span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
