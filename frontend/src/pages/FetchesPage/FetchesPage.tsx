import React, { useState } from 'react';
import { useFetches } from '../../api/useFetches';
import Table, { type TablePage, type TableParams } from '../../components/Table/Table';
import type { FetchRun } from '../../types';
import COLUMNS from './FetchesPage.columns';

const FetchesPage: React.FunctionComponent = () => {
  const [params, setParams] = useState<TableParams | null>(null);

  const { data, isLoading, isError } = useFetches({
    page:      params?.page      ?? 0,
    size:      params?.size      ?? 10,
    sort:      params?.sort      ?? 'startedAt',
    direction: params?.direction ?? 'DESC',
    source:    params?.filters['source']         ?? '',
    from:      params?.filters['startedAt_from'] ?? '',
    to:        params?.filters['startedAt_to']   ?? '',
  });

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Fetch History</h1>
      <Table<FetchRun>
        columns={COLUMNS}
        data={data as TablePage<FetchRun>}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Could not load fetch history."
        emptyMessage="No fetch runs yet."
        defaultSort="startedAt"
        defaultDirection="DESC"
        defaultSize={10}
        onChange={setParams}
        rowKey={run => run.id}
      />
    </main>
  );
};

export default FetchesPage;
