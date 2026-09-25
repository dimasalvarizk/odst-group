import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { images } from '../utils/images';
import { scrollToSection } from '../utils/scrollHelper';

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navTabs = [
    { id: 'section-overview', label: t('privacyPage.navTabs.overview') },
    { id: 'section-data', label: t('privacyPage.navTabs.data') },
    { id: 'section-usage', label: t('privacyPage.navTabs.usage') },
    { id: 'section-security', label: t('privacyPage.navTabs.security') },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    scrollToSection(id);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 flex flex-col font-sans text-start selection:bg-brand-orange selection:text-white">
      {/* Sleek visible navbar */}
      <Navbar />

      {/* Main Content Area - Directly unified without hero */}
      <main className="relative flex-grow pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#fcfcfd]">
        {/* Full-width seamless background image with subtle drift and smooth gradient mask */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 animate-bg-drift"
          style={{
            backgroundImage: `url(${images.hero1})`,
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 space-y-14">
          
          {/* Header Section with Staggered Entrance Animation */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-navy block animate-fade-in-up delay-100">
              {t('privacyPage.eyebrow')}
            </span>
            <div className="w-12 h-0.5 bg-brand-orange mx-auto animate-fade-in-up delay-150" />
            
            <h1 className="text-3xl md:text-5xl font-normal font-spectral text-brand-navy tracking-tight animate-fade-in-up delay-200">
              {t('privacyPage.title')}
            </h1>

            <p className="text-slate-500 text-xs font-light tracking-wider animate-fade-in-up delay-250">
              {t('privacyPage.lastUpdated')}
            </p>

            {/* Quick Section Filter / Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 animate-fade-in-up delay-300">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-[#1e2b58] text-white shadow-md scale-105'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-brand-navy hover:border-slate-300 hover:shadow-xs hover:scale-102'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Grid with Left/Right Entrance Animations */}
          <div id="section-overview" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start scroll-mt-28">
            
            {/* Left Column: Numbered Step-by-Step Flow */}
            <div className="lg:col-span-6 space-y-8 animate-fade-in-left delay-200">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-normal text-brand-navy font-spectral">
                  {t('privacyPage.introTitle')}
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
                  {t('privacyPage.introDesc')}
                </p>
              </div>

              {/* Numbered Step Items with Interactive Hover Effects */}
              <div className="space-y-4 pt-1">
                <div className="group p-3 -mx-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 flex items-start gap-4 cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#1e2b58] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:bg-brand-orange group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-navy transition-colors">
                      {t('privacyPage.step1Title')}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('privacyPage.step1Desc')}
                    </p>
                  </div>
                </div>

                <div className="group p-3 -mx-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 flex items-start gap-4 cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#1e2b58] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:bg-brand-orange group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-navy transition-colors">
                      {t('privacyPage.step2Title')}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('privacyPage.step2Desc')}
                    </p>
                  </div>
                </div>

                <div className="group p-3 -mx-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 flex items-start gap-4 cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#1e2b58] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:bg-brand-orange group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-navy transition-colors">
                      {t('privacyPage.step3Title')}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {t('privacyPage.step3Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Action Button */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#1e2b58] hover:bg-[#283870] text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <span>{t('nav.contact') || 'Hubungi Kami'}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    {isRtl ? '←' : '→'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Feature Card with Checkmarks & Hover Elevation */}
            <div
              id="section-data"
              className="lg:col-span-6 bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-400 p-8 md:p-10 space-y-6 border-l-4 border-l-[#1e2b58] scroll-mt-28 rounded-r-2xl animate-fade-in-right delay-300"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange block">
                  {t('privacyPage.dataBadge')}
                </span>
                <h3 className="text-2xl md:text-3xl font-normal text-brand-navy font-spectral">
                  {t('privacyPage.dataTitle')}
                </h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-light">
                {t('privacyPage.dataDesc')}
              </p>

              {/* Clean Checkmark List with Micro-Hover Animation */}
              <div className="space-y-3 pt-2">
                {[
                  t('privacyPage.dataList1'),
                  t('privacyPage.dataList2'),
                  t('privacyPage.dataList3'),
                  t('privacyPage.dataList4'),
                  t('privacyPage.dataList5'),
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-3 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50/80 transition-colors duration-200 text-xs md:text-sm text-slate-700 font-light"
                  >
                    <span className="text-brand-navy font-bold text-sm leading-none shrink-0 mt-0.5 group-hover:text-brand-orange group-hover:scale-125 transition-all duration-200">
                      ✓
                    </span>
                    <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lower Section: Interactive Usage & Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Usage Card */}
            <div
              id="section-usage"
              className="bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 p-8 space-y-5 border-l-4 border-l-brand-orange scroll-mt-28 rounded-r-2xl animate-fade-in-up delay-400"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy block">
                {t('privacyPage.useBadge')}
              </span>
              <h3 className="text-xl md:text-2xl font-normal text-brand-navy font-spectral">
                {t('privacyPage.useTitle')}
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                {t('privacyPage.useDesc')}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  t('privacyPage.useList1'),
                  t('privacyPage.useList2'),
                  t('privacyPage.useList3'),
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start gap-3 text-xs md:text-sm text-slate-700 font-light">
                    <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-brand-orange group-hover:text-white text-brand-navy text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300">
                      {idx + 1}
                    </span>
                    <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Contact Card */}
            <div
              id="section-security"
              className="bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 p-8 space-y-5 border-l-4 border-l-[#1e2b58] scroll-mt-28 rounded-r-2xl flex flex-col justify-between animate-fade-in-up delay-500"
            >
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange block">
                  {t('privacyPage.securityBadge')}
                </span>
                <h3 className="text-xl md:text-2xl font-normal text-brand-navy font-spectral">
                  {t('privacyPage.sharingTitle')}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                  {t('privacyPage.sharingDesc')}
                </p>
              </div>

              {/* Direct Help Footer inside card */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  {t('privacyPage.contactTitle')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {t('privacyPage.contactDesc')}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="mailto:info@odst.id"
                    aria-label="Send email to info@odst.id"
                    className="text-xs font-semibold text-brand-orange hover:underline transition-all"
                  >
                    info@odst.id
                  </a>
                  <span className="text-slate-300">•</span>
                  <Link
                    to="/"
                    aria-label="Back to ODST Group Home"
                    className="text-xs text-slate-500 hover:text-brand-navy transition-colors font-medium hover:underline"
                  >
                    {t('comingSoon.backHome') || 'Beranda'}
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer is cleanly separated and 100% visible */}
      <Footer />
    </div>
  );
}





