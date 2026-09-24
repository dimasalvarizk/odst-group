import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { images } from '../utils/images';
import Navbar from '../components/layout/Navbar';

export default function ComingSoonPage() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen h-screen flex flex-col justify-between items-center overflow-hidden bg-[#050c1e] text-white font-sans selection:bg-brand-orange selection:text-white">
      {/* Official Standard Navbar */}
      <Navbar />

      {/* Fullscreen Atmospheric Background Image with Subtle Slow Drift */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-bg-drift pointer-events-none"
        style={{ backgroundImage: `url(${images.hero1})` }}
      />

      {/* Cinematic Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050c1e]/85 via-black/70 to-[#050c1e]/90 pointer-events-none" />

      {/* Center Hero Content - Minimalist & Cinematic */}
      <main className="relative z-20 max-w-3xl mx-auto px-6 text-center space-y-6 md:space-y-8 my-auto pt-24 md:pt-28">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.2em] md:tracking-[0.25em] text-white uppercase drop-shadow-xl animate-fade-in-up delay-200 leading-tight">
          COMING SOON
        </h1>

        {/* Subtitle & Message */}
        <div className="space-y-2 max-w-xl mx-auto text-white/80 font-light text-xs sm:text-sm md:text-base leading-relaxed tracking-wide animate-fade-in-up delay-300">
          <p>
            {t('comingSoon.statusDesc') ||
              'Kami sedang mempersiapkan pengalaman digital baru untuk Anda.'}
          </p>
          <p className="text-white/60 text-xs sm:text-sm">
            {t('comingSoon.desc2') ||
              'Layanan ini akan segera tersedia. Hubungi kami untuk informasi lebih lanjut.'}
          </p>
        </div>

        {/* Minimalist Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
          <Link
            to="/contact"
            className="px-8 py-3.5 border border-white/50 hover:border-white hover:bg-white hover:text-[#050c1e] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm shadow-lg backdrop-blur-xs active:scale-95 cursor-pointer"
          >
            {t('nav.contact') || 'HUBUNGI KAMI'}
          </Link>

          <Link
            to="/"
            className="text-xs text-white/60 hover:text-white uppercase tracking-widest font-medium transition-colors py-2 px-3"
          >
            ← {t('comingSoon.backHome') || 'Beranda'}
          </Link>
        </div>
      </main>

      {/* Bottom Footer / Copyright */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white/50 animate-fade-in-up delay-500">
        <p>© {currentYear} ODST Group. All Rights Reserved.</p>
        
        <div className="flex items-center space-x-5 rtl:space-x-reverse">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            {t('footer.links.privacy')}
          </Link>
          <span>•</span>
          <Link
            to="/terms-of-service"
            className="hover:text-white transition-colors"
          >
            {t('footer.links.terms')}
          </Link>
        </div>
      </footer>
    </div>
  );
}
