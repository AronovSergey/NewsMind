import { render, screen } from '@testing-library/react'
import AnswerCard from './AnswerCard'

describe('AnswerCard', () => {
  it('renders the answer text', () => {
    render(<AnswerCard answer="AI made significant progress this week." sources={[]} />)
    expect(screen.getByText('AI made significant progress this week.')).toBeInTheDocument()
  })

  it('renders citation as a link when sources are provided', () => {
    const sources = [{ title: 'AI News', url: 'https://example.com/ai', source: 'Example', publishedAt: null }]
    render(<AnswerCard answer="Big news [1] this week." sources={sources} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/ai')
    expect(link).toHaveTextContent('1')
  })
})
