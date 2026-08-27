import { useTranslation } from 'react-i18next';
import { images } from '../../utils/images';

export default function ContactHero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${images.contactHero})` }}
      />
      
      {/* Dark Translucent Overlay - using exact rgba(0, 0, 0, 0.75) */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in">
        {/* Subtitle Badge */}
        <span className="inline-block text-brand-orange text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 opacity-90">
          {t('contactHero.badge')}
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
          {t('contactHero.title')}
        </h1>

        {/* Paragraph Description using Spectral font */}
        <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-spectral font-normal">
          {t('contactHero.description')}
        </p>
      </div>
    </section>
  );
}
