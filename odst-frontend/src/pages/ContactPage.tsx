import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import ContactHero from '../components/sections/ContactHero';
import ContactForm from '../components/sections/ContactForm';
import ContactConnections from '../components/sections/ContactConnections';
import Footer from '../components/layout/Footer';

export default function ContactPage() {
  // Ensure the page loads scrolled to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner Header Section */}
      <ContactHero />

      {/* Split Content Form & Connections Grid Section */}
      <main className="flex-grow py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right Column: Direct Connections */}
            <div className="lg:col-span-5">
              <ContactConnections />
            </div>
          </div>
        </div>
      </main>

      {/* Shared Footer Section */}
      <Footer />
    </div>
  );
}
