import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useScroll } from '../../hooks/useScroll';
import logo from '../../assets/odstlogo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScroll(20);
  const location = useLocation();
  
  const isContactPage = location.pathname === '/contact';

  const navItems = [
    { label: 'About Us', href: '/#about', to: '/', isSpaLink: false },
    { label: 'Companies', href: '/#services', to: '/', isSpaLink: false },
    { label: 'Contact', href: '/contact', to: '/contact', isSpaLink: true },
  ];

  const renderLink = (item: typeof navItems[0], isMobile = false) => {
    // Check if link is active
    const isActive = 
      (item.isSpaLink && isContactPage) || 
      (!item.isSpaLink && !isContactPage && location.hash === item.href.substring(1));

    const baseClasses = isMobile
      ? `font-normal text-base py-1 transition-colors duration-200 ${
          isActive ? 'text-brand-orange font-medium' : 'text-white/85 hover:text-brand-orange'
        }`
      : `font-normal text-sm transition-colors duration-200 relative group py-1 ${
          isActive ? 'text-brand-orange font-medium' : 'text-white/80 hover:text-white'
        }`;

    const underlineBar = !isMobile && (
      <span
        className={`absolute bottom-[-4px] left-0 h-0.5 bg-brand-orange transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    );

    if (item.isSpaLink) {
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
      <a
        key={item.label}
        href={item.href}
        onClick={() => isMobile && setIsOpen(false)}
        className={baseClasses}
      >
        {item.label}
        {underlineBar}
      </a>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050c1e]/85 backdrop-blur-md shadow-lg border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[85rem] mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 focus:outline-none">
          <img src={logo} alt="ODST Logo" className="h-10 md:h-11 w-auto hover:opacity-90 transition-opacity" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => renderLink(item, false))}
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
        className={`md:hidden absolute top-full left-0 w-full bg-brand-navy border-t border-white/10 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col py-4 px-6 space-y-4">
          {navItems.map((item) => renderLink(item, true))}
        </div>
      </div>
    </nav>
  );
}
