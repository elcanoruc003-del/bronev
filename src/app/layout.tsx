import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BronEv - Günlük Kirayə Evlər | Azərbaycan',
  description: 'Azərbaycanda ən yaxşı günlük kirayə villa və mənzil seçimləri. Bakı, Qəbələ, Şəki və digər şəhərlərdə premium kirayə evlər. Etibarlı və sürətli xidmət.',
  keywords: 'günlük kirayə, kirayə ev, villa, mənzil, Bakı, Qəbələ, Şəki, bron ev, bronev, kirayə evlər',
  authors: [{ name: 'BronEv' }],
  openGraph: {
    title: 'BronEv - Günlük Kirayə Evlər',
    description: 'Azərbaycanda ən yaxşı günlük kirayə evlər',
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
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8507882047909859" crossOrigin="anonymous"></script>
        {/* Preload Premium Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
