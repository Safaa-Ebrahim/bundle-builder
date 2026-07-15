import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'

function makeProduct(overrides = {}) {
  return {
    id: 'cam1',
    title: 'Wyze Cam v4',
    description: 'The clearest Wyze Cam ever made.',
    learnMoreUrl: '#',
    discount: 22,
    variants: [
      { id: 'cam1-white', label: 'White', swatch: '#fff', price: 35.98, stock: 8 },
      { id: 'cam1-black', label: 'Black', swatch: '#000', price: 35.98, stock: 8 },
    ],
    ...overrides,
  }
}

describe('ProductCard', () => {
  it('shows the discount badge when the product has a discount', () => {
    render(
      <ProductCard
        product={makeProduct()}
        activeVariantId="cam1-white"
        quantities={{}}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('Save 22%')).toBeInTheDocument()
  })

  it('does not show a discount badge when there is no discount', () => {
    render(
      <ProductCard
        product={makeProduct({ discount: null })}
        activeVariantId="cam1-white"
        quantities={{}}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
      />,
    )
    expect(screen.queryByText(/Save/)).not.toBeInTheDocument()
  })

  it('shows the struck-through original price and the discounted price', () => {
    render(
      <ProductCard
        product={makeProduct()}
        activeVariantId="cam1-white"
        quantities={{}}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('$35.98')).toBeInTheDocument()
    expect(screen.getByText('$28.06')).toBeInTheDocument()
  })

  it('binds the quantity stepper to whichever variant is active', () => {
    render(
      <ProductCard
        product={makeProduct()}
        activeVariantId="cam1-black"
        quantities={{ 'cam1-white': 3, 'cam1-black': 0 }}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
      />,
    )
    // active variant is black, whose qty is 0 — not white's 3
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  it('calls onSetQty with the active variant id when the stepper is used', async () => {
    const onSetQty = vi.fn()
    render(
      <ProductCard
        product={makeProduct()}
        activeVariantId="cam1-white"
        quantities={{ 'cam1-white': 1 }}
        onSelectVariant={() => {}}
        onSetQty={onSetQty}
      />,
    )

    await userEvent.click(screen.getByLabelText('Increase quantity'))
    expect(onSetQty).toHaveBeenCalledWith('cam1-white', 2)
  })

  it('calls onSelectVariant with the product id and clicked variant when switching color', async () => {
    const onSelectVariant = vi.fn()
    render(
      <ProductCard
        product={makeProduct()}
        activeVariantId="cam1-white"
        quantities={{}}
        onSelectVariant={onSelectVariant}
        onSetQty={() => {}}
      />,
    )

    await userEvent.click(screen.getByText('Black'))
    expect(onSelectVariant).toHaveBeenCalledWith('cam1', 'cam1-black')
  })

  it('renders a Select/Selected toggle instead of a stepper when showQuantity=false', () => {
    render(
      <ProductCard
        product={makeProduct({ singleSelect: true })}
        activeVariantId="cam1-white"
        quantities={{ 'cam1-white': 0 }}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
        showQuantity={false}
      />,
    )
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument()
  })

  it('shows "Selected" and toggles qty to 0 on click when already selected', async () => {
    const onSetQty = vi.fn()
    render(
      <ProductCard
        product={makeProduct({ singleSelect: true })}
        activeVariantId="cam1-white"
        quantities={{ 'cam1-white': 1 }}
        onSelectVariant={() => {}}
        onSetQty={onSetQty}
        showQuantity={false}
      />,
    )

    expect(screen.getByText('Selected')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Selected'))
    expect(onSetQty).toHaveBeenCalledWith('cam1-white', 0)
  })

  it('renders two-tone highlighted title when highlightTitle is set', () => {
    render(
      <ProductCard
        product={makeProduct({ title: 'Cam Unlimited', highlightTitle: true, variants: [{ id: 'v1', price: 9.99, stock: null }] })}
        activeVariantId="v1"
        quantities={{}}
        onSelectVariant={() => {}}
        onSetQty={() => {}}
      />,
    )
    expect(screen.getByText('Cam')).toBeInTheDocument()
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })
})
