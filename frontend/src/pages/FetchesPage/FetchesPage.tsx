import React, { useState } from 'react';
import { useFetches } from '../../api/useFetches';
import { timeAgo } from '../../utils/timeAgo';

type SortField = 'startedAt' | 'completedAt' | 'totalFetched' | 'totalNew';

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'startedAt',    label: 'Started At' },
  { key: 'completedAt',  label: 'Completed At' },
  { key: 'totalFetched', label: 'Fetched' },
  { key: 'totalNew',     label: 'New' },
];

const FetchesPage: React.FunctionComponent = () => {
  const [page, setPage]           = useState(0);
  const [size]                    = useState(20);
  const [sort, setSort]           = useState<SortField>('startedAt');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [source, setSource]       = useState('');
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');

  const { data, isLoading, isError } = useFetches({ page, size, sort, direction, source, from, to });

  function toggleSort(col: SortField) {
    if (sort === col) {
      setDirection(d => d === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSort(col);
      setDirection('DESC');
    }
    setPage(0);
  }

  function SortIcon({ col }: { col: SortField }) {
    if (sort !== col) return <span className="ml-1 text-gray-300 dark:text-zinc-600">↕</span>;
    return <span className="ml-1">{direction === 'ASC' ? '↑' : '↓'}</span>;
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Fetch History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by source"
          value={source}
          onChange={e => { setSource(e.target.value); setPage(0); }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="datetime-local"
          value={from}
          onChange={e => { setFrom(e.target.value ? new Date(e.target.value).toISOString() : ''); setPage(0); }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="datetime-local"
          value={to}
          onChange={e => { setTo(e.target.value ? new Date(e.target.value).toISOString() : ''); setPage(0); }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-xs cursor-pointer select-none hover:text-gray-800 dark:hover:text-zinc-200"
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-xs">Sources</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-zinc-500">Loading…</td></tr>
            )}
            {isError && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-red-500">Could not load fetch history.</td></tr>
            )}
            {data?.content.map(run => (
              <tr key={run.id} className="border-b border-gray-50 dark:border-zinc-800/60 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 whitespace-nowrap">{timeAgo(run.startedAt)}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                  {run.completedAt ? timeAgo(run.completedAt) : <span className="text-amber-500">In progress</span>}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">{run.totalFetched}</td>
                <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{run.totalNew}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 text-xs">
                  {run.sources.map(s => s.sourceName).join(', ')}
                </td>
              </tr>
            ))}
            {data?.content.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-zinc-500">No fetch runs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400 dark:text-zinc-500">
            Page {data.page + 1} of {data.totalPages} · {data.totalElements} runs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FetchesPage;
