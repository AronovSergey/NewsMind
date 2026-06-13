import type { TablePage, TableParams } from '../../types/table.types';

interface IProps<T> {
  params: TableParams;
  data: TablePage<T> | undefined;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const btnCls = 'px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors';

function TablePagination<T>({ params, data, onPageChange, onSizeChange }: IProps<T>) {
  const firstItem = data && data.totalElements > 0 ? params.page * params.size + 1 : 0;
  const lastItem  = data ? Math.min((params.page + 1) * params.size, data.totalElements) : 0;
  const isFirst   = params.page === 0;
  const isLast    = !data || params.page >= data.totalPages - 1;

  return (
    <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 rounded-b-2xl">

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">Rows per page</span>
        <select
          value={params.size}
          onChange={e => onSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
        >
          {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 dark:text-zinc-500 whitespace-nowrap">
          {data && data.totalElements > 0 ? `${firstItem}–${lastItem} of ${data.totalElements}` : '0 results'}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(0)}                      disabled={isFirst} aria-label="First page"    className={btnCls}>«</button>
          <button onClick={() => onPageChange(params.page - 1)}        disabled={isFirst} aria-label="Previous page" className={btnCls}>‹</button>
          <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-zinc-300">
            {data ? `${data.page + 1} / ${Math.max(data.totalPages, 1)}` : '—'}
          </span>
          <button onClick={() => onPageChange(params.page + 1)}        disabled={isLast}  aria-label="Next page"     className={btnCls}>›</button>
          <button onClick={() => data && onPageChange(data.totalPages - 1)} disabled={isLast} aria-label="Last page" className={btnCls}>»</button>
        </div>
      </div>

    </div>
  );
}

export default TablePagination;
