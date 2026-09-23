import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo-group.png';

interface PreloaderProps {
  /** If provided, manually controls visibility */
  isLoading?: boolean;
  /** Minimum display duration in ms (default 1200ms) */
  minDuration?: number;
}

export default function Preloader({ isLoading, minDuration = 1200 }: PreloaderProps) {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith('/internal-odst-gate') ||
    location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable on admin and login pages
    if (isAdminRoute) {
      setVisible(false);
      return;
    }
    // If manually controlled
    if (typeof isLoading === 'boolean') {
      if (isLoading) {
        setVisible(true);
        setFading(false);
        setProgress(20);
      } else {
        setProgress(100);
        setFading(true);
        const timer = setTimeout(() => setVisible(false), 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Auto trigger on route change / first load
    setVisible(true);
    setFading(false);
    setProgress(0);

    // Smooth incremental progress
    const tStart = setTimeout(() => setProgress(35), 80);
    const tMid = setTimeout(() => setProgress(75), minDuration * 0.45);
    const tEnd = setTimeout(() => setProgress(100), minDuration * 0.85);

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDuration);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, minDuration + 500);

    return () => {
      clearTimeout(tStart);
      clearTimeout(tMid);
      clearTimeout(tEnd);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname, isLoading, minDuration, isAdminRoute]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] select-none ${fading
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
        }`}
      aria-hidden={fading}
    >
      {/* Ambient Soft Brand Radial Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-[#242E69]/5 via-[#E06227]/8 to-transparent blur-3xl -z-10 pointer-events-none animate-pulse-glow" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center px-6">

        {/* Pure ODST Logo with Smooth Entrance & Subtle Float */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Logo with Soft Shimmer Clip */}
          <div className="relative overflow-hidden p-2">
            <img
              src={logo}
              alt="ODST"
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-700 ease-out transform"
            />
            {/* Shimmer Light Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Minimalist Smooth Line Progress Indicator */}
        <div className="w-28 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#242E69] via-[#E06227] to-[#E06227] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
