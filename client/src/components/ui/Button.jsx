import React from 'react'
import cn from '../../utils/cn'

const VARIANTS = {
  primary: 'hz-btn-primary',
  outline: 'hz-btn-outline',
  ghost: 'hz-btn-ghost',
  danger: 'hz-btn-danger',
}

const SIZES = {
  sm: 'hz-btn--sm',
  md: '',
  lg: 'hz-btn--lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn('hz-btn', VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
