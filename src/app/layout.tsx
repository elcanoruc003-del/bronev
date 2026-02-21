import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BronEv - Premium Daşınmaz Əmlak | Bakı',
  description: 'Bakıda ən yaxşı villa, mənzil və əmlak seçimləri. Professional daşınmaz əmlak xidməti. Etibarlı və sürətli xidmət.',
  keywords: 'daşınmaz əmlak, ev almaq, villa, mənzil, Bakı, əmlak, bron ev, bronev, real estate baku',
  authors: [{ name: 'BronEv' }],
  openGraph: {
    title: 'BronEv - Premium Daşınmaz Əmlak',
    description: 'Bakıda ən yaxşı əmlak seçimləri',
    url: 'https://bron-ev.com',
    siteName: 'BronEv',
    locale: 'az_AZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        {/* Preload Premium Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
