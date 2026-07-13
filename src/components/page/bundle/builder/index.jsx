import React from 'react'
import BuilderStep from './components/BuilderStep'

const Builder = ({ data, bundle }) => {
  const { steps, products } = data
  const {
    openStep,
    activeVariant,
    quantities,
    toggleStep,
    selectVariant,
    setQty,
    goToNextStep,
    stepSelectedCount,
  } = bundle

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, idx) => {
        const stepProducts = step.productIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean)
        const isLast = idx === steps.length - 1

        return (
          <BuilderStep
            key={step.id}
            step={step}
            totalSteps={steps.length}
            products={stepProducts}
            isOpen={openStep === step.id}
            selectedCount={stepSelectedCount(step)}
            activeVariant={activeVariant}
            quantities={quantities}
            onToggle={() => toggleStep(step.id)}
            onSelectVariant={selectVariant}
            onSetQty={setQty}
            onNext={() => goToNextStep(step.id)}
            isLast={isLast}
            nextStepTitle={steps[idx + 1]?.title}
          />
        )
      })}
    </div>
  )
}

export default Builder