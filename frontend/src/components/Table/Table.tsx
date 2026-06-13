import { useEffect, useRef, useState } from 'react';
import type { TableColumn, TablePage, TableParams } from '../../types/table.types';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';

export type { TableColumn, TablePage, TableParams };

interface IProps<T> {
  columns: TableColumn<T>[];
  data: TablePage<T> | undefined;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  defaultSort?: string;
  defaultDirection?: 'ASC' | 'DESC';
  defaultSize?: number;
  onChange: (params: TableParams) => void;
  rowKey: (row: T) => string;
}

function Table<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage = 'Could not load data.',
  emptyMessage = 'No data yet.',
  defaultSort = '',
  defaultDirection = 'DESC',
  defaultSize = 10,
  onChange,
  rowKey,
}: IProps<T>) {
  const [params, setParams] = useState<TableParams>({
    page: 0,
    size: defaultSize,
    sort: defaultSort,
    direction: defaultDirection,
    filters: {},
  });
  const [filterOpenKey, setFilterOpenKey] = useState<string | null>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });
  useEffect(() => { onChangeRef.current(params); }, [params]);

  function toggleSort(field: string) {
    setParams(p => ({
      ...p,
      page: 0,
      sort: field,
      direction: p.sort === field && p.direction === 'DESC' ? 'ASC' : 'DESC',
    }));
  }

  function toggleFilter(key: string) {
    setFilterOpenKey(open => open === key ? null : key);
  }

  function setFilter(key: string, value: string) {
    setParams(p => ({ ...p, page: 0, filters: { ...p.filters, [key]: value } }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="overflow-x-auto rounded-t-2xl">
        <table className="w-full text-sm">
          <TableHeader
            columns={columns}
            params={params}
            filterOpenKey={filterOpenKey}
            onToggleSort={toggleSort}
            onToggleFilter={toggleFilter}
            onSetFilter={setFilter}
          />
          <TableBody
            columns={columns}
            data={data}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            emptyMessage={emptyMessage}
            rowKey={rowKey}
          />
        </table>
      </div>
      <TablePagination
        params={params}
        data={data}
        onPageChange={page => setParams(p => ({ ...p, page }))}
        onSizeChange={size => setParams(p => ({ ...p, page: 0, size }))}
      />
    </div>
  );
}

export default Table;
