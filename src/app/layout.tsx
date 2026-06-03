import type { Metadata } from 'next';
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
    locale: 'az_AZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B7355" />

        {/* Google Analytics — only if GA_ID is configured */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Google AdSense — only if configured */}
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
