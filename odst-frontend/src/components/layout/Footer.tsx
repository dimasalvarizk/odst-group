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
    <footer id="contact" className="bg-brand-navy text-white/70 py-16 border-t border-white/10 text-start">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Info Column */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                scrollToSection('about');
              }
            }}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <img src={logo} alt="ODST Logo" className="h-10 md:h-11 w-auto" />
          </Link>
          <p className="text-white/60 text-sm max-w-md leading-relaxed font-spectral font-normal">
            {t('footer.description')}
          </p>
        </div>

        {/* Companies Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">{t('footer.headings.companies')}</h3>
          <ul className="space-y-2.5 text-sm font-normal">
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('hotels')}
                className="hover:text-brand-orange transition-colors bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                {t('services.hotels.title')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('airlines')}
                className="hover:text-brand-orange transition-colors bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                {t('services.airlines.title')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('travel')}
                className="hover:text-brand-orange transition-colors bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                {t('services.travel.title')}
              </button>
            </li>

          </ul>
        </div>

        {/* Resources/Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">{t('footer.headings.resources')}</h3>
          <ul className="space-y-2.5 text-sm font-normal">
            <li>
              <button
                type="button"
                onClick={() => handleSectionClick('about')}
                className="hover:text-brand-orange transition-colors bg-transparent border-none p-0 cursor-pointer text-white/70 text-sm text-left rtl:text-right"
              >
                {t('footer.links.about')}
              </button>
            </li>

            <li>
              <Link to="/contact" className="hover:text-brand-orange transition-colors">
                {t('footer.links.contact')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-10 border-t border-white/5" />

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-normal">
        <p>{t('footer.rights', { year: currentYear })}</p>
        <div className="flex space-x-6 rtl:space-x-reverse">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            {t('footer.links.privacy')}
          </Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">
            {t('footer.links.terms')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
