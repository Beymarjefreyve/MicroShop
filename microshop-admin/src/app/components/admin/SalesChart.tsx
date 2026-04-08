interface SalesChartProps {
  data: Array<{
    month: string;
    sales: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const maxSales = Math.max(...data.map(d => d.sales));
  const chartHeight = 200;

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
      <h3 className="text-[#111827] dark:text-white mb-6" style={{ fontSize: '16px', fontWeight: '600' }}>
        Ventas últimos 6 meses
      </h3>
      <div className="flex items-end justify-between h-[200px] gap-4">
        {data.map((item, index) => {
          const height = (item.sales / maxSales) * chartHeight;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-[#6B7280] dark:text-[#9CA3AF] mb-1" style={{ fontSize: '12px' }}>
                  ${item.sales.toLocaleString()}
                </span>
                <div
                  className="w-full bg-[#2563EB] rounded-t-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                  style={{ height: `${height}px`, minHeight: '20px' }}
                  title={`${item.month}: $${item.sales.toLocaleString()}`}
                />
              </div>
              <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
