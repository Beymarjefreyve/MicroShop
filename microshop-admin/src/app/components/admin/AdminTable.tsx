import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function AdminTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick
}: AdminTableProps<T>) {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md overflow-hidden border border-[#E5E7EB] dark:border-[#374151]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#374151]">
          <thead className="bg-gray-50 dark:bg-[#111827]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-[#6B7280] dark:text-[#9CA3AF]"
                  style={{ fontSize: '12px', fontWeight: '500', width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#1F2937] divide-y divide-[#E5E7EB] dark:divide-[#374151]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]"
                  style={{ fontSize: '14px' }}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={onRowClick ? 'hover:bg-gray-50 dark:hover:bg-[#374151] cursor-pointer transition-colors' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-[#111827] dark:text-white"
                      style={{ fontSize: '14px' }}
                    >
                      {typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : String(row[column.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
