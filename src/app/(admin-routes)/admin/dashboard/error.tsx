'use client';

import { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="bg-red-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-5xl text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#2C2416] mb-4">Xəta Baş Verdi</h1>
        <p className="text-[#6B5D4F] mb-6">
          Admin panel yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
        </p>
        {error.digest && (
          <p className="text-sm text-[#6B5D4F] mb-6">
            Xəta kodu: {error.digest}
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95"
          >
            Yenidən Cəhd Et
          </button>
          <a
            href="/admin"
            className="block w-full px-6 py-3 rounded-full font-medium transition-all duration-300 bg-[#FAF8F5] text-[#2C2416] hover:bg-[#E5DDD5]"
          >
            Giriş Səhifəsinə Qayıt
          </a>
        </div>
      </div>
    </div>
  );
}
