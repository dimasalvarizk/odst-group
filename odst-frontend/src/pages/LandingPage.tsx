import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Newsletter from '../components/sections/Newsletter';
import { scrollToSection } from '../utils/scrollHelper';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        scrollToSection(state.scrollTo!);
      }, 100);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(hashId);
      }, 100);
    }
  }, [location]);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Services block (Hotels, Airlines, Tour & Travel) */}
        <Services />

        {/* Newsletter Subscription Section */}
        <Newsletter />
      </main>

      {/* Footer & Links */}
      <Footer />
    </div>
  );
}
