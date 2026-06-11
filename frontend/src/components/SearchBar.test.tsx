import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar onSearch={() => {}} loading={false} />)
    expect(screen.getByPlaceholderText("Ask anything about today's news...")).toBeInTheDocument()
  })

  it('calls onSearch with trimmed value on submit', async () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} loading={false} />)
    await userEvent.type(screen.getByRole('textbox'), '  What happened in AI?  ')
    await userEvent.click(screen.getByRole('button', { name: /ask/i }))
    expect(onSearch).toHaveBeenCalledWith('What happened in AI?')
  })

  it('does not submit with blank input', async () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} loading={false} />)
    await userEvent.click(screen.getByRole('button', { name: /ask/i }))
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('disables input and button while loading', () => {
    render(<SearchBar onSearch={() => {}} loading={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('button keeps aria-label while loading', () => {
    render(<SearchBar onSearch={() => {}} loading={true} />)
    expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
  })
})
