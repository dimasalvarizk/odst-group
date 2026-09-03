import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050c1e] lg:bg-[#f8fafc] font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      
      {/* Left Brand Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-[#050c1e] text-white flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0 shadow-2xl border-r border-slate-800/80">
        {/* Decorative background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-navy/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050c1e]/60 to-[#050c1e] z-10 pointer-events-none" />

        {/* Brand Top Header */}
        <div className="relative z-20">
          <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
            <img src={logo} alt="ODST Logo" className="h-12 w-auto mb-2" />
          </Link>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            <p className="text-[10px] text-brand-gold tracking-widest uppercase font-semibold">
              Hajj, Umrah & Premium Travel
            </p>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-20 my-auto py-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-gold tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck size={16} />
              Secure Administrative Access
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white font-spectral">
              Admin Portal
              <span className="text-brand-gold block font-sans text-xl font-medium mt-1">Control Center Gateway</span>
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-light">
            Manage inquiries, update service lander showcases, direct connection channels, and monitor Mailchimp newsletter subscribers in real-time.
          </p>
          
          <div className="pt-4 space-y-3.5 border-t border-white/10 max-w-sm">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 text-xs font-bold">✓</span>
              <span>Encrypted JWT administrative authorization</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 text-xs font-bold">✓</span>
              <span>Real-time customer inquiry tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 text-xs font-bold">✓</span>
              <span>Live Mailchimp marketing synchronization</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-20 text-[11px] text-slate-400 font-medium flex justify-between items-center">
          <span>&copy; 2026 ODST Group.</span>
          <span className="text-slate-500">v2.0 Enterprise</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:px-12 xl:px-16 bg-[#050c1e] lg:bg-[#f8fafc]">
        
        <div className="w-full max-w-md space-y-6">
          
          {/* Brand header visible on mobile & tablet only */}
          <div className="lg:hidden text-center space-y-3 pt-4 pb-2">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
              <img src={logo} alt="ODST Logo" className="h-11 w-auto mx-auto drop-shadow-md" />
            </Link>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] text-brand-gold font-semibold tracking-wider uppercase">
                Control Center Gateway
              </span>
              <p className="text-xs text-slate-300 mt-1">
                ODST Group Administrative Portal
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200/90 shadow-2xl lg:shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Sign In</h2>
              <p className="text-xs sm:text-sm text-slate-500">Please enter your credentials to access the panel.</p>
            </div>

            {error && (
              <div className="flex items-start space-x-3 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium animate-fadeIn">
                <AlertTriangle className="shrink-0 w-4 h-4 text-rose-500 mt-0.5" />
                <span className="flex-1 leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email / Username */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="admin@odst.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-slate-800 placeholder-slate-400 text-sm transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-slate-800 placeholder-slate-400 text-sm transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-[#050c1e] hover:bg-brand-navy active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-brand-navy/20 cursor-pointer min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-brand-gold" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </form>
          </div>

          {/* Back to Homepage Link */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white lg:hover:text-slate-700 transition-colors py-2 px-3 rounded-lg hover:bg-white/5 lg:hover:bg-slate-100"
            >
              <ArrowLeft size={14} />
              <span>Back to ODST Website</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
