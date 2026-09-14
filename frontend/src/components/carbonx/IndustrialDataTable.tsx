import React, { useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface IndustrialDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

/**
 * IndustrialDataTable — High-density dark data table with tabular numeric alignment.
 */
export function IndustrialDataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  onRowClick,
  className = '',
}: IndustrialDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] shadow-card ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222736] px-5 py-3.5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-[#222736] bg-[#090A0F] pl-9 pr-3 py-1.5 font-sans text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none focus:border-[#00FF87]"
          />
        </div>

        <div className="font-mono text-xs text-[#94A3B8]">
          SHOWING <span className="font-bold text-[#F8FAFC]">{data.length}</span> RECORDS
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="border-b border-[#222736] bg-[#090A0F] font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-5 py-3.5 ${col.sortable ? 'cursor-pointer hover:text-[#00FF87] select-none' : ''} ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3 w-3 text-[#64748B]" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#222736]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center font-mono text-xs text-[#64748B]">
                  No matching telemetry records.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  data-cursor={onRowClick ? 'OPEN' : undefined}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[#181B26]' : 'hover:bg-[#181B26]/50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 font-sans text-xs text-[#F8FAFC] ${
                        col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.accessor(row)}
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
