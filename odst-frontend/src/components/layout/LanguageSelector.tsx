import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia (ID)' },
  { code: 'en', name: 'English (EN)' },
  { code: 'ar', name: 'العربية (AR)' },
];

export default function LanguageSelector({ isMobile = false }: { isMobile?: boolean }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 border-t border-white/10 pt-4 mt-2">
        <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold px-1">Language</span>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                type="button"
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-brand-orange border-brand-orange text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{lang.code.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-brand-orange transition-colors duration-200 py-1 px-1 bg-transparent border-none focus:outline-none cursor-pointer rtl:space-x-reverse group"
      >
        <Globe size={18} className="text-white group-hover:text-brand-orange transition-colors duration-200 shrink-0 stroke-[1.75]" />
        <span className="uppercase text-sm font-medium tracking-wide text-white group-hover:text-brand-orange transition-colors duration-200">{currentLanguage.code}</span>
        <ChevronDown size={14} className={`text-white group-hover:text-brand-orange transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-xl bg-[#050c1e]/95 backdrop-blur-md border border-white/10 shadow-2xl py-1.5 z-[100] animate-fadeIn origin-top-right rtl:left-0 rtl:right-auto rtl:origin-top-left overflow-hidden"
        >
          {languages.map((lang) => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                type="button"
                className={`w-full flex items-center px-4 py-2.5 text-sm transition-all duration-150 text-left rtl:text-right rtl:space-x-reverse ${
                  isActive
                    ? 'bg-brand-orange/15 text-brand-orange font-medium'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex-grow">{lang.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
