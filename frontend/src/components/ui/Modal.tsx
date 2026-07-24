import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'danger' | 'ghost'
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: ModalAction[]
}

const getActionButtonStyles = (variant?: string): string => {
  switch (variant) {
    case 'danger':
      return 'bg-danger text-white hover:opacity-88'
    case 'ghost':
      return 'border-[0.5px] border-neutral-300 text-neutral-700 hover:opacity-88'
    default: // primary
      return 'bg-navy-800 text-white hover:opacity-88'
  }
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-card max-w-[500px] w-full shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white flex items-center justify-between px-lg py-md border-b-[0.5px] border-neutral-300">
            <h2 className="text-h3 font-semibold text-neutral-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-0 hover:opacity-88 transition-opacity"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-700" />
            </button>
          </div>

          <div className="px-lg py-lg">
            {children}
          </div>

          {actions && actions.length > 0 && (
            <div className="border-t-[0.5px] border-neutral-300 px-lg py-md flex gap-md justify-end">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`h-10 px-4 rounded-btn font-medium text-body-sm transition-all active:scale-97 ${getActionButtonStyles(
                    action.variant
                  )}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

Modal.displayName = 'Modal'
