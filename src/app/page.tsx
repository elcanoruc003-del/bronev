import MobileHeader from '@/components/MobileHeader'
import MobilePropertyList from '@/components/MobilePropertyList'
import MobileFooter from '@/components/MobileFooter'

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      <MobilePropertyList />
      <MobileFooter />
    </main>
  )
}
