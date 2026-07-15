export function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

// `variant.price` is the original/list price; the price the shopper actually
// pays is derived from the product's discount percent rather than stored
// twice, so the two numbers can never drift out of sync.
export function getPriceAfterDiscount(price, discountPercent) {
  if (!discountPercent) return price
  return price * (1 - discountPercent / 100)
}

export function buildReviewLines(products, quantities) {
  const lines = []
  for (const product of products) {
    for (const variant of product.variants) {
      const qty = quantities[variant.id] ?? 0
      if (qty > 0) {
        lines.push({ product, variant, qty })
      }
    }
  }
  return lines
}

export function groupLinesByCategory(lines) {
  const groups = new Map()
  for (const line of lines) {
    const key = line.product.category
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(line)
  }
  return groups
}

export function computeTotals(lines, shipping) {
  let activeTotal = 0
  let compareAtTotal = 0

  for (const { product, variant, qty } of lines) {
    activeTotal += getPriceAfterDiscount(variant.price, product.discount) * qty
    compareAtTotal += variant.price * qty
  }

  if (shipping) {
    activeTotal += getPriceAfterDiscount(shipping.price, shipping.discount)
    compareAtTotal += shipping.price
  }

  return {
    activeTotal,
    compareAtTotal,
    savings: compareAtTotal - activeTotal,
  }
}

export function countSelectedProducts(products, productIds, quantities) {
  return productIds.filter((id) => {
    const product = products.find((p) => p.id === id)
    if (!product) return false
    return product.variants.some((v) => (quantities[v.id] ?? 0) > 0)
  }).length
}
