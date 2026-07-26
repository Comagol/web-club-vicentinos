import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthForm } from '../../hooks/useAuthForm'
import { Button } from '../ui/Button'
import { FormInput } from '../ui/FormInput'
import { Banner } from '../ui/Banner'

interface PasswordResetFormProps {
  token: string | null
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ token }) => {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { formData, errors, handleChange, setErrors } = useAuthForm({
    password: '',
    passwordConfirm: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect to login after successful password reset
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage('Invalid reset link')
      return
    }

    // Custom validation for password reset form
    const newErrors: { [key: string]: string } = {}

    if (!formData.password) {
      newErrors.password = 'La nueva contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Confirmar contraseña es requerido'
    } else if (formData.passwordConfirm !== formData.password) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(token, formData.password)
      if (result.success) {
        setSuccessMessage('Tu contraseña ha sido restablecida exitosamente. Redirigiendo a login...')
      } else {
        setErrorMessage(result.error || 'Failed to reset password')
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-[500px]">
        <Banner type="danger" className="mb-lg">
          Invalid reset link. Please request a new password reset.
        </Banner>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[500px]">
      {successMessage && (
        <Banner type="success" className="mb-lg">
          {successMessage}
        </Banner>
      )}

      {errorMessage && (
        <Banner type="danger" className="mb-lg">
          {errorMessage}
        </Banner>
      )}

      <form onSubmit={handleSubmit} className="space-y-lg">
        <FormInput
          label="Nueva contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
          placeholder="••••••"
          autoComplete="new-password"
        />

        <FormInput
          label="Confirmar contraseña"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
          disabled={isLoading}
          placeholder="••••••"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !token}
        >
          {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </Button>
      </form>
    </div>
  )
}
