import ProductImage from '../../../shared/ProductImage'
import VariantSelector from './VariantSelector'
import QuantityStepper from '../../../shared/QuantityStepper'
import { formatPrice, getSaleInfo } from '../../../../utils/pricing'
import { splitHighlightTitle } from '../../../../utils/text'

export default function ProductCard({
  product,
  activeVariantId,
  quantities,
  onSelectVariant,
  onSetQty,
  showQuantity = true,
}) {
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0]
  const qty = quantities[activeVariant.id] ?? 0
  const selected = qty > 0
  const { finalPrice: priceAfterDiscount, onSale } = getSaleInfo(activeVariant.price, product.discount)
  const [firstWord, restWords] = splitHighlightTitle(product.title)

  return (
    <div
      className={`relative flex flex-row xl:flex-col gap-4 p-4 rounded-xl  bg-bg transition-colors ${selected && 'border-2 border-brand/70'
        }`}
    >
      {/* image and discout */}
      <div className="relative">
        {product?.discount > 0 && (
          <span className="absolute top-1 left-1 sm:-top-2.5 sm:left-0 bg-brand text-white text-[10px] xl:text-xs font-semibold px-1.5 xl:px-2 py-0.5 rounded-full z-10 whitespace-nowrap">
            Save {product?.discount}%
          </span>
        )}
        <ProductImage
          key={activeVariant?.id}
          src={activeVariant?.image}
          alt={product?.title}
          className="w-25 h-25 xl:w-full shrink-0"
          bg={!product.transparentImage}
        />
      </div>
      <div className='flex flex-col gap-2.5'>
        {/* title, discription */}
        <div className='flex flex-col gap-2'>
          <h3 className="text-sm font-semibold text-text-primary">
            {product.highlightTitle ? (
              <>
                <span className="text-text-primary">{firstWord}</span>{' '}
                <span className="text-brand">{restWords}</span>
              </>
            ) : (
              product.title
            )}
          </h3>
          <p className="text-xs text-text-secondary/75 font-medium">
            {product?.description}{' '}
            {product?.learnMoreUrl && (
              <a href={product.learnMoreUrl} className="text-link underline underline-offset-2">
                Learn More
              </a>
            )}
          </p>
        </div>
        {/* clors */}
        <VariantSelector
          variants={product.variants}
          activeVariantId={activeVariant.id}
          onSelect={(variantId) => onSelectVariant(product.id, variantId)}
        />
        {/* quantity, price */}
        <div className="flex items-center justify-between gap-2">
          {showQuantity ? (
            <QuantityStepper
              qty={qty}
              max={activeVariant.stock}
              onChange={(next) => onSetQty(activeVariant.id, next)}
            />
          ) : (
            <button
              type="button"
              onClick={() => onSetQty(activeVariant.id, selected ? 0 : 1)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${selected
                  ? 'bg-brand text-white'
                  : 'bg-surface text-text-primary hover:border-brand border border-border'
                }`}
            >
              {selected ? 'Selected' : 'Select'}
            </button>
          )}
          <div className="text-right">
            {onSale && (
              <p className="text-sale line-through">
                {formatPrice(activeVariant.price)}
              </p>
            )}
            <p className="text-charcoal-gray">
              {priceAfterDiscount === 0 ? 'FREE' : formatPrice(priceAfterDiscount)}
              {product.billingSuffix}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
