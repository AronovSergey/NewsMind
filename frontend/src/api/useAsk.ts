import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import type { QueryResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function postQuestion(question: string, signal: AbortSignal): Promise<QueryResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new Error('Something went wrong. Please try again.');
  }

  if (response.status === 504) {
    throw new Error('This is taking longer than usual — please try again in a moment.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Something went wrong. Please try again.');
  }

  return response.json();
}

export function useAsk() {
  const abortRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: (question: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      return postQuestion(question, controller.signal);
    },
  });

  const { mutateAsync, data, isPending, error, isError } = mutation;
  const isAbortError = error instanceof DOMException && error.name === 'AbortError';

  return {
    ask: (question: string) => { mutateAsync(question).catch(() => {}); },
    reset: () => { abortRef.current?.abort(); mutation.reset(); },
    result: isPending || isError ? null : (data ?? null),
    loading: isPending,
    error: isError && !isAbortError ? ((error as Error)?.message ?? 'Something went wrong. Please try again.') : null,
  };
}
