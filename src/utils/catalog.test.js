import { describe, it, expect } from 'vitest'
import { getAllProducts } from './catalog'

describe('getAllProducts', () => {
  it('flattens the products/plan/sensors/accessories arrays into one list', () => {
    const data = {
      products: [{ id: 'cam1' }, { id: 'cam2' }],
      plan: [{ id: 'plan1' }],
      sensors: [{ id: 'sensor1' }],
      accessories: [{ id: 'acc1' }],
    }

    const result = getAllProducts(data)

    expect(result.map((p) => p.id)).toEqual(['cam1', 'cam2', 'plan1', 'sensor1', 'acc1'])
  })

  it('tolerates missing keys (e.g. a flat Supabase "products" array with no other keys)', () => {
    const data = { products: [{ id: 'only' }] }
    expect(getAllProducts(data).map((p) => p.id)).toEqual(['only'])
  })

  it('returns an empty array when no recognized keys are present', () => {
    expect(getAllProducts({})).toEqual([])
  })
})
