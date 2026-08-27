import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { images } from '../utils/images';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${images.contactHero})` }}
        />
        
        {/* Dark Translucent Overlay - using exact rgba(0, 0, 0, 0.75) */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in">
          <span className="text-brand-orange text-xs font-semibold tracking-widest uppercase mb-2 block">
            ODST Group Guidelines
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-spectral">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto">
            Last Updated: August 27, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-12 space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">1. Introduction</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Welcome to ODST Group. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services (Hotels, Airlines, and Tour & Travel).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">2. Data We Collect</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              We collect information that you voluntarily provide to us when submitting contact inquiries or subscribing to our newsletters. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm pl-4 space-y-1 font-light">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Preferred service divisions (Hotels, Airlines, Travel)</li>
              <li>Any message content you send to us</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">3. How We Use Your Data</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              We process your personal information to fulfill our services and respond to inquiries, specifically to:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm pl-4 space-y-1 font-light">
              <li>Contact you regarding booking, aviation charters, or pilgrim services.</li>
              <li>Send periodic newsletters and updates if you have opted in.</li>
              <li>Ensure security and proper operational maintenance of our web systems.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">4. Data Sharing & Security</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              We do not sell, trade, or transfer your personal data to outside parties. Your data is processed securely through encrypted database interfaces, and access is restricted only to authorized administrative users of the ODST Group.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">5. Contact Us</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              If you have any questions or concerns regarding this policy, please reach out directly through our contact page or email us at <a href="mailto:info@odst.id" className="text-brand-orange hover:underline font-medium">info@odst.id</a>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
