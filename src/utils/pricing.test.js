import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  getPriceAfterDiscount,
  getSaleInfo,
  buildReviewLines,
  groupLinesByCategory,
  computeTotals,
  getMonthlyFinancingEstimate,
  countSelectedProducts,
} from './pricing'

describe('formatPrice', () => {
  it('formats a number as a two-decimal dollar string', () => {
    expect(formatPrice(27.98)).toBe('$27.98')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(5)).toBe('$5.00')
  })
})

describe('getPriceAfterDiscount', () => {
  it('returns the original price when there is no discount', () => {
    expect(getPriceAfterDiscount(20.98, null)).toBe(20.98)
    expect(getPriceAfterDiscount(20.98, 0)).toBe(20.98)
    expect(getPriceAfterDiscount(20.98, undefined)).toBe(20.98)
  })

  it('applies a percent discount to the price', () => {
    expect(getPriceAfterDiscount(100, 22)).toBeCloseTo(78)
    expect(getPriceAfterDiscount(27.98, 22)).toBeCloseTo(21.8244)
  })
})

describe('getSaleInfo', () => {
  it('reports onSale=false when there is no discount', () => {
    const info = getSaleInfo(20.98, null)
    expect(info.finalPrice).toBe(20.98)
    expect(info.onSale).toBe(false)
  })

  it('reports onSale=true and the discounted price when discounted', () => {
    const info = getSaleInfo(27.98, 22)
    expect(info.onSale).toBe(true)
    expect(info.finalPrice).toBeCloseTo(21.8244)
  })
})

function makeProduct(overrides = {}) {
  return {
    id: 'p1',
    category: 'Cameras',
    discount: null,
    variants: [{ id: 'p1-v1', price: 10, stock: 5 }],
    ...overrides,
  }
}

describe('buildReviewLines', () => {
  it('includes only variants with quantity greater than zero', () => {
    const products = [
      makeProduct({
        id: 'p1',
        variants: [
          { id: 'p1-white', price: 10 },
          { id: 'p1-black', price: 10 },
        ],
      }),
    ]
    const quantities = { 'p1-white': 2, 'p1-black': 0 }
    const lines = buildReviewLines(products, quantities)

    expect(lines).toHaveLength(1)
    expect(lines[0].variant.id).toBe('p1-white')
    expect(lines[0].qty).toBe(2)
  })

  it('returns an empty array when nothing is selected', () => {
    const products = [makeProduct()]
    expect(buildReviewLines(products, {})).toEqual([])
  })
})

describe('groupLinesByCategory', () => {
  it('groups lines by their product category, preserving encounter order', () => {
    const lineA = { product: { category: 'Cameras' } }
    const lineB = { product: { category: 'Sensors' } }
    const lineC = { product: { category: 'Cameras' } }

    const groups = groupLinesByCategory([lineA, lineB, lineC])

    expect([...groups.keys()]).toEqual(['Cameras', 'Sensors'])
    expect(groups.get('Cameras')).toEqual([lineA, lineC])
    expect(groups.get('Sensors')).toEqual([lineB])
  })
})

describe('computeTotals', () => {
  it('sums discounted totals and full-price totals across lines', () => {
    const lines = [
      { product: { discount: 22 }, variant: { price: 27.98 }, qty: 1 },
      { product: { discount: null }, variant: { price: 20.98 }, qty: 2 },
    ]

    const totals = computeTotals(lines, null)

    expect(totals.compareAtTotal).toBeCloseTo(27.98 + 20.98 * 2)
    expect(totals.activeTotal).toBeCloseTo(27.98 * 0.78 + 20.98 * 2)
    expect(totals.savings).toBeCloseTo(totals.compareAtTotal - totals.activeTotal)
  })

  it('adds shipping (with its own discount) into both totals', () => {
    const lines = []
    const shipping = { price: 5.99, discount: 100 }

    const totals = computeTotals(lines, shipping)

    expect(totals.compareAtTotal).toBeCloseTo(5.99)
    expect(totals.activeTotal).toBeCloseTo(0)
    expect(totals.savings).toBeCloseTo(5.99)
  })

  it('ignores shipping entirely when none is passed', () => {
    const totals = computeTotals([], null)
    expect(totals).toEqual({ activeTotal: 0, compareAtTotal: 0, savings: 0 })
  })
})

describe('getMonthlyFinancingEstimate', () => {
  it('divides the total by the given number of months', () => {
    expect(getMonthlyFinancingEstimate(240, 12)).toBe(20)
  })

  it('defaults to 12 months when months is not provided', () => {
    expect(getMonthlyFinancingEstimate(240)).toBe(20)
  })

  it('returns the total unchanged when months is falsy', () => {
    expect(getMonthlyFinancingEstimate(240, 0)).toBe(240)
    expect(getMonthlyFinancingEstimate(240, null)).toBe(240)
  })
})

describe('countSelectedProducts', () => {
  it('counts distinct products with at least one variant selected', () => {
    const products = [
      makeProduct({ id: 'a', variants: [{ id: 'a-1' }, { id: 'a-2' }] }),
      makeProduct({ id: 'b', variants: [{ id: 'b-1' }] }),
      makeProduct({ id: 'c', variants: [{ id: 'c-1' }] }),
    ]
    const quantities = { 'a-1': 0, 'a-2': 1, 'b-1': 0, 'c-1': 2 }

    expect(countSelectedProducts(products, ['a', 'b', 'c'], quantities)).toBe(2)
  })

  it('ignores product ids that do not exist in the catalog', () => {
    const products = [makeProduct({ id: 'a', variants: [{ id: 'a-1' }] })]
    expect(countSelectedProducts(products, ['a', 'missing'], { 'a-1': 1 })).toBe(1)
  })

  it('returns 0 when no product ids are given', () => {
    expect(countSelectedProducts([makeProduct()], [], {})).toBe(0)
  })
})
