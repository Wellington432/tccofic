'use client'

import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import GoogleButton from '@/components/GoogleButton'

interface GoogleSignInButtonProps {
  label: string
  onSuccess: (credential: string) => void
  onError?: () => void
}

export default function GoogleSignInButton({ label, onSuccess, onError }: GoogleSignInButtonProps) {
  return (
    <div className="relative w-full">
      <GoogleButton label={label} />
      <div className="absolute inset-0 opacity-0 overflow-hidden [&>div]:w-full [&_iframe]:!w-full">
        <GoogleLogin
          width={420}
          onSuccess={(credentialResponse: CredentialResponse) => {
            if (credentialResponse.credential) {
              onSuccess(credentialResponse.credential)
            } else {
              onError?.()
            }
          }}
          onError={() => onError?.()}
        />
      </div>
    </div>
  )
}
