'use client'

import { InputHTMLAttributes, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon
  rightElement?: ReactNode
}

export default function FormInput({ icon: Icon, rightElement, className = '', ...props }: FormInputProps) {
  return (
    <div className="relative w-full">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-horta-medium pointer-events-none" />
      <input
        {...props}
        className={`w-full h-14 rounded-input border border-input-border bg-white pl-12 pr-12 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-horta-medium focus:ring-2 focus:ring-horta-medium/15 transition-colors ${className}`}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  )
}
