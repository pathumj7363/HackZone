import React from 'react'
import cn from '../../utils/cn'

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('hz-empty', className)}>
      {icon && <div className="hz-empty__icon" aria-hidden="true">{icon}</div>}
      {title && <h3 className="hz-empty__title">{title}</h3>}
      {description && <p className="hz-empty__description">{description}</p>}
      {action && <div className="hz-empty__action">{action}</div>}
    </div>
  )
}
