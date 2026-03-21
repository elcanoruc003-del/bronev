'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaUpload, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getPropertyForEdit, updateProperty, addPropertyImages, deletePropertyImage, updateImageOrder } from '@/app/actions/admin';
import Image from 'next/image';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<any>(null);
  const [newImages, setNewImages] = useState<Array<{ url: string; alt: string }>>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Birləşdirilmiş imkanlar siyahısı
  const amenitiesList = [
    'Wifi', 'İsti Hovuz', 'Kondisoner', 'İstilik Sistemi', 'Manqal', 
    'Samovar', 'Qəlyan', 'Parking', 'Mənzərə', 'Söhbətgah',
    'Besetka', 'Qab-qacaq', 'Qaz', 'Su', 'İşıq', 'Generator',
  ];

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  async function loadProperty() {
    try {
      const result = await getPropertyForEdit(propertyId);
      if (result.success && result.data) {
        const prop = result.data;
        // Ensure amenities and features are arrays
        prop.amenities = Array.isArray(prop.amenities) ? prop.amenities : [];
        prop.features = Array.isArray(prop.features) ? prop.features : [];
        setProperty(prop);
      } else {
        setError('Ev tapılmadı');
      }
    } catch (error) {
      setError('Yükləmə xətası');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImageCount = (property.property_images?.length || 0) + newImages.length;
    if (currentImageCount + files.length > 30) {
      setError(`Maksimum 30 şəkil yükləyə bilərsiniz. Hazırda ${currentImageCount} şəkil var.`);
      return;
    }

    setIsUploading(true);
    setError('');

    const successfulUploads: Array<{ url: string; alt: string }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 10 * 1024 * 1024) continue;
        if (!file.type.startsWith('image/')) continue;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();
        if (response.ok) {
          successfulUploads.push({
            url: data.url,
            alt: property.title || 'Property image',
          });
        }
      }

      if (successfulUploads.length > 0) {
        setNewImages([...newImages, ...successfulUploads]);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError('Şəkil yükləmə xətası');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm('Bu şəkli silmək istədiyinizdən əminsiniz?')) return;

    try {
      const result = await deletePropertyImage(imageId);
      if (result.success) {
        setProperty({
          ...property,
          property_images: property.property_images.filter((img: any) => img.id !== imageId)
        });
      }
    } catch (error) {
      setError('Şəkil silinərkən xəta baş verdi');
    }
  }

  async function moveImageUp(index: number) {
    if (index === 0) return;
    
    const images = [...property.property_images];
    const currentImage = images[index];
    const previousImage = images[index - 1];

    // Swap orders
    await updateImageOrder(currentImage.id, index - 1);
    await updateImageOrder(previousImage.id, index);

    // Update local state
    [images[index - 1], images[index]] = [images[index], images[index - 1]];
    setProperty({ ...property, property_images: images });
  }

  async function moveImageDown(index: number) {
    if (index === property.property_images.length - 1) return;
    
    const images = [...property.property_images];
    const currentImage = images[index];
    const nextImage = images[index + 1];

    // Swap orders
    await updateImageOrder(currentImage.id, index + 1);
    await updateImageOrder(nextImage.id, index);

    // Update local state
    [images[index], images[index + 1]] = [images[index + 1], images[index]];
    setProperty({ ...property, property_images: images });
  }

  function removeNewImage(index: number) {
    setNewImages(newImages.filter((_, i) => i !== index));
  }

  function addCustomAmenity() {
    if (customAmenity.trim() && !property.amenities.includes(customAmenity.trim())) {
      setProperty({
        ...property,
        amenities: [...property.amenities, customAmenity.trim()],
      });
      setCustomAmenity('');
    }
  }

  function removeAmenity(amenity: string) {
    setProperty({
      ...property,
      amenities: property.amenities.filter((a: string) => a !== amenity),
    });
  }

  function toggleAmenity(amenity: string) {
    if (property.amenities.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      setProperty({
        ...property,
        amenities: [...property.amenities, amenity],
      });
    }
  }

  function toggleFeature(feature: string) {
    if (property.features.includes(feature)) {
      setProperty({
        ...property,
        features: property.features.filter((f: string) => f !== feature),
      });
    } else {
      setProperty({
        ...property,
        features: [...property.features, feature],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await updateProperty(propertyId, property);
      
      if (!result.success) {
        setError(result.error || 'Xəta baş verdi');
        setIsSubmitting(false);
        return;
      }

      // Upload new images if any
      if (newImages.length > 0) {
        const currentImageCount = property.property_images?.length || 0;
        const imagesWithOrder = newImages.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          order: currentImageCount + index,
        }));

        await addPropertyImages(propertyId, imagesWithOrder);
      }

      alert('Ev uğurla yeniləndi!');
      router.push('/admin/dashboard');
    } catch (error) {
      setError('Xəta baş verdi');
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
            {/* Əsas Məlumatlar */}
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
                  Növ *
                </label>
                <select
                  value={property.type}
                  onChange={(e) => setProperty({ ...property, type: e.target.value })}
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
                <select
                  value={property.city}
                  onChange={(e) => setProperty({ ...property, city: e.target.value })}
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
                value={property.address}
                onChange={(e) => setProperty({ ...property, address: e.target.value })}
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

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Sahə (m²) *
                </label>
                <input
                  type="number"
                  min="10"
                  value={property.area}
                  onChange={(e) => setProperty({ ...property, area: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  required
                />
              </div>
            </div>

            {/* Qiymət */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    Həftəiçi gecəlik qiymət (₼) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={property.basePricePerNight}
                    onChange={(e) => setProperty({ ...property, basePricePerNight: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                    required
                  />
                  <p className="text-xs text-[#8B7355] mt-1">Bazar ertəsi - Cümə axşamı</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    Həftəsonu gecəlik qiymət (₼)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={property.weekendPriceMultiplier ? Math.round(property.basePricePerNight * property.weekendPriceMultiplier) : 0}
                    onChange={(e) => {
                      const weekendPrice = parseInt(e.target.value);
                      const multiplier = weekendPrice > 0 ? weekendPrice / property.basePricePerNight : 1.0;
                      setProperty({ ...property, weekendPriceMultiplier: multiplier });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                    placeholder="Boş buraxsanız həftəiçi qiymət tətbiq olunacaq"
                  />
                  <p className="text-xs text-[#8B7355] mt-1">Cümə - Bazar (boş buraxsanız həftəiçi qiymət işlənəcək)</p>
                </div>
              </div>

              {property.weekendPriceMultiplier && property.weekendPriceMultiplier !== 1.0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Qiymət fərqi:</span>{' '}
                    {property.weekendPriceMultiplier > 1.0 ? (
                      <>
                        Həftəsonu <span className="font-bold">+{Math.round(property.basePricePerNight * (property.weekendPriceMultiplier - 1))}₼</span> ({Math.round((property.weekendPriceMultiplier - 1) * 100)}% baha)
                      </>
                    ) : (
                      <>
                        Həftəsonu <span className="font-bold">-{Math.round(property.basePricePerNight * (1 - property.weekendPriceMultiplier))}₼</span> ({Math.round((1 - property.weekendPriceMultiplier) * 100)}% ucuz)
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Mövcud Şəkillər */}
            {property.property_images && property.property_images.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Mövcud Şəkillər
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.property_images.map((image: any, index: number) => (
                    <div key={image.id} className="relative group">
                      <div className="absolute top-2 left-2 bg-[#8B7355] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        #{index + 1}
                      </div>
                      <Image
                        src={image.url}
                        alt={image.alt || ''}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            title="Yuxarı"
                          >
                            <FaArrowUp />
                          </button>
                        )}
                        {index < property.property_images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            title="Aşağı"
                          >
                            <FaArrowDown />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          title="Sil"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Şəkillər */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Yeni Şəkillər Əlavə Et
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
                    <span className="text-xs text-[#8B7355]">JPG, PNG, WEBP - Max 10MB</span>
                  </>
                )}
              </label>

              {newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
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
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  placeholder="Öz imkanınızı əlavə edin"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-6 py-2.5 rounded-xl bg-[#8B7355] text-white hover:bg-[#6B5D4F] transition-colors text-sm font-semibold shadow-sm"
                >
                  + Əlavə et
                </button>
              </div>

              {property.amenities.length > 0 && (
                <div className="mb-4 p-4 bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] rounded-xl border border-[#E5DDD5]">
                  <p className="text-xs font-semibold text-[#6B5D4F] mb-2">Seçilmiş imkanlar:</p>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity: string) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white rounded-full text-sm font-medium shadow-sm"
                      >
                        <span>✓ {amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="hover:text-red-200 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                      property.amenities.includes(amenity)
                        ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white border-[#8B7355] shadow-md scale-105'
                        : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355] hover:shadow-sm'
                    }`}
                  >
                    {property.amenities.includes(amenity) && '✓ '}
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
                value={property.longDescription || property.shortDescription || ''}
                onChange={(e) => setProperty({ 
                  ...property, 
                  longDescription: e.target.value,
                  shortDescription: e.target.value.substring(0, 150)
                })}
                rows={4}
                placeholder="Ev haqqında ətraflı məlumat yazın..."
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                required
              />
            </div>

            {/* Premium */}
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
