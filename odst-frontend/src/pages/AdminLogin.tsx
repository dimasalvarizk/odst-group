import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import apiService from '../services/api';
import logo from '../assets/logo-group.png';
import heroBg from '../assets/hero1.webp';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/internal-odst-gate/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
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
      navigate('/internal-odst-gate/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 font-sans select-none bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark Translucent Backdrop Overlay (No blur) */}
      <div className="absolute inset-0 bg-[#050c1e]/55" />

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-[390px] space-y-5 fade-in">
        
        {/* Clean Solid White Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-7 sm:p-8 shadow-2xl space-y-5">
          
          {/* Brand Logo */}
          <div className="flex flex-col items-center text-center pb-2">
            <Link to="/" aria-label="ODST Group - Home" className="inline-block transition-opacity hover:opacity-85">
              <img src={logo} alt="ODST Group" width={150} height={40} className="h-10 w-auto object-contain" decoding="async" />
            </Link>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs font-medium animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">
                Email or Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="admin@odst.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#242E69] focus:ring-4 focus:ring-[#242E69]/5 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
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
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#242E69] focus:ring-4 focus:ring-[#242E69]/5 transition-all font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#242E69] hover:bg-[#1b2350] text-white font-semibold text-xs tracking-wide rounded-xl transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
