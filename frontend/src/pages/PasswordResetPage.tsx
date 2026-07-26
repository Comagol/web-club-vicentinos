import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { PasswordResetForm } from '../components/auth/PasswordResetForm'

export const PasswordResetPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(to bottom, #1B3A6B, #0F2347)'
      }}
    >
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-2xl">
          <h1 className="text-h1 text-white font-bold mb-md">
            Club Vicentinos
          </h1>
          <p className="text-body text-neutral-300">
            Restablecer contraseña
          </p>
        </div>

        <PasswordResetForm token={token} />
      </div>
    </div>
  )
}
