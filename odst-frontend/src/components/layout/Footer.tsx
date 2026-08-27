import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/odstlogo.png';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-navy text-white/70 py-16 border-t border-white/10 text-start">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Info Column */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
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
              <a href="/#hotels" className="hover:text-brand-orange transition-colors">
                {t('services.hotels.title')}
              </a>
            </li>
            <li>
              <a href="/#airlines" className="hover:text-brand-orange transition-colors">
                {t('services.airlines.title')}
              </a>
            </li>
            <li>
              <a href="/#travel" className="hover:text-brand-orange transition-colors">
                {t('services.travel.title')}
              </a>
            </li>

          </ul>
        </div>

        {/* Resources/Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h3 className="text-[#e87729] font-sans font-bold text-sm tracking-wider uppercase">{t('footer.headings.resources')}</h3>
          <ul className="space-y-2.5 text-sm font-normal">
            <li>
              <a href="/#about" className="hover:text-brand-orange transition-colors">
                {t('footer.links.about')}
              </a>
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
