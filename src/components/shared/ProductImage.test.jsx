import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductImage from './ProductImage'

describe('ProductImage', () => {
  it('renders an img when a src is provided', () => {
    render(<ProductImage src="/img/cam-v4.png" alt="Wyze Cam v4" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/img/cam-v4.png')
  })

  it('renders a placeholder tile with the first letter of alt when there is no src', () => {
    render(<ProductImage src={null} alt="Wyze Cam v4" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('W')).toBeInTheDocument()
  })

  it('falls back to the placeholder tile when the image fails to load', () => {
    render(<ProductImage src="/img/broken.png" alt="Wyze Cam v4" />)
    const img = screen.getByRole('img')

    fireEvent.error(img)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('W')).toBeInTheDocument()
  })

  it('renders "?" as the placeholder when alt is missing', () => {
    render(<ProductImage src={null} alt={undefined} />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('applies a white background by default, and omits it when bg=false', () => {
    const { rerender } = render(<ProductImage src="/img/cam-v4.png" alt="Cam" />)
    expect(screen.getByRole('img').className).toContain('bg-white')

    rerender(<ProductImage src="/img/cam-v4.png" alt="Cam" bg={false} />)
    expect(screen.getByRole('img').className).not.toContain('bg-white')
  })
})
