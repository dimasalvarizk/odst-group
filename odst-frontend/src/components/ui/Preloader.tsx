import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/odstlogo.png';

interface PreloaderProps {
  /** If provided, manually controls visibility */
  isLoading?: boolean;
  /** Minimum display duration in ms (default 1900ms) */
  minDuration?: number;
}

export default function Preloader({ isLoading, minDuration = 1900 }: PreloaderProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); // 0: Hotels, 1: Airlines, 2: Tour & Travel, 3: ODST Group Logo

  useEffect(() => {
    // If manually controlled
    if (typeof isLoading === 'boolean') {
      if (isLoading) {
        setVisible(true);
        setFading(false);
        setCurrentStage(0);
      } else {
        setFading(true);
        const timer = setTimeout(() => setVisible(false), 450);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Auto trigger on route change
    setVisible(true);
    setFading(false);
    setCurrentStage(0);

    const stepDuration = Math.max(Math.floor(minDuration / 4), 380);

    const t1 = setTimeout(() => setCurrentStage(1), stepDuration);
    const t2 = setTimeout(() => setCurrentStage(2), stepDuration * 2);
    const t3 = setTimeout(() => setCurrentStage(3), stepDuration * 3);

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDuration);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, minDuration + 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname, isLoading, minDuration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-amber-50/20 transition-opacity duration-400 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={fading}
    >
      {/* Centered Morphing Stage */}
      <div className="relative flex flex-col items-center justify-center px-6">
        
        {/* Ambient Subtle Glow */}
        <div className="absolute w-44 h-44 rounded-full bg-[#e06227]/10 blur-2xl -z-10 pointer-events-none transition-all duration-500 animate-pulse-glow" />

        {/* Dynamic Pillar Emblem Container */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          
          {/* Stage 0: ODST Hotels */}
          {currentStage === 0 && (
            <div
              key="hotel-stage"
              className="animate-morph-icon flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100"
            >
              <svg className="w-11 h-11" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Luxury Hotel Building */}
                <path d="M16 54V17C16 15.8954 16.8954 15 18 15H46C47.1046 15 48 15.8954 48 17V54" stroke="#1e2b58" strokeWidth="2.5" strokeLinecap="round" fill="#F8FAFC" />
                <path d="M26 54V42H38V54" stroke="#1e2b58" strokeWidth="2.5" fill="#E06227" fillOpacity="0.15" />
                {/* Hotel Windows */}
                <rect x="22" y="21" width="6" height="5" rx="1" fill="#E06227" />
                <rect x="36" y="21" width="6" height="5" rx="1" fill="#E06227" />
                <rect x="22" y="30" width="6" height="5" rx="1" fill="#E06227" />
                <rect x="36" y="30" width="6" height="5" rx="1" fill="#E06227" />
                {/* Star Crown */}
                <path d="M32 6L33.4 9.8H37.5L34.2 12.2L35.5 16L32 13.6L28.5 16L29.8 12.2L26.5 9.8H30.6L32 6Z" fill="#E06227" />
              </svg>
            </div>
          )}

          {/* Stage 1: ODST Airlines */}
          {currentStage === 1 && (
            <div
              key="airline-stage"
              className="animate-morph-icon flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100"
            >
              <svg className="w-11 h-11" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Flight Path */}
                <path d="M10 48C18 36 28 26 54 16" stroke="#E06227" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" opacity="0.6" />
                {/* Airliner Silhouette */}
                <g transform="translate(13, 13) rotate(-12 20 20)">
                  <path d="M6 23L38 23C44 23 48 20.5 48 19.5C48 18.5 44 16 38 16L6 16L10 19.5L6 23Z" fill="#1e2b58" />
                  <path d="M18 16L10 3L17 3L31 16Z" fill="#E06227" />
                  <path d="M6 16L2 7L7 7L13 16Z" fill="#1e2b58" />
                  <path d="M21 23L14 34L19 34L29 23Z" fill="#E06227" opacity="0.85" />
                </g>
              </svg>
            </div>
          )}

          {/* Stage 2: ODST Tour & Travel */}
          {currentStage === 2 && (
            <div
              key="travel-stage"
              className="animate-morph-icon flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100"
            >
              <svg className="w-11 h-11" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Globe / Compass Orbit */}
                <circle cx="32" cy="32" r="22" stroke="#1e2b58" strokeWidth="2.2" strokeDasharray="2 3" fill="#F8FAFC" />
                <circle cx="32" cy="32" r="16" stroke="#E06227" strokeWidth="1.2" strokeDasharray="4 2" fill="none" opacity="0.4" />
                {/* Pilgrimage Compass Needle */}
                <path d="M32 14L36 29L32 27L28 29L32 14Z" fill="#E06227" />
                <path d="M32 50L36 35L32 37L28 35L32 50Z" fill="#1e2b58" />
                <path d="M14 32L29 28L27 32L29 36L14 32Z" fill="#1e2b58" opacity="0.4" />
                <path d="M50 32L35 28L37 32L35 36L50 32Z" fill="#1e2b58" opacity="0.4" />
                <circle cx="32" cy="32" r="3.5" fill="#E06227" />
              </svg>
            </div>
          )}

          {/* Stage 3: ODST Group Official Brand Logo */}
          {currentStage === 3 && (
            <div
              key="group-stage"
              className="animate-morph-icon flex items-center justify-center"
            >
              <img
                src={logo}
                alt="ODST Group"
                className="h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(224,98,39,0.18)]"
              />
            </div>
          )}
        </div>

        {/* Animated Labels */}
        <div className="h-12 flex flex-col items-center justify-center text-center">
          {currentStage === 0 && (
            <div className="animate-morph-icon flex flex-col items-center">
              <span className="text-sm font-extrabold uppercase tracking-widest text-[#1e2b58]">
                {t('services.hotels.title', 'ODST Hotels')}
              </span>
              <span className="text-[11px] font-semibold text-[#e06227] tracking-wider uppercase mt-0.5">
                {t('services.hotels.badge', 'Hospitality & Stay')}
              </span>
            </div>
          )}

          {currentStage === 1 && (
            <div className="animate-morph-icon flex flex-col items-center">
              <span className="text-sm font-extrabold uppercase tracking-widest text-[#1e2b58]">
                {t('services.airlines.title', 'ODST Airlines')}
              </span>
              <span className="text-[11px] font-semibold text-[#e06227] tracking-wider uppercase mt-0.5">
                {t('services.airlines.badge', 'Aviation & Charters')}
              </span>
            </div>
          )}

          {currentStage === 2 && (
            <div className="animate-morph-icon flex flex-col items-center">
              <span className="text-sm font-extrabold uppercase tracking-widest text-[#1e2b58]">
                {t('services.travel.title', 'ODST Tour & Travel')}
              </span>
              <span className="text-[11px] font-semibold text-[#e06227] tracking-wider uppercase mt-0.5">
                {t('services.travel.badge', 'Sacred Journeys')}
              </span>
            </div>
          )}

          {currentStage === 3 && (
            <div className="animate-morph-icon flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#1e2b58]">
                ODST Group
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider mt-0.5">
                Hotels • Airlines • Tour & Travel
              </span>
            </div>
          )}
        </div>

        {/* 3 Pillars Connection Progress Bar */}
        <div className="mt-5 flex items-center gap-1.5">
          {/* Pillar 1 indicator */}
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              currentStage === 0
                ? 'w-7 bg-[#e06227]'
                : currentStage > 0
                ? 'w-4 bg-[#e06227]/70'
                : 'w-2 bg-slate-200'
            }`}
          />
          {/* Pillar 2 indicator */}
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              currentStage === 1
                ? 'w-7 bg-[#e06227]'
                : currentStage > 1
                ? 'w-4 bg-[#e06227]/70'
                : 'w-2 bg-slate-200'
            }`}
          />
          {/* Pillar 3 indicator */}
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              currentStage === 2
                ? 'w-7 bg-[#e06227]'
                : currentStage === 3
                ? 'w-4 bg-[#e06227]/70'
                : 'w-2 bg-slate-200'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
