import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import logo from '../assets/odstlogo.png';
import { images } from '../utils/images';

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen bg-[#050c1e] text-white flex flex-col justify-between overflow-hidden font-sans">
      
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: `url(${images.contactHero})`,
          filter: 'brightness(0.15) contrast(1.1)' 
        }} 
      />

      {/* Background glowing circle decorator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3.5 group">
          <img src={logo} alt="ODST Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-102" />
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto space-y-8 py-16">
        
        {/* Animated Clock Badge */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-white/5 border border-white/10 backdrop-blur rounded-full text-brand-gold text-xs font-bold uppercase tracking-widest animate-pulse">
          <Clock size={14} className="text-brand-orange" />
          <span>Digital Portal Under Construction</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Coming Soon
          </h1>
          <p className="text-base md:text-xl text-slate-350 max-w-2xl font-light font-spectral leading-relaxed">
            We are crafting a refined, bespoke digital experience for this service to match our premium standards. The full gateway will be live shortly to assist your spiritual and travel arrangements.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-brand-orange/20 hover:-translate-y-0.5 transition-all"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 border-t border-white/5 bg-black/20 text-[10px] text-slate-500 uppercase tracking-widest">
        © 2026 ODST Group. All rights reserved.
      </footer>

    </div>
  );
}
