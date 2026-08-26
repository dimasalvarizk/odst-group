import { Button } from '../ui/Button';
import { images } from '../../utils/images';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Scale Animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105"
        style={{ backgroundImage: `url(${images.heroMosque})` }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/65 to-white" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in mt-16 md:mt-24">
        {/* Subtitle Badge */}
        <span className="inline-block text-brand-orange text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 opacity-90">
          MANAZIL AL MUKHTARA GROUP
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">ODST Group</span>
        </h1>

        {/* Paragraph Description */}
        <p className="text-base md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Your trusted partner for Hajj & Umrah — providing world-class hotels, premium aviation, and dedicated tour services for a seamless spiritual journey.
        </p>

        {/* Call to Actions utilizing UI Button components */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button href="#services" variant="primary" size="lg" className="w-full sm:w-auto">
            Explore Our Services
          </Button>
          <Button href="#contact" variant="outline" size="lg" className="w-full sm:w-auto">
            Contact Us
          </Button>
        </div>
      </div>
      
      {/* Decorative Bottom Wave Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 120L0 120L0 0C60 70.83 240 101.17 600 101.17C960 101.17 1140 70.83 1200 0V120Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
