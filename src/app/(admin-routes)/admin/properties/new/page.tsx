'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaUpload, FaTimes, FaCalendarAlt, FaSwimmingPool } from 'react-icons/fa';
import { createProperty, addPropertyImages, updatePropertyAvailability } from '@/app/actions/admin';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; alt: string }>>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    city: '',
    address: '',
    type: 'VILLA' as const,
    poolType: 'NONE' as 'NONE' | 'REGULAR' | 'HEATED',
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    maxGuests: 2,
    basePricePerNight: 50,
    weekendPricePerNight: 0, // 0 means use base price
    guestPricing: [] as Array<{ minGuests: number; maxGuests: number; weekday: number; weekend: number }>, // Aralıq əsaslı qiymət
    description: '',
    latitude: 40.4093,
    longitude: 49.8671,
    amenities: [] as string[],
    features: [] as string[],
    featured: false,
    showAvailability: false,
  });

  const [customAmenity, setCustomAmenity] = useState('');

  // Birləşdirilmiş imkanlar siyahısı
  const amenitiesList = [
    'Wifi', 'İsti Hovuz', 'Kondisoner', 'İstilik Sistemi', 'Manqal', 
    'Samovar', 'Qəlyan', 'Parking', 'Mənzərə', 'Söhbətgah',
    'Besetka', 'Qab-qacaq', 'Qaz', 'Su', 'İşıq', 'Generator',
  ];

  // Empty useEffect to prevent hydration issues
  useEffect(() => {
    // Component mounted
  }, []);

  const handleDateToggle = (date: string, isBlocked: boolean) => {
    if (isBlocked) {
      setBlockedDates([...blockedDates, date]);
    } else {
      setBlockedDates(blockedDates.filter(d => d !== date));
    }
  };

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

  function moveImageUp(index: number) {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setUploadedImages(newImages);
  }

  function moveImageDown(index: number) {
    if (index === uploadedImages.length - 1) return;
    const newImages = [...uploadedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setUploadedImages(newImages);
  }

  function addCustomAmenity() {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, customAmenity.trim()],
      });
      setCustomAmenity('');
    }
  }

  function removeAmenity(amenity: string) {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity),
    });
  }

  function toggleAmenity(amenity: string) {
    if (formData.amenities.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.id || !formData.title || !formData.city || !formData.address || !formData.description) {
        setError('Bütün tələb olunan sahələri doldurun');
        setIsSubmitting(false);
        return;
      }

      // Calculate weekend price multiplier
      const weekendMultiplier = formData.weekendPricePerNight > 0 
        ? formData.weekendPricePerNight / formData.basePricePerNight 
        : 1.0;

      // Prepare data with required fields and proper number parsing
      const propertyData = {
        id: formData.id.trim(),
        title: formData.title.trim(),
        city: formData.city.trim(),
        district: formData.city.trim(), // Use city as district
        address: formData.address.trim(),
        type: formData.type,
        poolType: formData.poolType,
        bedrooms: Number(formData.bedrooms) || 1,
        beds: Number(formData.bedrooms) || 1, // Use bedrooms count as beds
        bathrooms: Number(formData.bathrooms) || 1,
        area: Number(formData.area) || 50,
        maxGuests: Number(formData.maxGuests) || 2,
        basePricePerNight: Number(formData.basePricePerNight) || 50,
        weekendPriceMultiplier: weekendMultiplier,
        guestPricing: formData.guestPricing, // Adam sayına görə qiymət
        description: formData.description.trim(),
        shortDescription: formData.description.substring(0, 150).trim(), // First 150 chars
        longDescription: formData.description.trim(), // Full description
        latitude: Number(formData.latitude) || 40.4093,
        longitude: Number(formData.longitude) || 49.8671,
        amenities: formData.amenities,
        features: formData.features,
        featured: Boolean(formData.featured),
        showAvailability: Boolean(formData.showAvailability),
      };

      console.log('Submitting property data:', propertyData);

      // Create property
      const result = await createProperty(propertyData);
      
      console.log('Create property result:', result);

      if (!result.success || !result.data) {
        setError(result.error || 'Xəta baş verdi');
        setIsSubmitting(false);
        return;
      }

      // Upload images if any
      if (uploadedImages.length > 0) {
        console.log('Uploading images:', uploadedImages.length);
        const imagesWithOrder = uploadedImages.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          order: index,
        }));

        console.log('Images with order:', imagesWithOrder);
        const imageResult = await addPropertyImages(result.data.id, imagesWithOrder);
        console.log('Add images result:', imageResult);
        
        if (!imageResult.success) {
          console.error('Image upload failed:', imageResult.error);
          setError('Ev əlavə edildi, amma şəkillər yüklənmədi: ' + imageResult.error);
        }
      } else {
        console.log('No images to upload');
      }

      // Save availability (blocked dates)
      if (blockedDates.length > 0) {
        console.log('Saving availability:', blockedDates.length, 'blocked dates');
        const availResult = await updatePropertyAvailability(result.data.id, blockedDates);
        console.log('Availability result:', availResult);
        
        if (!availResult.success) {
          console.error('Availability save failed:', availResult.error);
        }
      }

      alert('Ev uğurla əlavə edildi!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      setError('Xəta baş verdi: ' + (error as Error).message);
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
            {/* ID və Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Ev ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="Məsələn: villa-001"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none"
                  required
                />
                <p className="text-xs text-[#8B7355] mt-1">Unikal ID təyin edin</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-[#E5DDD5] text-[#8B7355] focus:ring-[#8B7355]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#2C2416]">Premium/VIP Ev</span>
                    <p className="text-xs text-[#8B7355]">İlk sətirdə göstərilsin</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAvailability}
                    onChange={(e) => setFormData({ ...formData, showAvailability: e.target.checked })}
                    className="w-5 h-5 rounded border-[#E5DDD5] text-[#8B7355] focus:ring-[#8B7355]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#2C2416]">Boş/Dolu Tarixlər</span>
                    <p className="text-xs text-[#8B7355]">Təqvim müştərilərə göstərilsin</p>
                  </div>
                </label>
              </div>
            </div>

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
                  <option value="AFRAME">A-frame</option>
                  <option value="HOUSE">Ev</option>
                  <option value="COTTAGE">Bağ evi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Hovuz *
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, poolType: 'NONE' })}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      formData.poolType === 'NONE'
                        ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                    }`}
                  >
                    Hovuzsuz
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, poolType: 'REGULAR' })}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      formData.poolType === 'REGULAR'
                        ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                    }`}
                  >
                    <FaSwimmingPool className="text-sm" />
                    Sadə Hovuzlu
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, poolType: 'HEATED' })}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      formData.poolType === 'HEATED'
                        ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-md'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                    }`}
                  >
                    <FaSwimmingPool className="text-sm" />
                    İsti Hovuzlu
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Şəhər *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                >
                  <option value="">Şəhər seçin</option>
                  <option value="İsmayıllı">İsmayıllı</option>
                  <option value="Qəbələ">Qəbələ</option>
                  <option value="Quba">Quba</option>
                  <option value="Bakı">Bakı</option>
                </select>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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

            {/* Qiymət - Aralıq əsaslı */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] rounded-xl p-4 border border-[#E5DDD5]">
                <h3 className="text-base font-bold text-[#2C2416] mb-3">Adam Sayına Görə Qiymət</h3>
                <p className="text-xs text-[#6B5D4F] mb-4">Qonaq sayı aralıqları üçün qiymətləri təyin edin (məsələn: 1-6 nəfər, 7-10 nəfər)</p>
                
                {/* Pricing ranges */}
                <div className="space-y-3">
                  {formData.guestPricing.map((range, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-[#E5DDD5]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-[#2C2416]">
                          Aralıq {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newPricing = formData.guestPricing.filter((_, i) => i !== index);
                            setFormData({ ...formData, guestPricing: newPricing });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Sil
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-[#6B5D4F] mb-1">
                            Min nəfər
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={formData.maxGuests}
                            value={range.minGuests}
                            onChange={(e) => {
                              const newPricing = [...formData.guestPricing];
                              newPricing[index] = { ...range, minGuests: parseInt(e.target.value) || 1 };
                              setFormData({ ...formData, guestPricing: newPricing });
                            }}
                            placeholder="1"
                            className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#6B5D4F] mb-1">
                            Max nəfər
                          </label>
                          <input
                            type="number"
                            min={range.minGuests}
                            max={formData.maxGuests}
                            value={range.maxGuests}
                            onChange={(e) => {
                              const newPricing = [...formData.guestPricing];
                              newPricing[index] = { ...range, maxGuests: parseInt(e.target.value) || range.minGuests };
                              setFormData({ ...formData, guestPricing: newPricing });
                            }}
                            placeholder={formData.maxGuests.toString()}
                            className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#6B5D4F] mb-1">
                            Həftəiçi (₼/gecə)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={range.weekday}
                            onChange={(e) => {
                              const newPricing = [...formData.guestPricing];
                              newPricing[index] = { ...range, weekday: parseInt(e.target.value) || 0 };
                              setFormData({ ...formData, guestPricing: newPricing });
                            }}
                            placeholder="Qiymət"
                            className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#6B5D4F] mb-1">
                            Həftəsonu (₼/gecə)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={range.weekend}
                            onChange={(e) => {
                              const newPricing = [...formData.guestPricing];
                              newPricing[index] = { ...range, weekend: parseInt(e.target.value) || 0 };
                              setFormData({ ...formData, guestPricing: newPricing });
                            }}
                            placeholder="Qiymət"
                            className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new range button */}
                  <button
                    type="button"
                    onClick={() => {
                      const lastRange = formData.guestPricing[formData.guestPricing.length - 1];
                      const newMinGuests = lastRange ? lastRange.maxGuests + 1 : 1;
                      
                      if (newMinGuests <= formData.maxGuests) {
                        setFormData({
                          ...formData,
                          guestPricing: [
                            ...formData.guestPricing,
                            { minGuests: newMinGuests, maxGuests: formData.maxGuests, weekday: 0, weekend: 0 }
                          ]
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-colors text-sm font-semibold"
                  >
                    + Yeni Aralıq Əlavə Et
                  </button>
                </div>
                
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Qeyd:</span> Həftəsonu şənbə və bazar günləridir. Qiymətlər ana səhifədə göstərilməyəcək, yalnız elan səhifəsində adam sayı seçildikdə görünəcək.
                  </p>
                </div>
              </div>
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
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="bg-white text-[#8B7355] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Yuxarı"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === uploadedImages.length - 1}
                          className="bg-white text-[#8B7355] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Aşağı"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Sil"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* İmkanlar və Xüsusiyyətlər - Birləşdirilmiş */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-3">
                İmkanlar və Xüsusiyyətlər
              </label>
              
              {/* Custom Amenity Input */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  placeholder="Öz imkanınızı əlavə edin"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-4 py-2 rounded-lg bg-[#8B7355] text-white hover:bg-[#6B5D4F] transition-colors text-sm font-semibold shadow-sm whitespace-nowrap"
                >
                  + Əlavə et
                </button>
              </div>

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] rounded-lg border border-[#E5DDD5]">
                  <p className="text-xs font-semibold text-[#6B5D4F] mb-2">Seçilmiş imkanlar:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white rounded-full text-xs font-medium shadow-sm"
                      >
                        <span className="truncate max-w-[120px]">✓ {amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="hover:text-red-200 transition-colors flex-shrink-0"
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Predefined Amenities */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-2 py-2 rounded-lg border-2 transition-all text-xs font-medium truncate ${
                      formData.amenities.includes(amenity)
                        ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white border-[#8B7355] shadow-md'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355] hover:shadow-sm'
                    }`}
                    title={amenity}
                  >
                    {formData.amenities.includes(amenity) && '✓ '}
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Təsvir */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Təsvir *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Ev haqqında ətraflı məlumat yazın..."
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Mövcudluq Təqvimi */}
            {formData.showAvailability && (
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#8B7355]" />
                  <span>Mövcudluq Təqvimi</span>
                </label>
                <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] rounded-xl p-4 md:p-6 border border-[#E5DDD5]">
                  <p className="text-xs md:text-sm text-[#6B5D4F] mb-4">
                    Dolu olan tarixləri seçin. Yaşıl tarixlər boş, qırmızı tarixlər dolu olacaq.
                  </p>
                  <AvailabilityCalendar
                    blockedDates={blockedDates}
                    onDateToggle={handleDateToggle}
                    readOnly={false}
                    showLegend={true}
                  />
                  {blockedDates.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">{blockedDates.length}</span> tarix dolu olaraq qeyd edildi
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
