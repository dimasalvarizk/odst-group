import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Newsletter from '../components/sections/Newsletter';

export default function LandingPage() {
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
