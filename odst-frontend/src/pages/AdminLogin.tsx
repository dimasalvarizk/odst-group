import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
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
      
      // Save details to localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        username: data.username,
        email: data.email,
        role: data.role
      }));
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] font-sans">
      
      {/* Left Brand Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-brand-navy text-white flex-col justify-between p-12 relative overflow-hidden shrink-0 shadow-2xl">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy to-brand-navy/95 z-10" />

        {/* Brand Top Header */}
        <div className="relative z-20">
          <img src={logo} alt="ODST Logo" className="h-12 w-auto mb-2" />
          <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
            Hajj, Umrah & Premium Travel
          </p>
        </div>

        {/* Middle Content */}
        <div className="relative z-20 my-auto py-12 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white font-spectral">
            Admin Portal <span className="text-brand-gold block font-sans text-xl font-medium mt-1">Control Center Gateway</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            Access the administrative console to review customer inquiries, manage newsletter subscriptions, and monitor system integrations.
          </p>
          
          <div className="pt-4 space-y-3.5 border-t border-white/10 max-w-xs">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0">✓</span>
              <span>Secure administrative entry</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0">✓</span>
              <span>Manage customer messages</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0">✓</span>
              <span>Newsletter subscriber control</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-20 text-[10px] text-slate-400 font-medium">
          &copy; 2026 ODST Group. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-[#f8fafc]">
        
        <div className="w-full max-w-md space-y-6">
          {/* Brand header visible on mobile only */}
          <div className="lg:hidden text-center space-y-2 mb-8">
            <img src={logo} alt="ODST Logo" className="h-10 w-auto mx-auto" />
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Admin Portal Gateway
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200/80 shadow-md rounded-2xl p-8 md:p-10 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sign In</h2>
              <p className="text-xs text-slate-500">Please enter your credentials to access the panel.</p>
            </div>

            {error && (
              <div className="flex items-center space-x-3 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs font-semibold animate-fadeIn">
                <AlertTriangle className="shrink-0 w-4.5 h-4.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Username */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="admin@odst.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy text-slate-800 placeholder-slate-400 text-sm transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy text-slate-800 placeholder-slate-400 text-sm transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#050c1e] hover:bg-brand-navy text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>

          {/* Back to Homepage Link */}
          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              &larr; Back to Website
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
