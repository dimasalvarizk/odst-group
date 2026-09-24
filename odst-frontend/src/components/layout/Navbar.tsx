import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScroll } from '../../hooks/useScroll';
import logo from '../../assets/odstlogo.png';
import LanguageSelector from './LanguageSelector';
import { scrollToSection } from '../../utils/scrollHelper';

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScroll(20);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'about' | 'services' | null>('about');

  const isContactPage = location.pathname === '/contact';

  // Scroll listener to update active section when on Landing page
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
      return;
    }

    const handleScrollActive = () => {
      const servicesElement = document.getElementById('services');
      if (servicesElement) {
        const rect = servicesElement.getBoundingClientRect();
        if (rect.top <= 250) {
          setActiveSection('services');
        } else {
          setActiveSection('about');
        }
      }
    };

    window.addEventListener('scroll', handleScrollActive, { passive: true });
    handleScrollActive();
    return () => window.removeEventListener('scroll', handleScrollActive);
  }, [location.pathname]);

  const handleSectionClick = (sectionId: string, isMobile = false) => {
    if (isMobile) setIsOpen(false);

    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const navItems = [
    { label: t('nav.about'), sectionId: 'about', isPage: false },
    { label: t('nav.companies'), sectionId: 'services', isPage: false },
    { label: t('nav.contact'), to: '/contact', isPage: true },
  ];

  const renderLink = (item: (typeof navItems)[0], isMobile = false) => {
    const isActive =
      (item.isPage && isContactPage) ||
      (!item.isPage && location.pathname === '/' && activeSection === item.sectionId);

    const baseClasses = isMobile
      ? `font-normal text-base py-1 transition-colors duration-200 text-left rtl:text-right w-full bg-transparent border-none cursor-pointer ${
          isActive ? 'text-brand-orange font-medium' : 'text-white/85 hover:text-brand-orange'
        }`
      : `font-normal text-sm transition-colors duration-200 relative group py-1 bg-transparent border-none cursor-pointer ${
          isActive ? 'text-brand-orange font-medium' : 'text-white/80 hover:text-white'
        }`;

    const underlineBar = !isMobile && (
      <span
        className={`absolute bottom-[-4px] start-0 h-0.5 bg-brand-orange transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    );

    if (item.isPage && item.to) {
      return (
        <Link
          key={item.label}
          to={item.to}
          onClick={() => isMobile && setIsOpen(false)}
          className={baseClasses}
        >
          {item.label}
          {underlineBar}
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        onClick={() => handleSectionClick(item.sectionId!, isMobile)}
        className={baseClasses}
      >
        {item.label}
        {underlineBar}
      </button>
    );
  };

  const isLightTopPage = location.pathname === '/privacy-policy' || location.pathname === '/terms-of-service';

  return (
    <nav
      className={`fixed top-0 start-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isLightTopPage
          ? 'bg-[#050c1e]/85 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[85rem] mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              scrollToSection('about');
            }
          }}
          className="flex items-center space-x-2 rtl:space-x-reverse focus:outline-none"
        >
          <img src={logo} alt="ODST Logo" className="h-10 md:h-11 w-auto hover:opacity-90 transition-opacity" />
        </Link>

        {/* Desktop Links & Language Selector */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          {navItems.map((item) => renderLink(item, false))}
          <LanguageSelector />
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-brand-orange focus:outline-none p-1 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden absolute top-full start-0 w-full bg-brand-navy border-t border-white/10 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col py-4 px-6 space-y-4">
          {navItems.map((item) => renderLink(item, true))}
          <LanguageSelector isMobile />
        </div>
      </div>
    </nav>
  );
}
