import logo from '../../assets/logo.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-navy text-white/70 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Info Column */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          <a href="#" className="flex items-center space-x-2">
            <img src={logo} alt="ODST Logo" className="h-10 w-auto" />
          </a>
          <p className="text-white/60 text-sm max-w-md leading-relaxed">
            A leading group company offering specialized travel and transit packages, including top-tier hospitality, aviation logistics, and guidance to the holy sites for an unforgettable spiritual journey.
          </p>
        </div>

        {/* Services Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase">Our Services</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#services" className="hover:text-brand-orange transition-colors">
                ODST Hotels
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-brand-orange transition-colors">
                ODST Airlines
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-brand-orange transition-colors">
                ODST Tour & Travel
              </a>
            </li>
          </ul>
        </div>

        {/* Resources/Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase">Resources</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#about" className="hover:text-brand-orange transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#newsletter" className="hover:text-brand-orange transition-colors">
                Newsletter
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-brand-orange transition-colors">
                Contact & Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-10 border-t border-white/5" />

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p>© {currentYear} ODST Group. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
