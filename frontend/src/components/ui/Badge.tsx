import React from 'react'

type BadgeVariant = 'active' | 'inactive' | 'pending' | 'info' | 'gray' | 'rugby' | 'hockey'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant
  children: React.ReactNode
}

const badgeStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-success-light',
    text: 'text-success-text',
    dot: 'bg-success-text',
  },
  inactive: {
    bg: 'bg-danger-light',
    text: 'text-danger-text',
    dot: 'bg-danger-text',
  },
  pending: {
    bg: 'bg-warning-light',
    text: 'text-warning-text',
    dot: 'bg-warning-text',
  },
  info: {
    bg: 'bg-info-light',
    text: 'text-info-text',
    dot: 'bg-info-text',
  },
  gray: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-500',
    dot: 'bg-neutral-500',
  },
  rugby: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-700',
  },
  hockey: {
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    dot: 'bg-pink-700',
  },
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, className = '', children, ...props }, ref) => {
    const styles = badgeStyles[variant]

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-xs px-[10px] py-xs rounded-pill font-medium text-caption ${styles.bg} ${styles.text} ${className}`}
        {...props}
      >
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
