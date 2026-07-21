import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export const metadata: Metadata = {
  title: 'BronEv - Günlük Kirayə Evlər | Azərbaycan',
  description:
    'Azərbaycanda ən yaxşı günlük kirayə villa və mənzil seçimləri. Bakı, Qəbələ, Şəki və digər şəhərlərdə premium kirayə evlər. Etibarlı və sürətli xidmət.',
  keywords:
    'günlük kirayə, kirayə ev, villa, mənzil, Bakı, Qəbələ, Şəki, bron ev, bronev, kirayə evlər',
  authors: [{ name: 'BronEv' }],
  openGraph: {
    title: 'BronEv - Günlük Kirayə Evlər',
    description: 'Azərbaycanda ən yaxşı günlük kirayə evlər',
    url: 'https://bron-ev.com',
    siteName: 'BronEv',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  verification: {
    google: '_4D6yf4LpBdq7xWHEprgBh8zjdMyjpeonvqQcyeUqNk',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B7355',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google AdSense */}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
