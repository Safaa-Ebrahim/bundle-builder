import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmDialog open={false} title="Confirm checkout" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the title and description when open', () => {
    render(
      <ConfirmDialog
        open
        title="Confirm checkout"
        description="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByText('Confirm checkout')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog open title="Are you sure?" onConfirm={onConfirm} onCancel={() => {}} />)

    await userEvent.click(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={onCancel} />)

    await userEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when clicking the backdrop', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('dialog'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel when clicking inside the dialog content', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={onCancel} />)

    await userEvent.click(screen.getByText('Are you sure?', { selector: 'h2' }))
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when Escape is pressed', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={onCancel} />)

    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('moves initial focus to the Cancel button when opened', () => {
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={() => {}} />)
    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('wraps focus from the last element back to the first on Tab', () => {
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={() => {}} />)

    screen.getByText('Confirm').focus()
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('wraps focus from the first element back to the last on Shift+Tab', () => {
    render(<ConfirmDialog open title="Are you sure?" onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByText('Cancel')).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(screen.getByText('Confirm')).toHaveFocus()
  })

  it('uses custom confirm/cancel labels when provided', () => {
    render(
      <ConfirmDialog
        open
        title="Are you sure?"
        confirmLabel="Checkout"
        cancelLabel="Go back"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Go back')).toBeInTheDocument()
  })
})
