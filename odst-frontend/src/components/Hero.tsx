import { images } from '../utils/images';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Style */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105"
        style={{ backgroundImage: `url(${images.heroMosque})` }}
      />
      
      {/* Dark Gradient Overlay for optimal readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/65 to-white" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white fade-in mt-16 md:mt-24">
        {/* Subtitle/Badge */}
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

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#services"
            className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-brand-orange/20 transition-all duration-300 transform hover:-translate-y-0.5 text-center text-sm tracking-wider uppercase"
          >
            Explore Our Services
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-center text-sm tracking-wider uppercase"
          >
            Contact Us
          </a>
        </div>
      </div>
      
      {/* Decorative Bottom Wave/Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 120L0 120L0 0C60 70.83 240 101.17 600 101.17C960 101.17 1140 70.83 1200 0V120Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
