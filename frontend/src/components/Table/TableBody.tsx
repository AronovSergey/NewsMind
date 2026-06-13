import type { TableColumn, TablePage } from '../../types/table.types';

interface IProps<T> {
  columns: TableColumn<T>[];
  data: TablePage<T> | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  emptyMessage: string;
  rowKey: (row: T) => string;
}

function TableBody<T>({ columns, data, isLoading, isError, errorMessage, emptyMessage, rowKey }: IProps<T>) {
  const colCount = columns.length;

  return (
    <tbody>
      {isLoading && (
        <tr><td colSpan={colCount} className="px-4 py-8 text-center text-gray-400 dark:text-zinc-500">Loading…</td></tr>
      )}
      {isError && (
        <tr><td colSpan={colCount} className="px-4 py-8 text-center text-red-500">{errorMessage}</td></tr>
      )}
      {!isLoading && !isError && data?.content.map(row => (
        <tr key={rowKey(row)} className="border-b border-gray-50 dark:border-zinc-800/60 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
          {columns.map(col => (
            <td key={col.key} className="px-4 py-3">
              {col.render(row)}
            </td>
          ))}
        </tr>
      ))}
      {!isLoading && !isError && data?.content.length === 0 && (
        <tr><td colSpan={colCount} className="px-4 py-8 text-center text-gray-400 dark:text-zinc-500">{emptyMessage}</td></tr>
      )}
    </tbody>
  );
}

export default TableBody;
