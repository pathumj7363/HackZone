import React from 'react'
import cn from '../../utils/cn'

export default function PageHeader({ title, subtitle, action, className }) {
  return (
    <header className={cn('hz-page-header', className)}>
      <div className="hz-page-header__text">
        {title && <h1 className="hz-page-header__title">{title}</h1>}
        {subtitle && <p className="hz-page-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="hz-page-header__action">{action}</div>}
    </header>
  )
}

