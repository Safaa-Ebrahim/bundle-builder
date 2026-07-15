import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VariantSelector from './VariantSelector'

describe('VariantSelector', () => {
  it('renders nothing when there is only one variant', () => {
    const { container } = render(
      <VariantSelector
        variants={[{ id: 'v1', label: null }]}
        activeVariantId="v1"
        onSelect={() => {}}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when no variant has a label (e.g. a single-SKU product)', () => {
    const { container } = render(
      <VariantSelector
        variants={[{ id: 'v1', label: null }, { id: 'v2', label: null }]}
        activeVariantId="v1"
        onSelect={() => {}}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a chip per labeled variant', () => {
    render(
      <VariantSelector
        variants={[
          { id: 'white', label: 'White', swatch: '#fff' },
          { id: 'black', label: 'Black', swatch: '#000' },
        ]}
        activeVariantId="white"
        onSelect={() => {}}
      />,
    )
    expect(screen.getByText('White')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
  })

  it('marks the active variant chip as aria-pressed', () => {
    render(
      <VariantSelector
        variants={[
          { id: 'white', label: 'White', swatch: '#fff' },
          { id: 'black', label: 'Black', swatch: '#000' },
        ]}
        activeVariantId="black"
        onSelect={() => {}}
      />,
    )
    expect(screen.getByText('White').closest('button')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Black').closest('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onSelect with the clicked variant id', async () => {
    const onSelect = vi.fn()
    render(
      <VariantSelector
        variants={[
          { id: 'white', label: 'White', swatch: '#fff' },
          { id: 'black', label: 'Black', swatch: '#000' },
        ]}
        activeVariantId="white"
        onSelect={onSelect}
      />,
    )

    await userEvent.click(screen.getByText('Black'))

    expect(onSelect).toHaveBeenCalledWith('black')
  })

  it('renders a swatch image when the variant has an image, falling back to the color dot on error', () => {
    const { container } = render(
      <VariantSelector
        variants={[
          { id: 'white', label: 'White', swatch: '#fff', image: '/img/white.png' },
          { id: 'black', label: 'Black', swatch: '#000' },
        ]}
        activeVariantId="white"
        onSelect={() => {}}
      />,
    )

    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/img/white.png')

    fireEvent.error(img)

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
