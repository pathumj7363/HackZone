import React from 'react'
import cn from '../../utils/cn'

export default function TextArea({
  id,
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  required,
  rows = 4,
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className={cn('hz-field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="hz-label">
          {label}
          {required && <span className="hz-field-required"> *</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={cn('hz-textarea', error && 'hz-input--error', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
        }
        required={required}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="hz-field-error" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-hint`} className="hz-field-hint">
          {helperText}
        </p>
      )}
    </div>
  )
}
