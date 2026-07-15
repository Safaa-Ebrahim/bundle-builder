import { FaCaretDown } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import ProductCard from './ProductCard'
import { STEP_ICONS } from '../../../../config/stepIcons'

export default function BuilderStep({
  step,
  totalSteps,
  products,
  isOpen,
  selectedCount,
  activeVariant,
  quantities,
  onToggle,
  onSelectVariant,
  onSetQty,
  onNext,
  isLast,
  nextStepTitle,
}) {
  const Icon = STEP_ICONS[step.icon]

  return (
    <div className={`rounded-xl border border-border bg-bg overflow-hidden ${isOpen ? 'bg-brand-bg' : ''
      }`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex flex-col gap-2 p-0 text-left transition-colors"
      >
        <div className="px-4 pb-2 pt-3 text-xs uppercase tracking-wide text-text-muted font-medium border-b border-text-secondary">
          Step {step?.stepNumber} of {totalSteps}
        </div>
        <div className="flex items-center justify-between gap-3 min-w-0 px-4 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-text-primary shrink-0">
              {Icon && <Icon className="w-5 h-5 lg:w-7 lg:h-7 xl:w-[30px] xl:h-[30px] text-icon-muted" />}
            </span>
            <span className="text-[18px] lg:text-[22px] xl:text-[28px] font-semibold text-text-primary truncate">
              {step?.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand font-medium shrink-0">
            {selectedCount > 0 && <span>{selectedCount} selected</span>}
            <FaCaretDown
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              size={16}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className='px-4 pb-5 pt-3 flex flex-col gap-3'>
          {products?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-card">
                <FiPackage className="w-6 h-6 text-brand" />
              </div>
              <span className="text-sm text-text-secondary text-center">
                No options available for this step right now.
              </span>
            </div>
          ) : (
            <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  activeVariantId={activeVariant[product.id]}
                  quantities={quantities}
                  onSelectVariant={onSelectVariant}
                  onSetQty={onSetQty}
                  showQuantity={step.id !== 'plan'}
                />
              ))}
            </div>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={onNext}
              className="self-center flex mt-1 px-4 py-2 rounded-lg border border-brand text-brand text-lg font-semibold hover:border-brand-hover transition-colors"
            >
              Next: {nextStepTitle}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
