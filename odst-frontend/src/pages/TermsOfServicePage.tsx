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
            {t('termsPage.subtitle')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-spectral">
            {t('termsPage.title')}
          </h1>
          <p className="text-white/70 text-xs md:text-sm max-w-md mx-auto font-light">
            {t('termsPage.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Main Content - 2 Column Left-Right Layout */}
      <main className="flex-grow py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Sticky Section Navigation & Quick Help */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
              <div>
                <span className="text-brand-orange text-xs font-semibold tracking-widest uppercase mb-2 block">
                  {t('termsPage.subtitle')}
                </span>
                <h2 className="text-2xl font-bold text-brand-navy font-spectral mb-4">
                  {t('termsPage.title')}
                </h2>
                <p className="text-slate-500 text-xs font-light">
                  {t('termsPage.lastUpdated')}
                </p>
              </div>

              {/* Navigation Quick Links */}
              <nav className="space-y-2 border-l-2 border-slate-100 pl-4">
                <a 
                  href="#section-1" 
                  className="block text-sm text-slate-600 hover:text-brand-orange transition-colors font-medium"
                >
                  {t('termsPage.section1Title')}
                </a>
                <a 
                  href="#section-2" 
                  className="block text-sm text-slate-600 hover:text-brand-orange transition-colors font-medium"
                >
                  {t('termsPage.section2Title')}
                </a>
                <a 
                  href="#section-3" 
                  className="block text-sm text-slate-600 hover:text-brand-orange transition-colors font-medium"
                >
                  {t('termsPage.section3Title')}
                </a>
                <a 
                  href="#section-4" 
                  className="block text-sm text-slate-600 hover:text-brand-orange transition-colors font-medium"
                >
                  {t('termsPage.section4Title')}
                </a>
                <a 
                  href="#section-5" 
                  className="block text-sm text-slate-600 hover:text-brand-orange transition-colors font-medium"
                >
                  {t('termsPage.section5Title')}
                </a>
              </nav>

              {/* Contact Help Note */}
              <div className="p-5 bg-slate-50/80 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  {t('termsPage.helpTitle')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {t('termsPage.helpDesc')}{' '}
                  <a href="mailto:info@odst.id" className="text-brand-orange hover:underline font-medium">
                    info@odst.id
                  </a>
                </p>
              </div>
            </aside>

            {/* Right Column: Detailed Content Sections */}
            <div className="lg:col-span-8 space-y-12">
              
              <section id="section-1" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('termsPage.section1Title')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('termsPage.section1Desc')}
                </p>
              </section>

              <section id="section-2" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('termsPage.section2Title')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('termsPage.section2Desc')}
                </p>
                <ul className="list-disc list-inside text-slate-600 text-sm md:text-base pl-2 space-y-2 font-light" dir="auto">
                  <li>{t('termsPage.section2List1')}</li>
                  <li>{t('termsPage.section2List2')}</li>
                  <li>{t('termsPage.section2List3')}</li>
                  <li>{t('termsPage.section2List4')}</li>
                </ul>
              </section>

              <section id="section-3" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('termsPage.section3Title')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('termsPage.section3Desc')}
                </p>
              </section>

              <section id="section-4" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-10">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('termsPage.section4Title')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('termsPage.section4Desc')}
                </p>
              </section>

              <section id="section-5" className="scroll-mt-28 space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-brand-navy font-spectral" dir="auto">
                  {t('termsPage.section5Title')}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light" dir="auto">
                  {t('termsPage.section5Desc')}
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
