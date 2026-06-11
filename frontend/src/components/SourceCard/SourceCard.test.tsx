import { render, screen } from '@testing-library/react'
import { SourceCard } from './SourceCard'
import type { SourceDto } from '../../types'

const source: SourceDto = {
  title: 'OpenAI announces GPT-5',
  url: 'https://example.com/article',
  source: 'TechCrunch',
  publishedAt: null,
}

describe('SourceCard', () => {
  it('renders title and source name', () => {
    render(<SourceCard source={source} />)
    expect(screen.getByText('OpenAI announces GPT-5')).toBeInTheDocument()
    expect(screen.getByText('TechCrunch')).toBeInTheDocument()
  })

  it('links to the article url and opens in a new tab', () => {
    render(<SourceCard source={source} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/article')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows "recently" when publishedAt is null', () => {
    render(<SourceCard source={source} />)
    expect(screen.getByText('recently')).toBeInTheDocument()
  })

  it('shows minutes ago for a recent publishedAt', () => {
    const recent: SourceDto = { ...source, publishedAt: new Date(Date.now() - 5 * 60000).toISOString() }
    render(<SourceCard source={recent} />)
    expect(screen.getByText('5 min ago')).toBeInTheDocument()
  })
})
