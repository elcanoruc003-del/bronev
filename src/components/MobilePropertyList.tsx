'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaUsers, FaSwimmingPool, FaMapMarkerAlt, FaWhatsapp, FaHeart, FaStar, FaChevronDown } from 'react-icons/fa';

const PAGE_SIZE = 20; // hər yükləmədə gələn ev sayı
const VIP_LIMIT = 100; // VIP evlər ayrıca göstərilir, hamısı yüklənir

interface Property {
  id: string;
  title: string;
  shortDescription: string;
  basePricePerNight: number;
  weekendPriceMultiplier?: number;
  city: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  poolType?: 'NONE' | 'REGULAR' | 'HEATED';
  featured: boolean;
  images: Array<{ url: string; alt?: string }>;
  property_images?: Array<{ url: string; alt?: string }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MobilePropertyListProps {
  filters?: Record<string, string>;
}

export default function MobilePropertyList({ filters = {} }: MobilePropertyListProps) {
  // VIP evlər (featured=true) — hamısı bir dəfə yüklənir
  const [vipProperties, setVipProperties] = useState<Property[]>([]);
  // Normal evlər — səhifə-səhifə
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter dəyişəndə sıfırla
  const filtersKey = JSON.stringify(filters);
  const prevFiltersKey = useRef(filtersKey);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(new Set(JSON.parse(saved)));
  }, []);

  // Filter dəyişdikdə sıfırla və yenidən yüklə
  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setProperties([]);
      setVipProperties([]);
      setPagination(null);
      setCurrentPage(1);
      setInitialLoading(true);
    }
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [properties]);

  const buildParams = useCallback(
    (page: number, limit: number) => {
      const p = new URLSearchParams();
      if (filters.city) p.append('city', filters.city);
      if (filters.guests) p.append('guests', filters.guests);
      if (filters.bedrooms) p.append('bedrooms', filters.bedrooms);
      if (filters.minPrice) p.append('minPrice', filters.minPrice);
      if (filters.maxPrice) p.append('maxPrice', filters.maxPrice);
      if (filters.poolType) p.append('poolType', filters.poolType);
      if (filters.propertyType) p.append('type', filters.propertyType);
      p.append('page', String(page));
      p.append('limit', String(limit));
      return p.toString();
    },
    [filters]
  );

  async function loadPage(page: number, reset = false) {
    try {
      if (page === 1) setInitialLoading(true);
      else setLoadingMore(true);

      // Birinci yükləmədə həm VIP (featured), həm normal evləri al
      if (page === 1) {
        // VIP evlər — featured=true, limit=VIP_LIMIT
        const vipParams = buildParams(1, VIP_LIMIT);
        // Normal evlər — ilk səhifə
        const normalParams = buildParams(1, PAGE_SIZE);

        const [vipRes, normalRes] = await Promise.all([
          fetch(`/api/properties?${vipParams}&featured=true`),
          fetch(`/api/properties?${normalParams}`),
        ]);

        const [vipData, normalData] = await Promise.all([
          vipRes.json(),
          normalRes.json(),
        ]);

        const vip: Property[] = (vipData.properties || []).filter((p: Property) => p.featured);
        const all: Property[] = normalData.properties || [];
        // Normal listdən VIP-ləri çıxar (dublikat olmasın)
        const vipIds = new Set(vip.map((p) => p.id));
        const normal = all.filter((p: Property) => !vipIds.has(p.id));

        setVipProperties(vip);
        setProperties(reset ? normal : (prev) => [...prev, ...normal]);
        setPagination(normalData.pagination || null);
        setCurrentPage(1);
      } else {
        const params = buildParams(page, PAGE_SIZE);
        const res = await fetch(`/api/properties?${params}`);
        const data = await res.json();

        const incoming: Property[] = data.properties || [];
        // VIP-ləri çıxar
        const vipIds = new Set(vipProperties.map((p) => p.id));
        const normal = incoming.filter((p: Property) => !vipIds.has(p.id));

        setProperties((prev) => [...prev, ...normal]);
        setPagination(data.pagination || null);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('fetchProperties error:', err);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }

  function handleLoadMore() {
    if (!pagination || loadingMore) return;
    loadPage(currentPage + 1);
  }

  const toggleFavorite = async (id: string) => {
    try {
      const { toggleFavorite: action } = await import('@/app/actions/favorites');
      const result = await action(id);
      if (result.requiresAuth) {
        alert('Sevimlilərə əlavə etmək üçün giriş etməlisiniz');
        return;
      }
      if (result.success) {
        const next = new Set(favorites);
        result.isFavorite ? next.add(id) : next.delete(id);
        setFavorites(next);
        localStorage.setItem('favorites', JSON.stringify(Array.from(next)));
      }
    } catch {
      alert('Xəta baş verdi');
    }
  };

  // Neçə ev daha qalır
  const remaining = pagination
    ? Math.max(0, pagination.total - vipProperties.length - properties.length)
    : 0;
  const hasMore = remaining > 0;
  const totalShown = vipProperties.length + properties.length;

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (initialLoading) {
    return (
      <div className="px-3 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto mt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton rounded-xl aspect-[4/3]" />
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-2 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!initialLoading && vipProperties.length === 0 && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] flex items-center justify-center mb-5 shadow-premium">
          <FaMapMarkerAlt className="text-4xl text-[#C19A6B]" />
        </div>
        <h3 className="text-lg font-semibold text-[#2C1810] mb-2">Hazırda ev yoxdur</h3>
        <p className="text-sm text-[#8B7E74] mb-6 max-w-xs">
          Tezliklə yeni evlər əlavə ediləcək. Bizimlə əlaqədə qalın!
        </p>
        <a
          href="https://wa.me/994777670031"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center gap-2"
        >
          <FaWhatsapp className="text-lg" />
          <span>Bizimlə əlaqə</span>
        </a>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="px-3 pb-24">
      {/* ── VIP bölməsi ── */}
      {vipProperties.length > 0 && (
        <div className="mb-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm">
                <FaStar className="text-white text-sm" />
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-[#2C2416]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  VIP Evlər
                </h2>
                <p className="text-[10px] text-[#6B5D4F]">Premium seçimlər</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#8B7355]">
              {vipProperties.length} ev
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {vipProperties.map((p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                index={i}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                eager={i < 4}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Bütün evlər bölməsi ── */}
      <div className="max-w-7xl mx-auto">
        {/* Başlıq + sayaç */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-[#3E2723]">
            <span className="text-base font-bold bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              {pagination?.total ?? totalShown}
            </span>
            <span className="ml-1">ev</span>
          </p>
          {pagination && (
            <span className="text-[10px] text-[#8B7E74]">
              {totalShown} / {pagination.total} göstərilir
            </span>
          )}
        </div>

        {properties.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {properties.map((p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                index={i}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                eager={i < 4}
              />
            ))}
          </div>
        )}

        {/* ── Load More düyməsi ── */}
        {hasMore && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="
                group relative overflow-hidden
                flex items-center gap-2.5
                px-8 py-3.5 rounded-full
                bg-gradient-to-r from-[#8B7355] to-[#C19A6B]
                text-white font-semibold text-sm
                shadow-lg hover:shadow-xl
                transition-all duration-300
                active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {/* shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {loadingMore ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Yüklənir...</span>
                </>
              ) : (
                <>
                  <FaChevronDown className="text-xs" />
                  <span>Daha çox yüklə</span>
                  <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {remaining}
                  </span>
                </>
              )}
            </button>

            {/* Progress bar */}
            {pagination && (
              <div className="w-48 h-1 bg-[#E5DDD5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalShown / pagination.total) * 100)}%` }}
                />
              </div>
            )}
            <p className="text-[10px] text-[#8B7E74]">
              {totalShown} / {pagination?.total} ev göstərilir
            </p>
          </div>
        )}

        {/* Hamısı yüklənibsə */}
        {!hasMore && properties.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-[#8B7355]">Bütün evlər göstərildi</p>
            <p className="text-[10px] text-[#8B7E74]">Cəmi {pagination?.total ?? totalShown} ev</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  index,
  favorites,
  toggleFavorite,
  eager = false,
}: {
  property: Property;
  index: number;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  eager?: boolean;
}) {
  const imgSrc =
    property.images[0]?.url ||
    property.property_images?.[0]?.url ||
    '/placeholder.jpg';

  return (
    <a
      href={`/properties/${property.id}`}
      className="stagger-item scroll-reveal block"
      style={{ animationDelay: `${Math.min(index, 8) * 0.07}s` }}
    >
      <div className="card-premium tap-scale group relative">
        {/* Image */}
        <div className="card-image-container relative">
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={eager ? 'eager' : 'lazy'}
            priority={eager}
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
          />

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 right-1.5 z-10 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              {property.featured && (
                <div className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                  <FaStar className="text-[7px]" />
                  <span>VIP</span>
                </div>
              )}
              <div className="inline-flex items-center gap-0.5 bg-white/95 backdrop-blur-sm text-[9px] font-bold px-2 py-1 rounded-lg shadow-md">
                {property.weekendPriceMultiplier && property.weekendPriceMultiplier !== 1.0 ? (
                  <>
                    <span className="text-[#8B7355]">{property.basePricePerNight}</span>
                    <span className="text-[8px] text-[#6B5D4F]">/</span>
                    <span className="text-[#8B7355]">
                      {Math.round(property.basePricePerNight * property.weekendPriceMultiplier)}₼
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[#8B7355]">{property.basePricePerNight}₼</span>
                    <span className="text-[7px] text-[#6B5D4F]">/gecə</span>
                  </>
                )}
              </div>
            </div>
            {property.featured && (
              <div className="inline-flex items-center bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                YENİ
              </div>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(property.id); }}
            className="absolute bottom-1.5 right-1.5 z-10 w-[18px] h-[18px] rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Sevimlilərə əlavə et"
          >
            <FaHeart
              className={`text-[9px] transition-all duration-300 ${
                favorites.has(property.id) ? 'text-red-500 scale-110' : 'text-[#C19A6B]'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-1.5 space-y-0.5">
          <h3 className="font-bold text-[10px] leading-tight text-[#2C1810] line-clamp-1 group-hover:text-[#8B7355] transition-colors duration-300">
            {property.title}
          </h3>
          <div className="flex items-center gap-0.5 text-[8px] text-[#8B7E74]">
            <FaMapMarkerAlt className="text-[7px] text-[#C19A6B] flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{property.city}</span>
          </div>
          <div className="text-[7px] text-[#8B7E74] font-mono">ID: {property.id}</div>
          <div className="flex items-center gap-1 text-[8px] text-[#8B7E74] py-0.5">
            <div className="flex items-center gap-0.5">
              <FaBed className="text-[7px] text-[#8B7355]" />
              <span className="font-semibold text-[#2C1810]">{property.bedrooms}</span>
            </div>
            <span className="text-[#E5DDD5]">•</span>
            <div className="flex items-center gap-0.5">
              <FaBath className="text-[7px] text-[#8B7355]" />
              <span className="font-semibold text-[#2C1810]">{property.bathrooms}</span>
            </div>
            <span className="text-[#E5DDD5]">•</span>
            <div className="flex items-center gap-0.5">
              <FaUsers className="text-[7px] text-[#8B7355]" />
              <span className="font-semibold text-[#2C1810]">{property.maxGuests}</span>
            </div>
            {property.poolType && property.poolType !== 'NONE' && (
              <>
                <span className="text-[#E5DDD5]">•</span>
                <div className="flex items-center gap-0.5">
                  <FaSwimmingPool className="text-[7px] text-[#8B7355]" />
                  <span className="font-semibold text-[#2C1810]">
                    {property.poolType === 'HEATED' ? 'İsti' : 'Sadə'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
