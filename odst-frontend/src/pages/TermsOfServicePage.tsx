import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#050c1e] text-white pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-2 block">
            ODST Group Guidelines
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-spectral">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            Last Updated: August 27, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-12 space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">1. Acceptance of Terms</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              By accessing this website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">2. Use License</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Permission is granted to temporarily view the materials (information or services description) on ODST Group's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm pl-4 space-y-1 font-light">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on ODST Group's website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">3. Disclaimers</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              The materials on ODST Group's website are provided on an 'as is' basis. ODST Group makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">4. Service Limitations</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              ODST Group represents several divisions (Hotels, Airlines, and Tour & Travel). All booking inquiries, chartered aviation schedules, and pilgrim packages are subject to final confirmations and written agreements between you and our service coordinators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-spectral">5. Governing Law</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              These terms and conditions are governed by and construed in accordance with the laws of the Republic of Indonesia and Saudi Arabia (where applicable for pilgrimage logistics) and you irrevocably submit to the exclusive jurisdiction of the courts in those locations.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
