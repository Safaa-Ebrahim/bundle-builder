import { useState } from 'react'

function VariantSwatch({ variant }) {
  const [failed, setFailed] = useState(false)

  if (variant.image && !failed) {
    return (
      <img
        src={variant.image}
        alt=""
        className="w-5 h-5 object-cover"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className="w-3.5 h-3.5 rounded-full border border-black/10"
      style={{ background: variant.swatch ?? '#ccc' }}
    />
  )
}

export default function VariantSelector({ variants, activeVariantId, onSelect }) {
  const hasLabels = variants.length > 1 && variants.some((v) => v.label)
  if (!hasLabels) return null

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant?.id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xs border text-xs transition-colors ${isActive
              ? 'border-variant-selected-border bg-variant-selected-bg text-text-primary font-medium'
              : 'border-border text-text-secondary hover:border-brand'
              }`}
          >
            <VariantSwatch variant={variant} />
            {variant.label}
          </button>
        )
      })}
    </div>
  )
}
