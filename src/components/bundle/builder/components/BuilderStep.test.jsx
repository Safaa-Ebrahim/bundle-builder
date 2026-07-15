import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BuilderStep from './BuilderStep'

function makeStep(overrides = {}) {
  return { id: 'cameras', stepNumber: 1, title: 'Choose your cameras', icon: 'camera', ...overrides }
}

function makeProduct(overrides = {}) {
  return {
    id: 'cam1',
    title: 'Wyze Cam v4',
    variants: [{ id: 'cam1-white', price: 35.98, stock: 8 }],
    ...overrides,
  }
}

const baseProps = {
  totalSteps: 4,
  activeVariant: { cam1: 'cam1-white' },
  quantities: { 'cam1-white': 1 },
  onToggle: () => {},
  onSelectVariant: () => {},
  onSetQty: () => {},
  onNext: () => {},
  isLast: false,
  nextStepTitle: 'Choose your plan',
}

describe('BuilderStep', () => {
  it('shows the step number and title', () => {
    render(<BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} />)
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByText('Choose your cameras')).toBeInTheDocument()
  })

  it('shows the "N selected" count only when something is selected', () => {
    const { rerender } = render(
      <BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} />,
    )
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument()

    rerender(<BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={2} />)
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('marks the toggle button as aria-expanded to match isOpen', () => {
    const { rerender } = render(
      <BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen={false} selectedCount={0} />,
    )
    expect(screen.getByRole('button', { name: /Choose your cameras/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    rerender(<BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} />)
    expect(screen.getByRole('button', { name: /Choose your cameras/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('does not render the products grid or Next button when closed', () => {
    render(
      <BuilderStep
        {...baseProps}
        step={makeStep()}
        products={[makeProduct()]}
        isOpen={false}
        selectedCount={0}
      />,
    )
    expect(screen.queryByText('Wyze Cam v4')).not.toBeInTheDocument()
    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument()
  })

  it('renders product cards when open', () => {
    render(
      <BuilderStep {...baseProps} step={makeStep()} products={[makeProduct()]} isOpen selectedCount={1} />,
    )
    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument()
  })

  it('calls onToggle when the header is clicked', async () => {
    const onToggle = vi.fn()
    render(
      <BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} onToggle={onToggle} />,
    )
    await userEvent.click(screen.getByText('Choose your cameras'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows the empty-step message when products is an empty array', () => {
    render(<BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} />)
    expect(screen.getByText('No options available for this step right now.')).toBeInTheDocument()
  })

  it('hides the Next button on the last step', () => {
    render(
      <BuilderStep {...baseProps} step={makeStep()} products={[]} isOpen selectedCount={0} isLast />,
    )
    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument()
  })

  it('shows "Next: <nextStepTitle>" and calls onNext when clicked', async () => {
    const onNext = vi.fn()
    render(
      <BuilderStep
        {...baseProps}
        step={makeStep()}
        products={[]}
        isOpen
        selectedCount={0}
        onNext={onNext}
        nextStepTitle="Choose your plan"
      />,
    )
    const nextButton = screen.getByText('Next: Choose your plan')
    await userEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('passes showQuantity=false through to singleSelect products', () => {
    render(
      <BuilderStep
        {...baseProps}
        step={makeStep({ id: 'plan' })}
        products={[makeProduct({ id: 'plan1', title: 'Cam Unlimited', singleSelect: true, variants: [{ id: 'plan1-default', price: 9.99, stock: null }] })]}
        activeVariant={{ plan1: 'plan1-default' }}
        quantities={{ 'plan1-default': 0 }}
        isOpen
        selectedCount={0}
      />,
    )
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument()
  })
})
