import { timeAgo } from '../../utils/timeAgo';
import type { TableColumn } from '../../types/table.types';
import type { FetchRun } from '../../types';

const COLUMNS: TableColumn<FetchRun>[] = [
  {
    key: 'startedAt',
    label: 'Started At',
    sortField: 'startedAt',
    filterType: 'daterange',
    filterKey: 'startedAt',
    render: run => <span className="text-gray-700 dark:text-zinc-300 whitespace-nowrap">{timeAgo(run.startedAt)}</span>,
  },
  {
    key: 'completedAt',
    label: 'Completed At',
    sortField: 'completedAt',
    render: run => run.completedAt
      ? <span className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">{timeAgo(run.completedAt)}</span>
      : <span className="text-amber-500">In progress</span>,
  },
  {
    key: 'totalFetched',
    label: 'Fetched',
    sortField: 'totalFetched',
    render: run => <span className="text-gray-700 dark:text-zinc-300">{run.totalFetched}</span>,
  },
  {
    key: 'totalNew',
    label: 'New',
    sortField: 'totalNew',
    render: run => <span className="font-medium text-emerald-600 dark:text-emerald-400">{run.totalNew}</span>,
  },
  {
    key: 'sources',
    label: 'Sources',
    filterType: 'text',
    filterKey: 'source',
    render: run => <span className="text-gray-500 dark:text-zinc-400 text-xs">{run.sources.map(s => s.sourceName).join(', ')}</span>,
  },
];

export default COLUMNS;
