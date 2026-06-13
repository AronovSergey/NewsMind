import { render, screen } from '@testing-library/react'
import AnswerCard from './AnswerCard'

describe('AnswerCard', () => {
  it('renders the answer text', () => {
    render(<AnswerCard answer="AI made significant progress this week." />)
    expect(screen.getByText('AI made significant progress this week.')).toBeInTheDocument()
  })

  it('strips inline citation markers from the answer text', () => {
    render(<AnswerCard answer="Big news [1] this week [2]." />)
    expect(screen.getByText('Big news this week.')).toBeInTheDocument()
  })
})
