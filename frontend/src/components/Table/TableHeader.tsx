import { IconFilter } from '../icons';
import type { TableColumn, TableParams } from '../../types/table.types';

interface IProps<T> {
  columns: TableColumn<T>[];
  params: TableParams;
  filterOpenKey: string | null;
  onToggleSort: (field: string) => void;
  onToggleFilter: (key: string) => void;
  onSetFilter: (key: string, value: string) => void;
}

const inputCls = 'px-2 py-1 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-400';

function isFilterActive<T>(col: TableColumn<T>, filters: TableParams['filters']): boolean {
  if (!col.filterKey) return false;
  if (col.filterType === 'daterange') {
    return !!(filters[`${col.filterKey}_from`] || filters[`${col.filterKey}_to`]);
  }
  return !!filters[col.filterKey];
}

function TableHeader<T>({ columns, params, filterOpenKey, onToggleSort, onToggleFilter, onSetFilter }: IProps<T>) {
  return (
    <thead>
      <tr className="border-b border-gray-100 dark:border-zinc-800">
        {columns.map(col => (
          <th key={col.key} className="px-4 py-3 text-left">
            <div className="flex items-center gap-1">
              {col.sortField ? (
                <button
                  onClick={() => onToggleSort(col.sortField!)}
                  className="flex items-center gap-1 font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-xs cursor-pointer select-none hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
                >
                  {col.label}
                  {params.sort === col.sortField && (
                    <span>{params.direction === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </button>
              ) : (
                <span className="font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-xs">
                  {col.label}
                </span>
              )}
              {col.filterKey && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleFilter(col.filterKey!); }}
                  className={`ml-0.5 p-0.5 rounded transition-colors ${
                    filterOpenKey === col.filterKey || isFilterActive(col, params.filters)
                      ? 'text-purple-500 dark:text-purple-400'
                      : 'text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400'
                  }`}
                  aria-label={`Filter ${col.label}`}
                >
                  <IconFilter />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>

      {filterOpenKey && (
        <tr className="border-b border-purple-100 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-900/10">
          {columns.map(col => (
            <th key={col.key} className="px-4 py-2 font-normal">
              {col.filterKey === filterOpenKey && col.filterType === 'text' && (
                <input
                  autoFocus
                  type="text"
                  placeholder={`Filter ${col.label.toLowerCase()}…`}
                  value={params.filters[col.filterKey] ?? ''}
                  onChange={e => onSetFilter(col.filterKey!, e.target.value)}
                  className={`${inputCls} w-48`}
                />
              )}
              {col.filterKey === filterOpenKey && col.filterType === 'daterange' && (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    type="datetime-local"
                    value={params.filters[`${col.filterKey}_from`] ?? ''}
                    onChange={e => onSetFilter(`${col.filterKey}_from`, e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className={inputCls}
                  />
                  <span className="text-gray-300 dark:text-zinc-600 select-none">→</span>
                  <input
                    type="datetime-local"
                    value={params.filters[`${col.filterKey}_to`] ?? ''}
                    onChange={e => onSetFilter(`${col.filterKey}_to`, e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className={inputCls}
                  />
                </div>
              )}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
}

export default TableHeader;
