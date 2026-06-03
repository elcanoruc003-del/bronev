import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'BronEv - Günlük Kirayə Evlər | Azərbaycan',
  description:
    'Azərbaycanda ən yaxşı günlük kirayə villa və mənzil seçimləri. Bakı, Qəbələ, Şəki və digər şəhərlərdə premium kirayə evlər. Etibarlı və sürətli xidmət.',
  openGraph: {
    title: 'BronEv - Günlük Kirayə Evlər',
    description: 'Azərbaycanda ən yaxşı günlük kirayə evlər',
    url: 'https://bron-ev.com',
    siteName: 'BronEv',
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function Page() {
  return <HomeClient />;
}
