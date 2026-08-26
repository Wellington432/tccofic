import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'FeiraEtec — Produtos da Unidade Rural',
  description: 'Produtos frescos direto da Unidade Rural da ETEC Jales.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans bg-bg-app text-ink-800 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
