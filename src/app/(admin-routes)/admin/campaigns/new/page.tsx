'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGift, FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { createCampaign, getCurrentAdmin, getAdminProperties } from '@/app/actions/admin';
import Link from 'next/link';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [prizeDescription, setPrizeDescription] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [participationFee, setParticipationFee] = useState('100');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');
  const [termsAndConditions, setTermsAndConditions] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const admin = await getCurrentAdmin();
    if (!admin) {
      router.push('/admin');
      return;
    }
    loadProperties();
  }

  async function loadProperties() {
    const result = await getAdminProperties();
    if (result.success && result.data) {
      setProperties(result.data);
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9əıöğüşç\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await createCampaign({
        title,
        slug,
        description,
        prizeDescription,
        propertyId: propertyId || undefined,
        participationFee: parseInt(participationFee) * 100, // Convert to cents
        cardNumber: cardNumber || undefined,
        cardHolder: cardHolder || undefined,
        bankName: bankName || undefined,
        drawDate: drawDate || undefined,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        status,
        termsAndConditions: termsAndConditions || undefined,
      });

      if (result.success) {
        setSuccess('Kampaniya uğurla yaradıldı!');
        setTimeout(() => {
          router.push('/admin/campaigns');
        }, 1500);
      } else {
        setError(result.error || 'Xəta baş verdi');
      }
    } catch (error) {
      console.error('Create campaign error:', error);
      setError('Kampaniya yaradılarkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/campaigns"
            className="w-10 h-10 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FaArrowLeft className="text-[#6B5D4F]" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <FaGift className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C2416]">Yeni Kampaniya</h1>
              <p className="text-[#6B5D4F]">Yeni kampaniya yaradın</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Başlıq *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Məs: 1 Manata 1 Günlük Kirayə Ev"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="1-manata-ev"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition font-mono text-sm"
                required
              />
              <p className="text-xs text-[#8B7355] mt-1">
                URL: /campaigns/{slug || 'slug'}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Açıqlama *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kampaniya haqqında qısa məlumat..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition resize-none"
                required
              />
            </div>

            {/* Prize Description */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Mükafat *
              </label>
              <input
                type="text"
                value={prizeDescription}
                onChange={(e) => setPrizeDescription(e.target.value)}
                placeholder="Məs: 1 günlük pulsuz qalma"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                required
              />
            </div>

            {/* Property Selection (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Əlaqəli Ev (İstəyə görə)
              </label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
              >
                <option value="">Heç biri</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title} - {prop.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Participation Fee & Draw Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  İştirak Haqqı (AZN) *
                </label>
                <input
                  type="number"
                  value={participationFee}
                  onChange={(e) => setParticipationFee(e.target.value)}
                  placeholder="1"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Çəkiliş Tarixi
                </label>
                <input
                  type="date"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                />
              </div>
            </div>

            {/* Payment Info Section */}
            <div className="bg-blue-50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#2C2416] mb-4">
                Ödəniş Məlumatları
              </h3>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Kart Nömrəsi
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Kart Sahibi
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Bank
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Kapital Bank"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Maksimum İştirakçı Sayı (İstəyə görə)
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="Məhdudiyyət yoxdur"
                min="1"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Şərtlər və Qaydalar
              </label>
              <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                placeholder="Kampaniya şərtləri və qaydaları..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Status *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="DRAFT"
                    checked={status === 'DRAFT'}
                    onChange={(e) => setStatus(e.target.value as 'DRAFT')}
                    className="w-4 h-4"
                  />
                  <span className="text-[#2C2416]">Qaralama</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={status === 'ACTIVE'}
                    onChange={(e) => setStatus(e.target.value as 'ACTIVE')}
                    className="w-4 h-4"
                  />
                  <span className="text-[#2C2416]">Aktiv (Dərhal yayımla)</span>
                </label>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/admin/campaigns"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition text-center"
              >
                Ləğv et
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] hover:shadow-lg text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Yaradılır...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Kampaniya Yarat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
