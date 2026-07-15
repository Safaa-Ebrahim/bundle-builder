const PRODUCT_TABLES = ['products', 'plan', 'sensors', 'accessories']

// Each key above models what would be its own table in a real database
// (products, plan, sensors, accessories); this flattens them into one
// list for lookups, the same shape the rest of the app already expects.
export function getAllProducts(data) {
  return PRODUCT_TABLES.flatMap((key) => data[key] ?? [])
}
