import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReviewLineItem from './ReviewLineItem'

function makeProduct(overrides = {}) {
  return { title: 'Wyze Cam v4', discount: 22, ...overrides }
}

function makeVariant(overrides = {}) {
  return { id: 'cam1-white', label: 'White', price: 35.98, stock: 8, ...overrides }
}

describe('ReviewLineItem', () => {
  it('shows the line total (unit price after discount times qty)', () => {
    render(
      <ReviewLineItem product={makeProduct()} variant={makeVariant()} qty={2} onSetQty={() => {}} />,
    )
    // 35.98 * 0.78 * 2 = 56.1288 -> $56.13
    expect(screen.getByText('$56.13')).toBeInTheDocument()
  })

  it('shows the struck-through full-price total when on sale', () => {
    render(
      <ReviewLineItem product={makeProduct()} variant={makeVariant()} qty={2} onSetQty={() => {}} />,
    )
    expect(screen.getByText('$71.96')).toBeInTheDocument()
  })

  it('does not show a struck-through price when there is no discount', () => {
    render(
      <ReviewLineItem
        product={makeProduct({ discount: null })}
        variant={makeVariant()}
        qty={1}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('$35.98')).toBeInTheDocument()
    expect(screen.queryByText('$35.98', { selector: '.line-through' })).not.toBeInTheDocument()
  })

  it('shows FREE when the line total is zero', () => {
    render(
      <ReviewLineItem
        product={makeProduct({ discount: 100 })}
        variant={makeVariant({ price: 29.92 })}
        qty={1}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('FREE')).toBeInTheDocument()
  })

  it('appends the variant label to the title', () => {
    render(
      <ReviewLineItem product={makeProduct()} variant={makeVariant({ label: 'White' })} qty={1} onSetQty={() => {}} />,
    )
    expect(screen.getByText('Wyze Cam v4 (White)')).toBeInTheDocument()
  })

  it('omits the label parentheses when the variant has no label', () => {
    render(
      <ReviewLineItem product={makeProduct()} variant={makeVariant({ label: null })} qty={1} onSetQty={() => {}} />,
    )
    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument()
  })

  it('calls onSetQty with the variant id when the stepper changes', async () => {
    const onSetQty = vi.fn()
    render(
      <ReviewLineItem product={makeProduct()} variant={makeVariant()} qty={2} onSetQty={onSetQty} />,
    )

    await userEvent.click(screen.getByLabelText('Increase quantity'))
    expect(onSetQty).toHaveBeenCalledWith('cam1-white', 3)
  })

  it('hides the quantity stepper when showQuantity=false', () => {
    render(
      <ReviewLineItem
        product={makeProduct()}
        variant={makeVariant()}
        qty={1}
        onSetQty={() => {}}
        showQuantity={false}
      />,
    )
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument()
  })

  it('renders two-tone highlighted title when highlightTitle is set', () => {
    render(
      <ReviewLineItem
        product={makeProduct({ title: 'Cam Unlimited', highlightTitle: true, discount: null })}
        variant={makeVariant({ id: 'plan1', label: null })}
        qty={1}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('Cam')).toBeInTheDocument()
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })
})
