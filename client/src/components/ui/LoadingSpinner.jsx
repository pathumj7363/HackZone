import React from 'react'
import cn from '../../utils/cn'

const SIZES = {
  sm: 'hz-spinner--sm',
  md: 'hz-spinner--md',
  lg: 'hz-spinner--lg',
}

export default function LoadingSpinner({
  size = 'md',
  label = 'Loading…',
  className,
  centered = false,
}) {
  return (
    <div
      className={cn('hz-spinner-wrap', centered && 'hz-spinner-wrap--centered', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className={cn('hz-spinner', SIZES[size])} aria-hidden="true" />
      {label && <span className="hz-spinner-label">{label}</span>}
    </div>
  )
}
