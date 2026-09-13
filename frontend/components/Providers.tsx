'use client'

import { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
      <AuthProvider>
        <CartProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </CartProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={4000} />
    </GoogleOAuthProvider>
  )
}
