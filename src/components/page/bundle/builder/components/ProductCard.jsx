import ProductImage from '../../../../shared/ProductImage'
import VariantSelector from './VariantSelector'
import QuantityStepper from '../../../../shared/QuantityStepper'
import { formatPrice, getPriceAfterDiscount } from '../../../../../utils/pricing'

export default function ProductCard({ product, activeVariantId, quantities, onSelectVariant, onSetQty }) {
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0]
  const qty = quantities[activeVariant.id] ?? 0
  const selected = qty > 0
  const priceAfterDiscount = getPriceAfterDiscount(activeVariant.price, product.discount)
  const onSale = priceAfterDiscount < activeVariant.price

  return (
    <div
      className={`relative flex flex-row xl:flex-col gap-4 p-4 rounded-xl  bg-bg transition-colors ${selected && 'border-2 border-brand/70'
        }`}
    >
      {/* image and discout */}
      <div className="relative">
        {product?.discount > 0 && (
          <span className="absolute -top-2.5 left-0 bg-brand text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
            Save {product?.discount}%
          </span>
        )}
        <ProductImage src={activeVariant?.image} alt={product?.title} className="w-25 h-25 xl:w-full shrink-0" />
      </div>
      <div className='flex flex-col gap-2.5'>
        {/* title, discription */}
        <div className='flex flex-col gap-2'>
          <h3 className="text-sm font-semibold text-text-primary">{product.title}</h3>
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
          <QuantityStepper
            qty={qty}
            max={activeVariant.stock}
            onChange={(next) => onSetQty(activeVariant.id, next)}
          />
          <div className="text-right">
            {onSale && (
              <p className="text-sale line-through">
                {formatPrice(activeVariant.price)}
              </p>
            )}
            <p className="text-price">
              {priceAfterDiscount === 0 ? 'FREE' : formatPrice(priceAfterDiscount)}
              {product.billingSuffix}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
