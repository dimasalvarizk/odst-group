import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';
import heroBg from '../assets/hero1.webp';
import LanguageSelector from '../components/layout/LanguageSelector';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/internal-odst-gate/dashboard');
      return;
    }

    // Load saved email if remember me was enabled
    const savedEmail = localStorage.getItem('odst_remember_admin_email');
    const savedRemember = localStorage.getItem('odst_remember_admin') === 'true';
    if (savedEmail && savedRemember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('login.fillAll', 'Mohon isi semua kolom.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiService.login(email, password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        username: data.username,
        email: data.email,
        role: data.role
      }));

      // Handle Remember Me persistence
      if (rememberMe) {
        localStorage.setItem('odst_remember_admin', 'true');
        localStorage.setItem('odst_remember_admin_email', email);
      } else {
        localStorage.removeItem('odst_remember_admin');
        localStorage.removeItem('odst_remember_admin_email');
      }

      navigate('/internal-odst-gate/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.failed', 'Gagal masuk. Silakan periksa kredensial Anda.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 font-sans select-none bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark Translucent Backdrop Overlay */}
      <div className="absolute inset-0 bg-[#050c1e]/75" />

      {/* Top Bar for Language Switcher */}
      <div className="absolute top-6 right-6 z-20 rtl:left-6 rtl:right-auto">
        <LanguageSelector />
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-[400px] space-y-4 animate-fadeIn">
        
        {/* Clean Solid Dark Card */}
        <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/80 space-y-5 text-slate-200">
          
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center text-center pb-2">
            <Link to="/" aria-label="ODST Group - Home" className="inline-block transition-opacity hover:opacity-85 mb-3">
              <img src={logo} alt="ODST Group" width={150} height={40} className="h-10 w-auto object-contain" decoding="async" />
            </Link>
            <h1 className="text-base font-bold text-white tracking-tight">
              {t('login.title', 'Login Administrator')}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('login.subtitle', 'Akses konsol manajemen ODST Group')}
            </p>
          </div>

          {error && (
            <div className="bg-rose-950/70 border border-rose-800 text-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-medium animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left rtl:text-right">
              <label className="block text-xs font-semibold text-slate-300">
                {t('login.emailOrUsername', 'Email atau Username')}
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="info@odst.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left rtl:text-right">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('login.password', 'Kata Sandi')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-400 hover:text-white font-medium transition-colors"
                >
                  {showPassword ? t('login.hide', 'Sembunyikan') : t('login.show', 'Tampilkan')}
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all font-mono"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-slate-700 bg-slate-900 text-brand-orange focus:ring-brand-orange focus:ring-offset-0 focus:ring-1 accent-brand-orange cursor-pointer"
                />
                <span>{t('login.rememberMe', 'Ingat Saya')}</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-brand-orange hover:bg-orange-600 text-white font-semibold text-xs tracking-wide rounded-xl transition-all duration-200 shadow-md shadow-brand-orange/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{t('login.signingIn', 'Memproses masuk...')}</span>
                </>
              ) : (
                t('login.signIn', 'Masuk')
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
