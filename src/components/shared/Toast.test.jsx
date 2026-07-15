import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Toast from './Toast'

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast show message="Order placed!" />)
    expect(screen.getByText('Order placed!')).toBeInTheDocument()
  })

  it('is visually hidden (opacity-0, pointer-events-none) when show=false', () => {
    render(<Toast show={false} message="Order placed!" />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('opacity-0')
    expect(toast.className).toContain('pointer-events-none')
  })

  it('is visible (opacity-100) when show=true', () => {
    render(<Toast show message="Order placed!" />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('opacity-100')
  })

  it('announces itself politely for screen readers', () => {
    render(<Toast show message="Order placed!" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })
})
