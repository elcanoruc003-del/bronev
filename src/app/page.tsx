import MobileHeader from '@/components/MobileHeader'
import MobilePropertyList from '@/components/MobilePropertyList'
import MobileFooter from '@/components/MobileFooter'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <MobileHeader />
      <MobilePropertyList />
      <MobileFooter />
    </main>
  )
}
