'use client'

import { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export default function PrimaryButton({ loading, children, disabled, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`w-full h-14 rounded-input bg-horta-dark text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#0f4023] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
