import { FiMinus, FiPlus } from 'react-icons/fi'

export default function QuantityStepper({ qty, onChange, disabled = false, max = null, className = '' }) {
  const atMax = max != null && qty >= max
  const buttonStyle = `w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary bg-surface disabled:border-2 disabled:border-border disabled:text-border-strong disabled:bg-white disabled:cursor-not-allowed hover:border-brand transition-colors ${className}`

  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || qty <= 0}
        onClick={() => onChange(qty - 1)}
        className={buttonStyle}
      >
        <FiMinus size={14} />
      </button>
      <span className="w-4 text-center text-sm font-medium text-text-primary">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        onClick={() => onChange(qty + 1)}
        title={atMax ? 'No more in stock' : undefined}
        className={buttonStyle}
      >
        <FiPlus size={14} />
      </button>
    </div>
  )
}
