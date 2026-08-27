import { Link } from 'react-router-dom';
import logo from '../../assets/odstlogo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-navy text-white/70 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Info Column */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="ODST Logo" className="h-10 md:h-11 w-auto" />
          </Link>
          <p className="text-white/60 text-sm max-w-md leading-relaxed font-spectral font-normal">
            A premier conglomerate offering dedicated Hajj and Umrah solutions, establishing absolute spiritual tranquility through premium hospitality, logistics, and aviation.
          </p>
        </div>

        {/* Companies Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">Companies</h3>
          <ul className="space-y-2.5 text-sm font-normal">
            <li>
              <a href="/#hotels" className="hover:text-brand-orange transition-colors">
                ODST Hotels
              </a>
            </li>
            <li>
              <a href="/#airlines" className="hover:text-brand-orange transition-colors">
                ODST Airlines
              </a>
            </li>
            <li>
              <a href="/#travel" className="hover:text-brand-orange transition-colors">
                ODST Tour & Travel
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-brand-orange transition-colors">
                Partner Portals
              </a>
            </li>
          </ul>
        </div>

        {/* Resources/Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">Resources</h3>
          <ul className="space-y-2.5 text-sm font-normal">
            <li>
              <a href="/#about" className="hover:text-brand-orange transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-brand-orange transition-colors">
                Latest News
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-brand-orange transition-colors">
                Careers
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-orange transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-10 border-t border-white/5" />

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-normal">
        <p>© {currentYear} ODST Group. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
