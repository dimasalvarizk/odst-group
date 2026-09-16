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
          style={{ backgroundImage: `url(${images.contactHero || images.hero1})` }}
        />
        
        {/* Dark Translucent Overlay */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in">
          <span className="text-brand-orange text-xs font-semibold tracking-widest uppercase mb-2 block">
            {t('comingSoon.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 font-spectral">
            {t('comingSoon.title')}
          </h1>
          <p className="text-white/70 text-xs md:text-sm max-w-md mx-auto font-light">
            {t('comingSoon.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content - 2 Column Left-Right Layout */}
      <main className="flex-grow py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Sticky Summary & Quick Actions */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
              <div>
                <span className="text-brand-orange text-xs font-semibold tracking-widest uppercase mb-2 block">
                  {t('comingSoon.badge')}
                </span>
                <h2 className="text-2xl font-bold text-brand-navy font-spectral mb-3">
                  {t('comingSoon.title')}
                </h2>
                <p className="text-slate-500 text-xs font-light">
                  {t('comingSoon.subtitle')}
                </p>
              </div>

              {/* Status Note */}
              <div className="p-6 bg-slate-50/90 rounded-xl space-y-3">
                <span className="inline-block px-2.5 py-1 rounded bg-brand-orange/15 text-brand-orange text-[11px] font-bold uppercase tracking-wider">
                  {t('comingSoon.statusBadge')}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {t('comingSoon.statusDesc')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link 
                  to="/" 
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-md active:scale-95"
                >
                  {t('comingSoon.backHome')}
                </Link>

                <Link 
                  to="/contact" 
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-[#242E69] hover:bg-[#1d2554] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-md active:scale-95"
                >
                  {t('comingSoon.contact')}
                </Link>
              </div>
            </aside>

            {/* Right Column: Detailed Editorial Sections */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Section 1: Heading & Main Description */}
              <section className="space-y-4 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('comingSoon.heading')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('comingSoon.desc1')}
                </p>
              </section>

              {/* Section 2: Integrated Services Overview */}
              <section className="space-y-6 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('comingSoon.servicesTitle')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-start">
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-brand-navy font-spectral">{t('services.hotels.title')}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('comingSoon.hotelsDesc')}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-brand-navy font-spectral">{t('services.airlines.title')}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('comingSoon.airlinesDesc')}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-brand-navy font-spectral">{t('services.travel.title')}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('comingSoon.travelDesc')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Contact & Support Info */}
              <section className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('comingSoon.supportTitle')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('comingSoon.desc2')} {t('comingSoon.supportNote')}
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


