import { useQuery } from '@tanstack/react-query';
import type { FetchRunPage } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

interface FetchesParams {
  page: number;
  size: number;
  sort: string;
  direction: string;
  source: string;
  from: string;
  to: string;
}

async function fetchRuns(params: FetchesParams): Promise<FetchRunPage> {
  const query = new URLSearchParams();
  query.set('page', String(params.page));
  query.set('size', String(params.size));
  query.set('sort', params.sort);
  query.set('direction', params.direction);
  if (params.source) query.set('source', params.source);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const res = await fetch(`${API_BASE}/api/fetches?${query}`);
  if (!res.ok) throw new Error('Failed to load fetch history.');
  return res.json();
}

export function useFetches(params: FetchesParams) {
  return useQuery({
    queryKey: ['fetches', params],
    queryFn: () => fetchRuns(params),
  });
}
