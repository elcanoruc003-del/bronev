'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaUser, FaPhone, FaUpload, FaCheckCircle, FaCreditCard, FaCopy } from 'react-icons/fa';
import { participateInCampaign, checkUserParticipation } from '@/app/actions/campaigns';
import { getCurrentUser } from '@/app/actions/auth';
import AuthModal from './AuthModal';
import Image from 'next/image';

interface CampaignParticipationModalProps {
  campaign: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignParticipationModal({ 
  campaign, 
  isOpen, 
  onClose 
}: CampaignParticipationModalProps) {
  const [step, setStep] = useState<'auth-check' | 'form' | 'payment' | 'upload' | 'success'>('auth-check');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);

  // Form fields
  const [participantName, setParticipantName] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  async function checkAuth() {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        setShowAuthModal(true);
        setIsLoading(false);
        return;
      }

      setUser(currentUser);
      setParticipantName(currentUser.name || '');
      setParticipantPhone(currentUser.phone || '');

      // Check if already participated
      const participationCheck = await checkUserParticipation(campaign.id);
      if (participationCheck.success && participationCheck.participated) {
        setAlreadyParticipated(true);
        setStep('success');
      } else {
        setStep('form');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setShowAuthModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAuthSuccess() {
    setShowAuthModal(false);
    checkAuth();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Yalnız şəkil formatları qəbul edilir');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Şəkil ölçüsü 5MB-dan çox olmamalıdır');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        setReceiptImage(result.url);
      } else {
        setError(result.error || 'Şəkil yüklənərkən xəta baş verdi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Şəkil yüklənərkən xəta baş verdi');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!participantName.trim() || !participantPhone.trim()) {
      setError('Ad və telefon nömrəsi tələb olunur');
      return;
    }

    if (!receiptImage) {
      setError('Ödəniş çeki yüklənməlidir');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await participateInCampaign(campaign.id, {
        participantName: participantName.trim(),
        participantPhone: participantPhone.trim(),
        receiptImage,
      });

      if (result.success) {
        setStep('success');
      } else {
        setError(result.error || 'İştirak zamanı xəta baş verdi');
      }
    } catch (error) {
      console.error('Participation error:', error);
      setError('İştirak zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  }

  function copyCardNumber() {
    if (campaign.cardNumber) {
      navigator.clipboard.writeText(campaign.cardNumber);
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 2000);
    }
  }

  if (!isOpen) return null;

  // Auth Modal
  if (showAuthModal) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          onClose();
        }}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#E5DDD5] flex items-center justify-center transition-colors z-10"
        >
          <FaTimes className="text-[#6B5D4F]" />
        </button>

        {/* Loading State */}
        {step === 'auth-check' && (
          <div className="p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-[#8B7355] mx-auto mb-4" />
            <p className="text-[#6B5D4F]">Yoxlanır...</p>
          </div>
        )}

        {/* Success State (Already Participated) */}
        {step === 'success' && alreadyParticipated && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#2C2416] mb-2">Siz artıq iştirak edirsiniz!</h3>
            <p className="text-[#6B5D4F] mb-6">
              Bu kampaniyada iştirakınız qeydə alınıb. İştirakınızın statusunu profilinizdən izləyə bilərsiniz.
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-8 py-3 rounded-xl hover:shadow-lg transition"
            >
              Bağla
            </button>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎫</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2C2416] mb-2">
                {campaign.title}
              </h2>
              <p className="text-[#6B5D4F] text-sm">
                İştirak məlumatlarınızı daxil edin
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Ad və Soyad *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Ad və soyadınız"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                  Telefon Nömrəsi *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                  <input
                    type="tel"
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(e.target.value)}
                    placeholder="+994 XX XXX XX XX"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>İştirak haqqı:</strong> {campaign.participationFee / 100} AZN
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Next Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Növbəti: Ödəniş
              </button>
            </form>
          </div>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#2C2416] mb-2">
                Ödəniş Məlumatları
              </h2>
              <p className="text-[#6B5D4F] text-sm">
                Aşağıdakı kart məlumatlarına {campaign.participationFee / 100} AZN köçürün
              </p>
            </div>

            {/* Payment Info Card */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 mb-6">
              {campaign.cardNumber && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kart Nömrəsi
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={campaign.cardNumber}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl bg-white font-mono text-lg"
                    />
                    <button
                      onClick={copyCardNumber}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
                      title="Kopyala"
                    >
                      {cardCopied ? <FaCheckCircle /> : <FaCopy />}
                    </button>
                  </div>
                  {cardCopied && (
                    <p className="text-xs text-green-600 mt-1">Kopyalandı!</p>
                  )}
                </div>
              )}

              {campaign.cardHolder && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kart Sahibi
                  </label>
                  <input
                    type="text"
                    value={campaign.cardHolder}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-white"
                  />
                </div>
              )}

              {campaign.bankName && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank
                  </label>
                  <input
                    type="text"
                    value={campaign.bankName}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-white"
                  />
                </div>
              )}
            </div>

            {/* Amount Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Ödəniş məbləği:</strong> {campaign.participationFee / 100} AZN
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Ödənişi etdikdən sonra növbəti addıma keçin
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"
              >
                Geri
              </button>
              <button
                onClick={() => setStep('upload')}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Ödəniş Edildi
              </button>
            </div>
          </div>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <FaUpload className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#2C2416] mb-2">
                Ödəniş Çeki
              </h2>
              <p className="text-[#6B5D4F] text-sm">
                Ödəniş çekinizi yükləyin
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2416] mb-3">
                  Çek Şəkli *
                </label>
                
                {!receiptImage ? (
                  <label className="block border-2 border-dashed border-[#E5DDD5] rounded-2xl p-8 text-center cursor-pointer hover:border-[#8B7355] transition">
                    <FaUpload className="text-4xl text-[#C19A6B] mx-auto mb-3" />
                    <p className="text-[#6B5D4F] mb-2">
                      {uploading ? 'Yüklənir...' : 'Şəkil seçin və ya buraya sürükləyin'}
                    </p>
                    <p className="text-xs text-[#8B7355]">
                      PNG, JPG, JPEG (Max: 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                ) : (
                  <div className="relative border-2 border-green-500 rounded-2xl p-4">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                      <Image
                        src={receiptImage}
                        alt="Receipt"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptImage('')}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition"
                    >
                      Başqa şəkil seç
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Çekiniz yoxlanıldıqdan sonra iştirakınız təsdiqlənəcək və sizə bildiriş göndəriləcək.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"
                  disabled={isLoading}
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !receiptImage}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Göndərilir...</span>
                    </>
                  ) : (
                    'Göndər və Tamamla'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Step (New Participation) */}
        {step === 'success' && !alreadyParticipated && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#2C2416] mb-2">Uğurlu!</h3>
            <p className="text-[#6B5D4F] mb-6">
              İştirakınız qeydə alındı. Ödəniş çekiniz yoxlanıldıqdan sonra təsdiqlənəcək.
              <br />
              Statusu profilinizdən izləyə bilərsiniz.
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/profile';
              }}
              className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-8 py-3 rounded-xl hover:shadow-lg transition"
            >
              Profilə Get
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
