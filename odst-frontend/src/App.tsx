import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceSection from './components/ServiceSection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* About/Intro & Services block */}
        <ServiceSection />

        {/* Newsletter Subscription Section */}
        <Newsletter />
      </main>

      {/* Footer & Links */}
      <Footer />
    </div>
  );
}

export default App;
