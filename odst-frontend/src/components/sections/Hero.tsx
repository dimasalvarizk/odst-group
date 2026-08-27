import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { images } from '../../utils/images';

export default function Hero() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [images.hero1, images.hero2, images.hero3];
  const slideDuration = 5000; // 5 seconds per slide

  // Automatic slideshow trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, slideDuration);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="about" className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images Crossfade with smooth Ken Burns Zoom */}
      {heroSlides.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transform ${
            currentSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            transition: 'opacity 2000ms ease-in-out, transform 6000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      ))}
      
      {/* Dark Brand Overlay for contrast - using exact rgba(5, 12, 30, 0.55) */}
      <div className="absolute inset-0 bg-[#050c1e]/55" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in mt-16 md:mt-24">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 leading-tight" dir="auto">
          {t('hero.title')}
        </h1>

        {/* Paragraph Description */}
        <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-spectral font-normal" dir="auto">
          {t('hero.description')}
        </p>

        {/* Single Centered Solid Dark CTA Button - using exact rgba(36, 46, 105, 1) */}
        <div className="flex justify-center">
          <a
            href="#services"
            className="bg-[#242E69] hover:bg-[#242E69]/95 text-white font-semibold py-3.5 px-8 rounded-sm tracking-widest text-[10px] md:text-xs uppercase transition-all duration-300 transform active:scale-95 border border-white/10 shadow-lg"
          >
            {t('hero.cta')}
          </a>
        </div>
      </div>
      
      {/* Interactive 3-Segment Slide Indicator Bar */}
      <div className="absolute bottom-10 start-6 md:start-12 z-10 flex space-x-2 rtl:space-x-reverse">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group focus:outline-none p-1"
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          >
            <div
              className={`w-8 md:w-10 h-[3px] transition-all duration-500 rounded-full ${
                currentSlide === idx ? 'bg-brand-orange' : 'bg-white/25'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
