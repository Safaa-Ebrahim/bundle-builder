import { useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import ReviewLineItem from './components/ReviewLineItem'
import ConfirmDialog from '../../shared/ConfirmDialog'
import Toast from '../../shared/Toast'
import { formatPrice, getMonthlyFinancingEstimate } from '../../../utils/pricing'
import badge from '../../../../assets/satisfaction_badge.svg'
const CATEGORY_ORDER = ['Cameras', 'Sensors', 'Accessories', 'Plan']

export default function Review({ data, bundle }) {
  const { groupedLines, reviewLines, totals, setQty, saveForLater, savedNotice, checkout, checkedOut } =
    bundle
  const { shipping } = data
  const monthlyEstimate = getMonthlyFinancingEstimate(totals?.activeTotal)
  const [confirmingCheckout, setConfirmingCheckout] = useState(false)
  const isEmpty = reviewLines.length === 0

  if (isEmpty) {
    return (
      <div className="rounded-[10px] bg-brand-bg p-5 xl:p-10 text-left">
        <div className="text-xs uppercase tracking-wide text-text-muted xl:hidden">Review</div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl xl:text-2xl font-semibold text-text-secondary">Your security system</h2>
          <p className="text-xs lg:text-s xl:text-base text-text-secondary/75">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 py-14 mt-3 border-t border-border-strong">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-card">
            <FiShoppingCart className="w-7 h-7 text-brand" />
          </div>
          <div className="flex flex-col items-center gap-1 max-w-xs">
            <span className="text-base font-semibold text-text-primary">Your system is empty</span>
            <span className="text-sm text-text-secondary text-center">
              Add cameras, sensors, or accessories to start building your protection plan.
            </span>
          </div>
        </div>

        <Toast show={checkedOut} message="Order placed! Thanks for your purchase." />
      </div>
    )
  }

  return (
    <div className="rounded-[10px] bg-brand-bg p-5 xl:p-10 text-left">
      <div className="text-xs uppercase tracking-wide text-text-muted xl:hidden">Review</div>

      <div className='flex flex-col xl:flex-row gap-3 xl:gap-12 xl:justify-between'>
        <div className='flex flex-col gap-2.5'>
          {/* title, discription */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl xl:text-2xl font-semibold text-text-secondary">Your security system</h2>
            <p className="text-xs lg:text-s xl:text-base text-text-secondary/75">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>
          <div className="divide-y divide-border-strong border-t border-border-strong">
            {/* products */}
            {CATEGORY_ORDER.filter((cat) => groupedLines.has(cat)).map((category) => (
              <div key={category} className="py-3 space-y-2">
                <div className="text-xs uppercase tracking-wide text-blue-gray">
                  {category}
                </div>
                {/* items */}
                <div className="space-y-3">
                  {groupedLines.get(category).map(({ product, variant, qty }) => (
                    <ReviewLineItem
                      key={variant.id}
                      product={product}
                      variant={variant}
                      qty={qty}
                      onSetQty={setQty}
                      showQuantity={category !== 'Plan'}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* plan */}

            {/* shipping */}
            <div className="pt-3">
              <ReviewLineItem
                product={{ title: shipping.label, discount: shipping.discount }}
                variant={{ id: 'shipping', image: shipping.image, price: shipping.price }}
                qty={1}
                showQuantity={false}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>

          <div className='flex items-center justify-between xl:flex-col xl:justify-start xl:gap-4 xl:items-start'>
            <div className='flex items-center gap-6'>
              <img src={badge} className='object-contain w-25 h-25' />
              <div className='hidden xl:flex flex-col text-lg text-text-secondary h-20 justify-between'>
                <span className='font-semibold'>
                  30-day hassle-free returns
                </span>
                <span>
                  If you're not totally in love with the product, we will refund you 100%.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-end xl:items-start xl:w-full">
              <span className="w-fit text-xs xl:text-base font-medium bg-brand text-white rounded px-2 py-1">
                as low as {formatPrice(monthlyEstimate)}/mo
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-icon-muted line-through text-lg xl:text-xl font-medium">
                  {formatPrice(totals?.compareAtTotal)}
                </span>
                <span className="text-xl xl:text-2xl font-bold text-brand">
                  {formatPrice(totals?.activeTotal)}
                </span>
              </div>
            </div>

          </div>


          <div className='space-y-1 mt-3'>

            {/* saving price */}
            {totals?.savings > 0 && (
              <div className="text-variant-selected-border text-xs xl:text-sm font-semibold text-center">
                Congrats! You're saving {formatPrice(totals?.savings)} on your security bundle!
              </div>
            )}
            <button
              type="button"
              onClick={() => setConfirmingCheckout(true)}
              className="w-full py-3 rounded-lg bg-brand text-white font-bold hover:bg-brand-hover transition-colors"
            >
              {checkedOut ? 'Order placed! 🎉' : 'Checkout'}
            </button>
          </div>

          <button
            type="button"
            onClick={saveForLater}
            className="w-full text-center text-sm text-text-muted underline underline-offset"
          >
            {savedNotice ? 'Saved!' : 'Save my system for later'}
          </button>
        </div>

      </div>

      <ConfirmDialog
        open={confirmingCheckout}
        title="Confirm checkout"
        description="Are you sure you want to check out with this system? This will clear your saved configuration and start a new one."
        confirmLabel="Checkout"
        cancelLabel="Cancel"
        onCancel={() => setConfirmingCheckout(false)}
        onConfirm={() => {
          setConfirmingCheckout(false)
          checkout()
        }}
      />

      <Toast show={checkedOut} message="Order placed! Thanks for your purchase." />
    </div>
  )
}
