import { renderHook, act } from '@testing-library/react'
import { useAsk } from './useAsk'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useAsk', () => {
  it('sets loading during fetch and clears it after', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ answer: 'test', sources: [] }),
    }))

    const { result } = renderHook(() => useAsk())
    let promise: Promise<void>
    act(() => { promise = result.current.ask('question') })
    expect(result.current.loading).toBe(true)
    await act(async () => { await promise })
    expect(result.current.loading).toBe(false)
  })

  it('sets result on successful response', async () => {
    const mockResponse = { answer: 'AI news this week', sources: [] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    }))

    const { result } = renderHook(() => useAsk())
    await act(async () => { await result.current.ask('what happened in AI?') })

    expect(result.current.result).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('sets timeout message on 504', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 504 }))

    const { result } = renderHook(() => useAsk())
    await act(async () => { await result.current.ask('question') })

    expect(result.current.error).toMatch(/taking longer than usual/)
    expect(result.current.result).toBeNull()
  })

  it('sets error message from response body on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    }))

    const { result } = renderHook(() => useAsk())
    await act(async () => { await result.current.ask('question') })

    expect(result.current.error).toBe('Internal server error')
  })

  it('sets connection error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')))

    const { result } = renderHook(() => useAsk())
    await act(async () => { await result.current.ask('question') })

    expect(result.current.error).toMatch(/Could not reach the server/)
  })
})
