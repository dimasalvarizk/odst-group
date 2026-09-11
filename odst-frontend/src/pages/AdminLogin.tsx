import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050c1e] lg:bg-slate-100 font-sans">
      
      {/* Left Brand Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[40%] bg-[#050c1e] text-white flex-col justify-between p-10 xl:p-14 border-r border-slate-800">
        <div>
          <Link to="/" className="inline-block">
            <img src={logo} alt="ODST Logo" className="h-10 w-auto mb-2" />
          </Link>
          <div className="inline-block px-2.5 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30 text-[10px] text-brand-gold font-bold uppercase mt-2">
            Control Center Gateway
          </div>
        </div>

        <div className="my-auto py-8 space-y-4">
          <h2 className="text-3xl font-extrabold text-white">
            Admin Portal
            <span className="text-brand-gold block text-lg font-normal mt-1">Management Dashboard</span>
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Manage inquiries, update service lander showcases, direct connection channels, and monitor Mailchimp newsletter subscribers in real-time.
          </p>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          &copy; 2026 ODST Group. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 py-10 sm:px-6 md:px-10 bg-[#050c1e] lg:bg-slate-100">
        <div className="w-full max-w-md space-y-5">
          
          <div className="lg:hidden text-center space-y-2 pb-2">
            <Link to="/" className="inline-block">
              <img src={logo} alt="ODST Logo" className="h-10 w-auto mx-auto" />
            </Link>
            <p className="text-xs text-slate-400 font-semibold uppercase">ODST Group Admin Control Center</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Sign In</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter your credentials to access the panel.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-slate-700 font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#050c1e] hover:bg-brand-navy text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Back to ODST Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
