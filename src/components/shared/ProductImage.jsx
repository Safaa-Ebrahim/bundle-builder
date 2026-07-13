import { useState } from 'react'

export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-surface text-text-muted text-[10px] uppercase tracking-wide rounded-md ${className}`}
        aria-hidden="true"
      >
        {alt?.slice(0, 1) ?? '?'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain rounded-md ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
