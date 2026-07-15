import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBundle } from './useBundle'
import { saveSystem } from '../utils/storage'

function makeData(overrides = {}) {
  return {
    steps: [
      { id: 'cameras', stepNumber: 1, title: 'Choose your cameras', icon: 'camera', productIds: ['cam1'] },
      { id: 'plan', stepNumber: 2, title: 'Choose your plan', icon: 'shield', productIds: ['plan1'] },
      { id: 'sensors', stepNumber: 3, title: 'Choose your sensors', icon: 'sensor', productIds: ['sensor1'] },
    ],
    products: [
      {
        id: 'cam1',
        category: 'Cameras',
        discount: 20,
        variants: [
          { id: 'cam1-white', price: 10, defaultQty: 1, stock: 5 },
          { id: 'cam1-black', price: 10, defaultQty: 0, stock: 5 },
        ],
      },
    ],
    plan: [
      {
        id: 'plan1',
        category: 'Plan',
        discount: null,
        singleSelect: true,
        variants: [{ id: 'plan1-default', price: 9.99, defaultQty: 0, stock: null }],
      },
    ],
    sensors: [
      {
        id: 'sensor1',
        category: 'Sensors',
        discount: null,
        variants: [{ id: 'sensor1-default', price: 30, defaultQty: 0, stock: 10 }],
      },
    ],
    shippingOptions: [
      { id: 'fast', label: 'Fast Shipping', price: 5.99, discount: 100, isDefault: true },
      { id: 'standard', label: 'Standard', price: 2.99, discount: 0, isDefault: false },
    ],
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useBundle initial state', () => {
  it('seeds quantities and activeVariant from each variant\'s defaultQty', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    expect(result.current.quantities).toEqual({
      'cam1-white': 1,
      'cam1-black': 0,
      'plan1-default': 0,
      'sensor1-default': 0,
    })
    expect(result.current.activeVariant.cam1).toBe('cam1-white')
  })

  it('opens the first step by default', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    expect(result.current.openStep).toBe('cameras')
  })

  it('defaults selected shipping to whichever option is marked isDefault', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    expect(result.current.selectedShippingId).toBe('fast')
    expect(result.current.selectedShipping.id).toBe('fast')
  })

  it('restores a saved system from localStorage, merged over the seed defaults', () => {
    saveSystem({
      quantities: { 'cam1-white': 0, 'cam1-black': 2 },
      activeVariant: { cam1: 'cam1-black' },
      selectedShippingId: 'standard',
    })

    const { result } = renderHook(() => useBundle(makeData()))

    expect(result.current.quantities['cam1-black']).toBe(2)
    expect(result.current.quantities['cam1-white']).toBe(0)
    // a product that didn't exist in the saved snapshot still gets its seed default
    expect(result.current.quantities['sensor1-default']).toBe(0)
    expect(result.current.activeVariant.cam1).toBe('cam1-black')
    expect(result.current.selectedShippingId).toBe('standard')
  })
})

describe('setQty', () => {
  it('updates the quantity for a specific variant', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.setQty('cam1-black', 3))

    expect(result.current.quantities['cam1-black']).toBe(3)
    expect(result.current.quantities['cam1-white']).toBe(1)
  })

  it('clamps negative quantities to zero', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.setQty('cam1-white', -5))

    expect(result.current.quantities['cam1-white']).toBe(0)
  })
})

describe('selectVariant', () => {
  it('changes the active variant for one product without affecting others', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.selectVariant('cam1', 'cam1-black'))

    expect(result.current.activeVariant.cam1).toBe('cam1-black')
    // quantities are untouched by switching which variant is "active"
    expect(result.current.quantities['cam1-white']).toBe(1)
    expect(result.current.quantities['cam1-black']).toBe(0)
  })
})

describe('accordion (toggleStep / goToNextStep)', () => {
  it('toggles a step closed when it is already open', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    expect(result.current.openStep).toBe('cameras')

    act(() => result.current.toggleStep('cameras'))
    expect(result.current.openStep).toBeNull()
  })

  it('switches the open step when a different step is toggled', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.toggleStep('plan'))
    expect(result.current.openStep).toBe('plan')
  })

  it('advances to the next step', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.goToNextStep('cameras'))
    expect(result.current.openStep).toBe('plan')
  })

  it('does nothing when advancing past the last step', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.toggleStep('sensors'))
    expect(result.current.openStep).toBe('sensors')

    act(() => result.current.goToNextStep('sensors'))
    expect(result.current.openStep).toBe('sensors')
  })
})

describe('shipping selection', () => {
  it('updates selectedShipping and totals when a different option is chosen', () => {
    const { result } = renderHook(() => useBundle(makeData()))

    const totalsBefore = result.current.totals
    act(() => result.current.selectShippingOption('standard'))

    expect(result.current.selectedShippingId).toBe('standard')
    expect(result.current.selectedShipping.price).toBe(2.99)
    expect(result.current.totals.activeTotal).not.toBe(totalsBefore.activeTotal)
  })
})

describe('derived data: reviewLines / groupedLines / totals / stepSelectedCount', () => {
  it('only includes lines with quantity greater than zero', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    expect(result.current.reviewLines).toHaveLength(1)
    expect(result.current.reviewLines[0].variant.id).toBe('cam1-white')
  })

  it('groups review lines by category', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    expect([...result.current.groupedLines.keys()]).toEqual(['Cameras'])
  })

  it('computes totals including the default shipping option', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    // cam1-white: price 10, discount 20% -> 8; shipping fast: price 5.99, discount 100 -> 0
    expect(result.current.totals.activeTotal).toBeCloseTo(8)
    expect(result.current.totals.compareAtTotal).toBeCloseTo(10 + 5.99)
  })

  it('counts selected products per step', () => {
    const { result } = renderHook(() => useBundle(makeData()))
    const camerasStep = { productIds: ['cam1'] }
    const sensorsStep = { productIds: ['sensor1'] }

    expect(result.current.stepSelectedCount(camerasStep)).toBe(1)
    expect(result.current.stepSelectedCount(sensorsStep)).toBe(0)
  })
})

describe('saveForLater', () => {
  it('persists the current quantities/activeVariant/shipping and shows a temporary notice', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.setQty('cam1-black', 2))
    act(() => result.current.saveForLater())

    expect(result.current.savedNotice).toBe(true)
    expect(JSON.parse(localStorage.getItem('bundle-builder:v1'))).toMatchObject({
      quantities: { 'cam1-black': 2 },
      selectedShippingId: 'fast',
    })

    act(() => vi.advanceTimersByTime(2500))
    expect(result.current.savedNotice).toBe(false)

    vi.useRealTimers()
  })
})

describe('checkout', () => {
  it('clears the saved system, resets state to seed defaults, and shows a temporary confirmation', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBundle(makeData()))

    act(() => result.current.setQty('cam1-black', 4))
    act(() => result.current.selectShippingOption('standard'))
    act(() => result.current.toggleStep('sensors'))
    act(() => result.current.saveForLater())

    act(() => result.current.checkout())

    expect(localStorage.getItem('bundle-builder:v1')).toBeNull()
    expect(result.current.quantities['cam1-black']).toBe(0)
    expect(result.current.quantities['cam1-white']).toBe(1)
    expect(result.current.selectedShippingId).toBe('fast')
    expect(result.current.openStep).toBe('cameras')
    expect(result.current.checkedOut).toBe(true)

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.checkedOut).toBe(false)

    vi.useRealTimers()
  })
})
