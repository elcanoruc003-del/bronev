'use client';

import { useState } from 'react';
import { FaHome, FaSpinner } from 'react-icons/fa';
import { loginAdmin } from '@/app/actions/admin';

export default function AdminLoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const result = await loginAdmin(loginEmail, loginPassword);
      
      if (result.success && result.user) {
        window.location.href = '/admin/dashboard';
      } else {
        setLoginError(result.error || 'Giriş uğursuz oldu');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Xəta baş verdi');
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2416] via-[#3D3226] to-[#2C2416] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#C19A6B] w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaHome className="text-5xl text-[#2C2416]" />
          </div>
          <h1 className="text-4xl font-bold text-[#2C2416] mb-2">Admin Panel</h1>
          <p className="text-[#6B5D4F]">A-Frame İdarəetmə</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {loginError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-[#2C2416] mb-2">Email</label>
            <input 
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="admin@bronev.com" 
              className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] bg-white focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 transition-all duration-300 outline-none text-[#2C2416]"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#2C2416] mb-2">Parol</label>
            <input 
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] bg-white focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 transition-all duration-300 outline-none text-[#2C2416]"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full px-6 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Giriş edilir...
              </>
            ) : (
              'Daxil Ol'
            )}
          </button>

          <div className="text-center text-sm text-[#6B5D4F] mt-4">
            Demo: admin@bronev.com / admin123
          </div>
        </form>
      </div>
    </div>
  );
}
