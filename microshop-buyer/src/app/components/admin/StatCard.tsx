interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
            {title}
          </p>
          <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
            {value}
          </p>
          {trend && (
            <p className="mt-2 text-sm" style={{ fontSize: '12px' }}>
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-[#6B7280] dark:text-[#9CA3AF] ml-1">vs mes anterior</span>
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
