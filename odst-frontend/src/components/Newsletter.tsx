import React, { useState } from 'react';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.email) {
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    
    // Simulate API request delay
    setTimeout(() => {
      setStatus('success');
      setFormData({ firstName: '', phone: '', email: '' });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  return (
    <section id="newsletter" className="py-20 bg-brand-lightBg border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-orange border border-brand-orange/30 px-3 py-1 rounded bg-brand-orange/5 mb-4 inline-block">
          NEWSLETTER
        </span>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
          Subscribe to Our Newsletter
        </h2>

        {/* Subtitle */}
        <p className="text-slate-500 max-w-xl mx-auto mb-10 text-sm md:text-base">
          Get the latest ODST Group updates, special offers, and packages delivered straight to your inbox.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          {/* Row 1: First Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm"
              required
            />
          </div>

          {/* Row 2: Email & Subscribe Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-md hover:shadow-brand-orange/15 transition-all duration-300 disabled:opacity-75"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {/* Feedback Messages */}
          {status === 'success' && (
            <div className="text-emerald-600 text-sm font-medium mt-3 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-lg animate-fadeIn">
              ✓ Thank you! You have successfully subscribed to our newsletter.
            </div>
          )}
          {status === 'error' && (
            <div className="text-rose-600 text-sm font-medium mt-3 bg-rose-50 border border-rose-100 py-2.5 px-4 rounded-lg animate-fadeIn">
              ⚠ Please fill in all fields before submitting.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
