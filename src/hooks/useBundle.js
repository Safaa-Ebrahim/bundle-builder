import { useMemo, useState } from 'react'
import { loadSavedSystem, saveSystem, clearSavedSystem } from '../utils/storage'
import { getAllProducts } from '../utils/catalog'
import {
  buildReviewLines,
  computeTotals,
  countSelectedProducts,
  groupLinesByCategory,
} from '../utils/pricing'

function seedState(products) {
  const quantities = {}
  const activeVariant = {}

  for (const product of products) {
    let active = product.variants[0]?.id ?? null
    for (const variant of product.variants) {
      quantities[variant.id] = variant.defaultQty ?? 0
      if (variant.defaultQty > 0) active = variant.id
    }
    activeVariant[product.id] = active
  }

  return { quantities, activeVariant }
}

export function useBundle(data) {
  const products = useMemo(() => getAllProducts(data), [data])

  const [{ quantities, activeVariant }, setState] = useState(() => {
    const seeded = seedState(products)
    const saved = loadSavedSystem()
    if (saved) {
      return {
        quantities: { ...seeded.quantities, ...saved.quantities },
        activeVariant: { ...seeded.activeVariant, ...saved.activeVariant },
      }
    }
    return seeded
  })

  const [openStep, setOpenStep] = useState(data.steps[0]?.id ?? null)
  const [savedNotice, setSavedNotice] = useState(false)
  const [checkedOut, setCheckedOut] = useState(false)

  const setQty = (variantId, qty) => {
    setState((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [variantId]: Math.max(0, qty) },
    }))
  }

  const selectVariant = (productId, variantId) => {
    setState((prev) => ({
      ...prev,
      activeVariant: { ...prev.activeVariant, [productId]: variantId },
    }))
  }

  const toggleStep = (stepId) => {
    setOpenStep((prev) => (prev === stepId ? null : stepId))
  }

  const goToNextStep = (currentStepId) => {
    const idx = data.steps.findIndex((s) => s.id === currentStepId)
    const next = data.steps[idx + 1]
    if (next) setOpenStep(next.id)
  }

  const saveForLater = () => {
    saveSystem({ quantities, activeVariant })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  const checkout = () => {
    clearSavedSystem()
    setState(seedState(products))
    setOpenStep(data.steps[0]?.id ?? null)
    setCheckedOut(true)
    setTimeout(() => setCheckedOut(false), 3000)
  }

  const reviewLines = useMemo(
    () => buildReviewLines(products, quantities),
    [products, quantities],
  )

  const groupedLines = useMemo(() => groupLinesByCategory(reviewLines), [reviewLines])

  const totals = useMemo(
    () => computeTotals(reviewLines, data.shipping),
    [reviewLines, data.shipping],
  )

  const stepSelectedCount = (step) =>
    countSelectedProducts(products, step.productIds, quantities)

  return {
    products,
    quantities,
    activeVariant,
    openStep,
    savedNotice,
    checkedOut,
    reviewLines,
    groupedLines,
    totals,
    setQty,
    selectVariant,
    toggleStep,
    goToNextStep,
    saveForLater,
    checkout,
    stepSelectedCount,
  }
}
