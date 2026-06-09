import { render, screen } from '@testing-library/react'
import { AnswerCard } from './AnswerCard'

describe('AnswerCard', () => {
  it('renders the answer text', () => {
    render(<AnswerCard answer="AI made significant progress this week." />)
    expect(screen.getByText('AI made significant progress this week.')).toBeInTheDocument()
  })
})
