import { useState } from 'react';
import type { QueryResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

interface UseAskResult {
  ask: (question: string) => Promise<void>;
  result: QueryResponse | null;
  loading: boolean;
  error: string | null;
}

export function useAsk(): UseAskResult {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (question: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (response.status === 504) {
        setError('This is taking longer than usual — please try again in a moment.');
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? 'Something went wrong. Please try again.');
        return;
      }

      const data: QueryResponse = await response.json();
      setResult(data);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return { ask, result, loading, error };
}
