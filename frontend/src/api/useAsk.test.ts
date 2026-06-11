import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAsk } from './useAsk';

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAsk', () => {
  it('sets loading during fetch and clears it after', async () => {
    let resolveFetch!: (value: unknown) => void;
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(r => { resolveFetch = r; })));

    const { result } = renderHook(() => useAsk(), { wrapper });
    result.current.ask('question');
    await waitFor(() => expect(result.current.loading).toBe(true));

    resolveFetch({ ok: true, status: 200, json: async () => ({ answer: 'test', sources: [] }) });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('sets result on successful response', async () => {
    const mockResponse = { answer: 'AI news this week', sources: [] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => mockResponse,
    }));

    const { result } = renderHook(() => useAsk(), { wrapper });
    result.current.ask('what happened in AI?');

    await waitFor(() => expect(result.current.result).toEqual(mockResponse));
    expect(result.current.error).toBeNull();
  });

  it('sets timeout message on 504', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 504 }));

    const { result } = renderHook(() => useAsk(), { wrapper });
    result.current.ask('question');

    await waitFor(() => expect(result.current.error).toMatch(/taking longer than usual/));
    expect(result.current.result).toBeNull();
  });

  it('sets error message from response body on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, json: async () => ({ error: 'Internal server error' }),
    }));

    const { result } = renderHook(() => useAsk(), { wrapper });
    result.current.ask('question');

    await waitFor(() => expect(result.current.error).toBe('Internal server error'));
  });

  it('sets connection error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

    const { result } = renderHook(() => useAsk(), { wrapper });
    result.current.ask('question');

    await waitFor(() => expect(result.current.error).toMatch(/Something went wrong/));
  });
});
