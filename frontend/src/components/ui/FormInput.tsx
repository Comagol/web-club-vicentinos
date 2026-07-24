import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, hint, error, className = '', ...props }, ref) => {
    const hasError = !!error

    return (
      <div className="w-full">
        {label && (
          <label className="block text-label text-neutral-700 mb-md">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`w-full h-[38px] px-3 border-[0.5px] rounded-btn text-body font-normal transition-all duration-150 ${
            hasError
              ? 'border-danger focus:border-danger focus:shadow-focus-danger'
              : 'border-neutral-300 focus:border-navy-800 focus:shadow-focus-navy'
          } placeholder-neutral-500 ${className}`}
          {...props}
        />

        {error && (
          <p className="text-caption text-danger mt-sm">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="text-caption text-neutral-500 mt-sm">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
