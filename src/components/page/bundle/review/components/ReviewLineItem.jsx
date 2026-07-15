import ProductImage from '../../../../shared/ProductImage'
import QuantityStepper from '../../../../shared/QuantityStepper'
import { formatPrice, getPriceAfterDiscount } from '../../../../../utils/pricing'

export default function ReviewLineItem({ product, variant, qty, onSetQty, showQuantity = true }) {
  const priceAfterDiscount = getPriceAfterDiscount(variant.price, product.discount)
  const lineTotal = priceAfterDiscount * qty
  const compareAtTotal = variant.price * qty
  const onSale = priceAfterDiscount < variant.price
  const [firstWord, ...restWords] = product.title.split(' ')

  return (
    <div className="flex items-center gap-3">
      <ProductImage
        src={variant.image}
        alt={product.title}
        className="w-10 h-10 shrink-0"
        bg={!product?.transparentImage}
      />
      <div className="flex-1 min-w-0 text-left">
        <div className="text-xs lg:text-sm xl:text-lg text-text-primary truncate">
          {product?.highlightTitle ? (
            <>
              <span className="font-bold text-text-primary">{firstWord}</span>{' '}
              <span className="font-bold text-brand">{restWords.join(' ')}</span>
            </>
          ) : (
            product?.title
          )}
          {variant.label ? ` (${variant.label})` : ''}
        </div>
      </div>
      {showQuantity && (
        <QuantityStepper
          qty={qty}
          max={variant.stock}
          onChange={(next) => onSetQty(variant.id, next)}
          className='bg-white text-charcoal-gray'
        />
      )}
      <div className="text-right flex flex-col xl:flex-row xl:gap-2.5">
        {onSale && (
          <div className="text-xs lg:text-sm xl:text-base text-icon-muted line-through font-medium">{formatPrice(compareAtTotal)}</div>
        )}
        <div className="text-xs lg:text-sm xl:text-base font-semibold text-brand">
          {lineTotal === 0 ? 'FREE' : formatPrice(lineTotal)}
        </div>
      </div>
    </div>
  )
}
