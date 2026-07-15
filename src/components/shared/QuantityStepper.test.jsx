import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuantityStepper from './QuantityStepper'

describe('QuantityStepper', () => {
  it('renders the current quantity', () => {
    render(<QuantityStepper qty={3} onChange={() => {}} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onChange with qty+1 when the increase button is clicked', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper qty={2} onChange={onChange} />)

    await userEvent.click(screen.getByLabelText('Increase quantity'))

    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('calls onChange with qty-1 when the decrease button is clicked', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper qty={2} onChange={onChange} />)

    await userEvent.click(screen.getByLabelText('Decrease quantity'))

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('disables the decrease button at zero', () => {
    render(<QuantityStepper qty={0} onChange={() => {}} />)
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled()
  })

  it('disables the increase button once qty reaches max stock', () => {
    render(<QuantityStepper qty={5} onChange={() => {}} max={5} />)
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled()
  })

  it('does not disable the increase button below max stock', () => {
    render(<QuantityStepper qty={4} onChange={() => {}} max={5} />)
    expect(screen.getByLabelText('Increase quantity')).not.toBeDisabled()
  })

  it('treats max=null as unlimited stock', () => {
    render(<QuantityStepper qty={9999} onChange={() => {}} max={null} />)
    expect(screen.getByLabelText('Increase quantity')).not.toBeDisabled()
  })

  it('disables both buttons when disabled=true regardless of qty/max', () => {
    render(<QuantityStepper qty={2} onChange={() => {}} disabled max={5} />)
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled()
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled()
  })
})
