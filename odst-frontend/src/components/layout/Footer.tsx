import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/odstlogo.png';
import { scrollToSection } from '../../utils/scrollHelper';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <footer id="contact" className="relative bg-gradient-to-b from-[#1e2b58] to-[#131b3b] text-white/70 pt-16 pb-12 border-t border-white/10 text-start overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-navy/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Info Column */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          <Link
            to="/"
            aria-label="ODST Group - Home"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                scrollToSection('about');
              }
            }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse group"
          >
            <img
              src={logo}
              alt="ODST Group Logo"
              className="h-10 md:h-11 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 drop-shadow-sm"
            />
          </Link>
          <p className="text-white/60 text-sm max-w-md leading-relaxed font-spectral font-normal">
            {t('footer.description')}
          </p>
        </div>

        {/* Companies Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">
            {t('footer.headings.companies')}
          </h3>
          <ul className="space-y-3 text-sm font-normal">
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('hotels')}
                className="group flex items-center gap-2 hover:text-brand-orange transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-300" />
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                  {t('services.hotels.title')}
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('airlines')}
                className="group flex items-center gap-2 hover:text-brand-orange transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-300" />
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                  {t('services.airlines.title')}
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('travel')}
                className="group flex items-center gap-2 hover:text-brand-orange transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-300" />
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                  {t('services.travel.title')}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Resources/Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">
            {t('footer.headings.resources')}
          </h3>
          <ul className="space-y-3 text-sm font-normal">
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('about')}
                className="group flex items-center gap-2 hover:text-brand-orange transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-300" />
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                  {t('footer.links.about')}
                </span>
              </button>
            </li>

            <li>
              <Link
                to="/contact"
                aria-label="ODST Group - Contact Us"
                className="group flex items-center gap-2 text-white/70 hover:text-brand-orange transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-300" />
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                  {t('footer.links.contact')}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Animated Gradient Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent w-full" />
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-normal">
        <p className="text-white/60">{t('footer.rights', { year: currentYear })}</p>
        
        <div className="flex space-x-6 rtl:space-x-reverse">
          <Link
            to="/privacy-policy"
            aria-label="ODST Group - Privacy Policy"
            className="text-white/70 hover:text-brand-orange transition-colors duration-300"
          >
            {t('footer.links.privacy')}
          </Link>
          <Link
            to="/terms-of-service"
            aria-label="ODST Group - Terms of Service"
            className="text-white/70 hover:text-brand-orange transition-colors duration-300"
          >
            {t('footer.links.terms')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
