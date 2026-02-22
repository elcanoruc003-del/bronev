'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import { createProperty, addPropertyImages } from '@/app/actions/admin';

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; alt: string }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    city: '',
    district: '',
    address: '',
    type: 'VILLA' as const,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    area: 50,
    maxGuests: 2,
    basePricePerNight: 50,
    shortDescription: '',
    longDescription: '',
    latitude: 40.4093,
    longitude: 49.8671,
    amenities: [] as string[],
    features: [] as string[],
  });

  const amenitiesList = [
    'WiFi', 'Hovuz', 'Kondisioner', 'İstilik sistemi', 'Mətbəx', 
    'Pulsuz parkinq', 'TV', 'Paltaryuyan', 'Quruducu', 'Dəmir',
    'Saç quruducu', 'Şampun', 'Bədən sabunu', 'Isti su',
  ];

  const featuresList = [
    'Dəniz mənzərəsi', 'Dağ mənzərəsi', 'Şəhər mənzərəsi', 'Balkon',
    'Terras', 'Bağ', 'BBQ', 'Kamin', 'Oyun otağı', 'İş masası',
  ];

  // Empty useEffect to prevent hydration issues
  useEffect(() => {
    // Component mounted
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check total images limit
    if (uploadedImages.length + files.length > 30) {
      setError(`Maksimum 30 şəkil yükləyə bilərsiniz. Hazırda ${uploadedImages.length} şəkil var.`);
      return;
    }

    setIsUploading(true);
    setError('');

    const successfulUploads: Array<{ url: string; alt: string }> = [];
    const failedUploads: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Validate file size
          if (file.size > 10 * 1024 * 1024) {
            failedUploads.push(`${file.name} (10MB-dan böyük)`);
            continue;
          }

          // Validate file type
          if (!file.type.startsWith('image/')) {
            failedUploads.push(`${file.name} (şəkil deyil)`);
            continue;
          }

          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: uploadFormData,
          });

          const data = await response.json();

          if (!response.ok) {
            failedUploads.push(`${file.name} (${data.error || 'xəta'})`);
            continue;
          }

          successfulUploads.push({
            url: data.url,
            alt: formData.title || 'Property image',
          });
        } catch (err) {
          failedUploads.push(`${file.name} (server xətası)`);
        }
      }

      // Add successful uploads
      if (successfulUploads.length > 0) {
        setUploadedImages([...uploadedImages, ...successfulUploads]);
      }

      // Show results
      if (failedUploads.length > 0) {
        setError(`${successfulUploads.length} şəkil yükləndi. Uğursuz: ${failedUploads.join(', ')}`);
      } else {
        setError('');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError('Şəkil yükləmə xətası. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  }

  function removeImage(index: number) {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  }

  function toggleAmenity(amenity: string) {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  }

  function toggleFeature(feature: string) {
    if (formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: formData.features.filter(f => f !== feature),
      });
    } else {
      setFormData({
        ...formData,
        features: [...formData.features, feature],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Create property
      const result = await createProperty(formData);
      
      if (!result.success || !result.data) {
        setError(result.error || 'Xəta baş verdi');
        setIsSubmitting(false);
        return;
      }

      // Upload images if any
      if (uploadedImages.length > 0) {
        const imagesWithOrder = uploadedImages.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          order: index,
        }));

        await addPropertyImages(result.data.id, imagesWithOrder);
      }

      alert('Ev uğurla əlavə edildi!');
      router.push('/admin/dashboard');
    } catch (error) {
      setError('Xəta baş verdi');
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-[#2C2416] mb-8">Yeni Ev Əlavə Et</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Əsas Məlumatlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Başlıq *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Növ *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                >
                  <option value="VILLA">Villa</option>
                  <option value="APARTMENT">Mənzil</option>
                  <option value="HOUSE">Ev</option>
                  <option value="COTTAGE">Bağ evi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Şəhər *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Rayon *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Xüsusiyyətlər */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Yataq otağı *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Yataq sayı *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
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
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) })}
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
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Sahə (m²) *
              </label>
              <input
                type="number"
                min="10"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Qiymət */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Gecəlik qiymət (₼) *
              </label>
              <input
                type="number"
                min="10"
                value={formData.basePricePerNight}
                onChange={(e) => setFormData({ ...formData, basePricePerNight: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Şəkillər */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Şəkillər
              </label>
              
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              
              <label
                htmlFor="image-upload"
                className={`w-full px-4 py-8 rounded-xl border-2 border-dashed border-[#E5DDD5] hover:border-[#8B7355] transition-colors flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="text-3xl text-[#8B7355] animate-spin" />
                    <span className="text-[#6B5D4F] font-semibold">Yüklənir...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="text-3xl text-[#8B7355]" />
                    <span className="text-[#6B5D4F] font-semibold">Şəkilləri seçin</span>
                    <span className="text-xs text-[#8B7355]">Birdən çoxlu şəkil seçə bilərsiniz (max 30)</span>
                    <span className="text-xs text-[#6B5D4F]">JPG, PNG, WEBP - Max 10MB</span>
                  </>
                )}
              </label>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                İmkanlar
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                      formData.amenities.includes(amenity)
                        ? 'bg-[#8B7355] text-white border-[#8B7355]'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Xüsusiyyətlər
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {featuresList.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                      formData.features.includes(feature)
                        ? 'bg-[#8B7355] text-white border-[#8B7355]'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Təsvir */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Qısa təsvir *
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Ətraflı təsvir *
              </label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Əlavə edilir...
                  </>
                ) : (
                  'Ev Əlavə Et'
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
