import React from 'react'
import cn from '../../utils/cn'

const VARIANTS = {
  primary: 'hz-badge--primary',
  success: 'hz-badge--success',
  warning: 'hz-badge--warning',
  danger: 'hz-badge--danger',
  neutral: 'hz-badge--neutral',
}

export default function Badge({ children, variant = 'neutral', className, ...props }) {
  return (
    <span className={cn('hz-badge', VARIANTS[variant], className)} {...props}>
      {children}
    </span>
  )
}
