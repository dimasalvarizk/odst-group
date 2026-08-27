import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { images } from '../utils/images';

export default function ComingSoonPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans text-start">
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
            {t('comingSoon.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-spectral">
            {t('comingSoon.title')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto">
            {t('comingSoon.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16 md:py-24 bg-slate-50/50 flex items-center justify-center text-center">
        <div className="max-w-2xl mx-auto px-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-bold text-brand-navy font-spectral">
            {t('comingSoon.heading')}
          </h2>
          
          <p className="text-slate-600 text-sm leading-relaxed font-light max-w-lg mx-auto">
            {t('comingSoon.desc1')}
          </p>

          <p className="text-slate-600 text-sm leading-relaxed font-light max-w-lg mx-auto">
            {t('comingSoon.desc2')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange text-white hover:bg-brand-orange/95 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
            >
              {t('comingSoon.backHome')}
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-white hover:bg-brand-navy/95 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
            >
              {t('comingSoon.contact')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
