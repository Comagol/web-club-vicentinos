import React from 'react'
import { X } from 'lucide-react'

type BannerType = 'success' | 'danger' | 'warning' | 'info'

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  type: BannerType
  onClose?: () => void
  children: React.ReactNode
}

const bannerStyles: Record<BannerType, { bg: string; text: string; border: string }> = {
  success: {
    bg: 'bg-success-bg',
    text: 'text-success-text',
    border: 'border-success-border',
  },
  danger: {
    bg: 'bg-danger-bg',
    text: 'text-danger-text',
    border: 'border-danger-border',
  },
  warning: {
    bg: 'bg-warning-bg',
    text: 'text-warning-text',
    border: 'border-warning-border',
  },
  info: {
    bg: 'bg-info-bg',
    text: 'text-info-text',
    border: 'border-info-border',
  },
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ type, onClose, className = '', children, ...props }, ref) => {
    const styles = bannerStyles[type]

    return (
      <div
        ref={ref}
        className={`px-[14px] py-[10px] rounded-btn border-[0.5px] flex items-start justify-between gap-md ${styles.bg} ${styles.text} ${styles.border} ${className}`}
        {...props}
      >
        <div className="text-label flex-1">
          {children}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-0 hover:opacity-88 transition-opacity"
            aria-label="Close banner"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }
)

Banner.displayName = 'Banner'
