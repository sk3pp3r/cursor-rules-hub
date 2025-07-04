import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import SessionProvider from '@/contexts/SessionProvider'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Cursor Rules Hub - AI-Powered IDE Rules Repository',
  description: 'Discover, share, and manage Cursor IDE rules and configurations. A modern platform for AI-enhanced coding standards and best practices.',
  keywords: 'cursor, ide, rules, coding, ai, configuration, programming, development',
  authors: [{ name: 'Cursor Rules Hub' }],
  creator: 'Cursor Rules Hub',
  publisher: 'Cursor Rules Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cursor-rules-hub.haimc.xyz'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Cursor Rules Hub - AI-Powered IDE Rules Repository',
    description: 'Discover, share, and manage Cursor IDE rules and configurations',
    url: 'https://cursor-rules-hub.haimc.xyz',
    siteName: 'Cursor Rules Hub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cursor Rules Hub'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursor Rules Hub - AI-Powered IDE Rules Repository',
    description: 'Discover, share, and manage Cursor IDE rules and configurations',
    images: ['/twitter-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e293b' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-dark-950 text-white`}>
        <SessionProvider>
          <FavoritesProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="matrix-bg fixed inset-0 -z-10" />
              <div className="floating-particles fixed inset-0 -z-10" />
              
              <Header />
              
              <main className="flex-1">
                {children}
              </main>
              
              <Footer />
              
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'rgb(15 23 42)',
                    color: 'rgb(241 245 249)',
                    border: '1px solid rgb(51 65 85)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: 'rgb(34 197 94)',
                      secondary: 'rgb(15 23 42)',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'rgb(239 68 68)',
                      secondary: 'rgb(15 23 42)',
                    },
                  },
                }}
              />
            </div>
          </FavoritesProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
} 