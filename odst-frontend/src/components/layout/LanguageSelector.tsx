import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import { FlagID, FlagEN, FlagAR } from '../ui/FlagIcons';

interface Language {
  code: string;
  label: string;
  name: string;
  nativeName: string;
  Flag: React.FC<{ className?: string }>;
}

const languages: Language[] = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia', nativeName: 'Indonesia', Flag: FlagID },
  { code: 'en', label: 'EN', name: 'English', nativeName: 'English', Flag: FlagEN },
  { code: 'ar', label: 'AR', name: 'العربية', nativeName: 'Arabic', Flag: FlagAR },
];

export default function LanguageSelector({ isMobile = false }: { isMobile?: boolean }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];
  const CurrentFlag = currentLanguage.Flag;

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
            const Flag = lang.Flag;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                type="button"
                className={`flex items-center justify-center space-x-2 py-2 px-2 rounded-lg border transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-brand-orange border-brand-orange text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <Flag className="w-4 h-3" />
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
        className={`flex items-center space-x-2 text-white/90 hover:text-white font-medium text-xs transition-all duration-200 py-1.5 px-3 rounded-lg bg-slate-900/95 hover:bg-slate-800 border shadow-sm focus:outline-none rtl:space-x-reverse ${
          isOpen ? 'border-brand-orange ring-1 ring-brand-orange/40' : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <CurrentFlag className="w-4 h-3" />
        <span className="uppercase tracking-wider font-bold">{currentLanguage.code}</span>
        <ChevronDown size={13} className={`opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-orange' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0b1329] border border-slate-700/80 shadow-2xl py-1.5 z-[100] animate-fadeIn origin-top-right rtl:left-0 rtl:right-auto rtl:origin-top-left overflow-hidden"
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800/70 mb-1">
            Pilih Bahasa / Language
          </div>
          {languages.map((lang) => {
            const isActive = i18n.language === lang.code;
            const Flag = lang.Flag;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all duration-150 text-left rtl:text-right rtl:space-x-reverse ${
                  isActive
                    ? 'bg-brand-orange/15 text-brand-orange font-semibold'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <Flag className="w-4 h-3" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-100">{lang.name}</span>
                    <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                  </div>
                </div>
                {isActive ? (
                  <Check size={14} className="text-brand-orange" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{lang.label}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
