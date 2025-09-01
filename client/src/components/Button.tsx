import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}) => {
  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-orange-600 text-white hover:bg-orange-700 disabled:hover:bg-orange-600',
    secondary:
      'bg-orange-100 text-orange-800 hover:bg-orange-200 disabled:hover:bg-orange-100',
    outline:
      'border border-orange-300 text-orange-700 hover:bg-orange-50 disabled:hover:bg-transparent',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button
