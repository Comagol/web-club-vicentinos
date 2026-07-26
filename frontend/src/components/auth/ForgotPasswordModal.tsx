import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAuthForm } from '../../hooks/useAuthForm'
import { Modal } from '../ui/Modal'
import { FormInput } from '../ui/FormInput'
import { Banner } from '../ui/Banner'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { requestPasswordReset } = useAuth()
  const { formData, errors, handleChange, validate, setIsSubmitting } = useAuthForm()
  const [isSubmitting, setIsSubmittingLocal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!validate()) {
      return
    }

    setIsSubmittingLocal(true)
    setIsSubmitting(true)

    try {
      const result = await requestPasswordReset(formData.email)

      if (result.success) {
        setSuccessMessage('Enlace de recuperación enviado a tu email')
        setTimeout(() => {
          onClose()
          setSuccessMessage('')
        }, 3000)
      } else {
        setErrorMessage(result.error || 'Error al enviar el enlace')
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al enviar el enlace')
    } finally {
      setIsSubmittingLocal(false)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const actions = [
    {
      label: 'Cancelar',
      onClick: handleCancel,
      variant: 'ghost' as const,
    },
    {
      label: 'Enviar enlace',
      onClick: handleSubmit,
      variant: 'primary' as const,
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recuperar contraseña"
      actions={actions}
    >
      <div className="space-y-md">
        {successMessage && (
          <Banner type="success">
            {successMessage}
          </Banner>
        )}

        {errorMessage && (
          <Banner type="danger">
            {errorMessage}
          </Banner>
        )}

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <p className="text-body-sm text-neutral-500">
          Enviaremos un enlace a tu email para recuperar tu contraseña.
        </p>
      </div>
    </Modal>
  )
}
