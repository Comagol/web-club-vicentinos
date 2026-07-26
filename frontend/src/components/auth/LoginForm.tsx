import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthForm } from '../../hooks/useAuthForm'
import { Button } from '../ui/Button'
import { FormInput } from '../ui/FormInput'
import { Banner } from '../ui/Banner'

interface LoginFormProps {
  onForgotPassword: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const { formData, errors, handleChange, validate, setIsSubmitting } = useAuthForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      // Error is handled by the auth context and displayed via the error prop
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[500px]">
      {error && (
        <Banner type="danger" className="mb-lg">
          {error}
        </Banner>
      )}

      <form onSubmit={handleSubmit} className="space-y-lg">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <div>
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            placeholder="••••••"
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-body-sm text-navy-800 hover:opacity-75 transition-opacity mt-sm"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p className="text-body-sm text-neutral-400 text-center mt-xl">
        ¿No tienes cuenta? Contacta al club
      </p>
    </div>
  )
}
