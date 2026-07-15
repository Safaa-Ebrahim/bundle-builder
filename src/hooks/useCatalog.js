import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import fallbackData from '../data/products.json'

const STATUS = {
  LOADING: 'loading',
  READY: 'ready',
}

async function fetchFromSupabase() {
  const [stepsRes, productsRes, variantsRes, shippingRes, settingsRes] = await Promise.all([
    supabase.from('steps').select('*').order('step_number', { ascending: true }),
    supabase.from('products').select('*'),
    supabase.from('variants').select('*'),
    supabase.from('shipping_options').select('*').order('sort_order', { ascending: true }),
    supabase.from('app_settings').select('*'),
  ])

  for (const res of [stepsRes, productsRes, variantsRes, shippingRes, settingsRes]) {
    if (res.error) throw res.error
  }

  const stepRows = stepsRes.data
  const productRows = productsRes.data
  const variantRows = variantsRes.data
  const shippingRows = shippingRes.data
  const settingRows = settingsRes.data

  if (!stepRows?.length || !productRows?.length) {
    throw new Error('Empty catalog response')
  }

  const variantsByProductId = new Map()
  for (const v of variantRows) {
    const list = variantsByProductId.get(v.product_id) ?? []
    list.push({
      id: v.id,
      label: v.label,
      swatch: v.swatch,
      image: v.image,
      price: Number(v.price),
      defaultQty: v.default_qty,
      stock: v.stock,
    })
    variantsByProductId.set(v.product_id, list)
  }

  const products = productRows.map((p) => ({
    id: p.id,
    category: p.category,
    title: p.title,
    description: p.description,
    learnMoreUrl: p.learn_more_url,
    discount: p.discount === null ? null : Number(p.discount),
    billingSuffix: p.billing_suffix,
    transparentImage: p.transparent_image,
    highlightTitle: p.highlight_title,
    singleSelect: p.single_select,
    variants: variantsByProductId.get(p.id) ?? [],
  }))

  const productIdsByStepId = new Map()
  for (const p of productRows) {
    const list = productIdsByStepId.get(p.step_id) ?? []
    list.push(p.id)
    productIdsByStepId.set(p.step_id, list)
  }

  const steps = stepRows.map((s) => ({
    id: s.id,
    stepNumber: s.step_number,
    title: s.title,
    icon: s.icon,
    productIds: productIdsByStepId.get(s.id) ?? [],
  }))

  const settings = Object.fromEntries(settingRows.map((s) => [s.key, s.value]))

  const shippingOptions = shippingRows.map((s) => ({
    id: s.id,
    label: s.label,
    price: Number(s.price),
    discount: s.discount === null ? null : Number(s.discount),
    image: s.image,
    isDefault: s.is_default,
    sortOrder: s.sort_order,
  }))

  return {
    steps,
    products,
    shippingOptions,
    guarantee: settings.guarantee,
    financing: settings.financing,
  }
}

export function useCatalog() {
  const [state, setState] = useState({ status: STATUS.LOADING, data: null, usedFallback: false })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ status: STATUS.LOADING, data: null, usedFallback: false })

      try {
        const data = await fetchFromSupabase()
        if (!cancelled) setState({ status: STATUS.READY, data, usedFallback: false })
      } catch (err) {
        console.warn('Supabase catalog fetch failed, using local fallback:', err.message)
        if (!cancelled) {
          // The bundled JSON ships with the app, so this can't itself fail —
          // if it somehow ever did, that's a build problem, not a runtime one.
          setState({ status: STATUS.READY, data: fallbackData, usedFallback: true })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
