import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { images } from '../utils/images';

export default function TermsOfServicePage() {
  const { t } = useTranslation();

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
            {t('termsPage.subtitle')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-spectral">
            {t('termsPage.title')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto">
            {t('termsPage.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-12 space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">{t('termsPage.section1Title')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {t('termsPage.section1Desc')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">{t('termsPage.section2Title')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {t('termsPage.section2Desc')}
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm pl-4 space-y-1 font-light">
              <li>{t('termsPage.section2List1')}</li>
              <li>{t('termsPage.section2List2')}</li>
              <li>{t('termsPage.section2List3')}</li>
              <li>{t('termsPage.section2List4')}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">{t('termsPage.section3Title')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {t('termsPage.section3Desc')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">{t('termsPage.section4Title')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {t('termsPage.section4Desc')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">{t('termsPage.section5Title')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {t('termsPage.section5Desc')}
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
