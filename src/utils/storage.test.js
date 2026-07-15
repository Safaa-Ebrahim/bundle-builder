import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadSavedSystem, saveSystem, clearSavedSystem } from './storage'

const KEY = 'bundle-builder:v1'

beforeEach(() => {
  localStorage.clear()
})

describe('saveSystem / loadSavedSystem roundtrip', () => {
  it('saves and reloads the same data', () => {
    const data = { quantities: { a: 1 }, activeVariant: { p: 'a' }, selectedShippingId: 'fast' }
    expect(saveSystem(data)).toBe(true)
    expect(loadSavedSystem()).toEqual(data)
  })

  it('returns null when nothing has been saved', () => {
    expect(loadSavedSystem()).toBeNull()
  })
})

describe('loadSavedSystem error handling', () => {
  it('returns null instead of throwing when the stored value is corrupted JSON', () => {
    localStorage.setItem(KEY, '{not valid json')
    expect(loadSavedSystem()).toBeNull()
  })
})

describe('saveSystem error handling', () => {
  it('returns false instead of throwing when localStorage.setItem fails (e.g. quota exceeded)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(saveSystem({ quantities: {} })).toBe(false)

    spy.mockRestore()
  })
})

describe('clearSavedSystem', () => {
  it('removes the saved system', () => {
    saveSystem({ quantities: { a: 1 } })
    expect(loadSavedSystem()).not.toBeNull()

    expect(clearSavedSystem()).toBe(true)
    expect(loadSavedSystem()).toBeNull()
  })
})
