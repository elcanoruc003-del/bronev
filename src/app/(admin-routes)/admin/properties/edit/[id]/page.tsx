'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { getPropertyForEdit, updateProperty } from '@/app/actions/admin';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  async function loadProperty() {
    try {
      const result = await getPropertyForEdit(propertyId);
      if (result.success && result.data) {
        setProperty(result.data);
      } else {
        setError('Ev tapılmadı');
      }
    } catch (error) {
      setError('Yükləmə xətası');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await updateProperty(propertyId, property);
      
      if (result.success) {
        alert('Ev uğurla yeniləndi!');
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Xəta baş verdi');
      }
    } catch (error) {
      setError('Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error || 'Ev tapılmadı'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[#6B5D4F] hover:text-[#2C2416]"
          >
            ← Geri
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#6B5D4F] hover:text-[#2C2416] mb-6"
        >
          <FaArrowLeft />
          <span>Geri</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#2C2416] mb-8">Evi Redaktə Et</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Başlıq *
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Şəhər *
                </label>
                <input
                  type="text"
                  value={property.city}
                  onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Ünvan *
              </label>
              <input
                type="text"
                value={property.address}
                onChange={(e) => setProperty({ ...property, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Yataq otağı *
                </label>
                <input
                  type="number"
                  min="1"
                  value={property.bedrooms}
                  onChange={(e) => setProperty({ ...property, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Vanna *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={property.bathrooms}
                  onChange={(e) => setProperty({ ...property, bathrooms: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Max qonaq *
                </label>
                <input
                  type="number"
                  min="1"
                  value={property.maxGuests}
                  onChange={(e) => setProperty({ ...property, maxGuests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Gecəlik qiymət (₼) *
              </label>
              <input
                type="number"
                min="10"
                value={property.basePricePerNight}
                onChange={(e) => setProperty({ ...property, basePricePerNight: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Təsvir *
              </label>
              <textarea
                value={property.longDescription || property.shortDescription || ''}
                onChange={(e) => setProperty({ 
                  ...property, 
                  longDescription: e.target.value,
                  shortDescription: e.target.value.substring(0, 150)
                })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={property.featured}
                onChange={(e) => setProperty({ ...property, featured: e.target.checked })}
                className="w-5 h-5 rounded border-[#E5DDD5] text-[#8B7355] focus:ring-[#8B7355]"
              />
              <label className="text-sm font-semibold text-[#2C2416]">
                Premium/VIP Ev (İlk sətirdə göstərilsin)
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Yenilənir...
                  </>
                ) : (
                  'Yadda Saxla'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-[#FAF8F5] text-[#2C2416] hover:bg-[#E5DDD5]"
              >
                Ləğv et
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
