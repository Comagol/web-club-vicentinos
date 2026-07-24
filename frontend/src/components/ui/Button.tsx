import React from 'react'

type ButtonVariant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-navy-800 text-white hover:opacity-90 active:scale-95 disabled:opacity-45',
  gold: 'bg-gold-500 text-navy-800 hover:opacity-90 active:scale-95 disabled:opacity-45',
  outline: 'border-[1.5px] border-navy-800 text-navy-800 bg-transparent hover:opacity-90 active:scale-95 disabled:opacity-45',
  ghost: 'border-[0.5px] border-neutral-300 text-neutral-500 bg-transparent hover:opacity-90 active:scale-95 disabled:opacity-45',
  danger: 'bg-danger text-white hover:opacity-90 active:scale-95 disabled:opacity-45',
  success: 'bg-success text-white hover:opacity-90 active:scale-95 disabled:opacity-45',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-body-sm',
  md: 'h-10 px-4.5 text-body-sm',
  lg: 'h-12 px-6 text-body',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-btn font-medium transition-all duration-150 active:scale-95'
    const variantClass = variantStyles[variant]
    const sizeClass = sizeStyles[size]

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
