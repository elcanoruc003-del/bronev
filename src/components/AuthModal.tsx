'use client';

import { useState } from 'react';
import { FaTimes, FaSpinner, FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { registerUser, loginUser } from '@/app/actions/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const result = await registerUser({ name, identifier, password });
        
        if (result.success) {
          setSuccess(result.message || 'Qeydiyyat uğurlu oldu!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          setError(result.error || 'Xəta baş verdi');
        }
      } else {
        const result = await loginUser({ identifier, password });
        
        if (result.success) {
          setSuccess(result.message || 'Giriş uğurlu oldu!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          setError(result.error || 'Xəta baş verdi');
        }
      }
    } catch (err) {
      setError('Xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
    setName('');
    setIdentifier('');
    setPassword('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#E5DDD5] flex items-center justify-center transition-colors"
        >
          <FaTimes className="text-[#6B5D4F]" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B7355] to-[#C19A6B] flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#2C2416] mb-2">
            {mode === 'login' ? 'Giriş' : 'Qeydiyyat'}
          </h2>
          <p className="text-[#6B5D4F] text-sm">
            {mode === 'login' 
              ? 'Hesabınıza daxil olun' 
              : 'Yeni hesab yaradın'}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                Ad Soyad *
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı daxil edin"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email or Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#2C2416] mb-2">
              Email və ya Telefon *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]">
                {identifier.includes('@') ? <FaEnvelope /> : <FaPhone />}
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@gmail.com və ya 0501234567"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-[#8B7355] mt-1">
              Gmail və ya mobil nömrə ilə daxil ola bilərsiniz
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-[#2C2416] mb-2">
              Parol *
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            {mode === 'register' && (
              <p className="text-xs text-[#8B7355] mt-1">
                Ən azı 6 simvol olmalıdır
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#8B7355] to-[#C19A6B] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Yüklənir...
              </>
            ) : (
              mode === 'login' ? 'Daxil Ol' : 'Qeydiyyatdan Keç'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B5D4F]">
            {mode === 'login' ? 'Hesabınız yoxdur?' : 'Artıq hesabınız var?'}
            {' '}
            <button
              onClick={switchMode}
              className="text-[#8B7355] font-semibold hover:underline"
              disabled={isLoading}
            >
              {mode === 'login' ? 'Qeydiyyatdan keçin' : 'Daxil olun'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
