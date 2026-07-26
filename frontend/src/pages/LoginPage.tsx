import React, { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal'

export const LoginPage: React.FC = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const handleOpenForgotPassword = () => {
    setIsForgotPasswordOpen(true)
  }

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordOpen(false)
  }

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
            Portal de socios
          </p>
        </div>

        <LoginForm onForgotPassword={handleOpenForgotPassword} />

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={handleCloseForgotPassword}
        />
      </div>
    </div>
  )
}
