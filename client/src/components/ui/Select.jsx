import React from 'react'
import cn from '../../utils/cn'

export default function Select({
  id,
  label,
  error,
  helperText,
  options = [],
  placeholder,
  className,
  wrapperClassName,
  required,
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
      <select
        id={inputId}
        className={cn('hz-select', error && 'hz-input--error', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
        }
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value
          const labelText = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          )
        })}
      </select>
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
