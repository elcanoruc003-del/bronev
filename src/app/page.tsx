import MobileHeader from '@/components/MobileHeader';
import SearchFilters from '@/components/SearchFilters';
import MobilePropertyList from '@/components/MobilePropertyList';
import MobileFooter from '@/components/MobileFooter';

export const dynamic = 'force-dynamic';

export default function Page() {
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
  };

  return (
    <main className="min-h-screen relative">
      <MobileHeader />
      <SearchFilters onSearch={handleSearch} />
      <MobilePropertyList />
      <MobileFooter />
    </main>
  );
}
