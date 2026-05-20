import React from 'react'
import cn from '../../utils/cn'

export default function Card({
  children,
  padding = true,
  hover = false,
  className,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={cn(
        'hz-card',
        padding && 'hz-card--padding',
        hover && 'hz-card--hover',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
