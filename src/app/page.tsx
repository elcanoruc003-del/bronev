'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import TrustBadges from '@/components/TrustBadges'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProperties />
      <TrustBadges />
      <ContactSection />
      <Footer />
    </main>
  )
}
