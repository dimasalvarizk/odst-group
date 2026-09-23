import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo-group.png';

interface PreloaderProps {
  /** If provided, manually controls visibility */
  isLoading?: boolean;
  /** Minimum display duration in ms (default 800ms) */
  minDuration?: number;
}

export default function Preloader({ isLoading, minDuration = 850 }: PreloaderProps) {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith('/internal-odst-gate') ||
    location.pathname.startsWith('/admin');

  // Check if initial session splash already happened
  const [visible, setVisible] = useState(() => {
    if (isAdminRoute) return false;
    // If user already visited in this session, skip to keep navigation instant
    const hasVisited = sessionStorage.getItem('odst_splash_seen');
    return !hasVisited;
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (isAdminRoute) {
      setVisible(false);
      return;
    }

    if (typeof isLoading === 'boolean') {
      if (isLoading) {
        setVisible(true);
        setFading(false);
      } else {
        setFading(true);
        const timer = setTimeout(() => setVisible(false), 300);
        return () => clearTimeout(timer);
      }
      return;
    }

    // If first load
    sessionStorage.setItem('odst_splash_seen', 'true');

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDuration);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, minDuration + 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isAdminRoute, isLoading, minDuration]);

  if (!visible || isAdminRoute) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-out select-none will-change-opacity ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden={fading}
    >
      <div className="flex flex-col items-center justify-center px-6">
        {/* ODST Logo */}
        <div className="mb-3.5 flex items-center justify-center">
          <img
            src={logo}
            alt="ODST"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </div>

        {/* Hardware-Accelerated CSS Progress Line */}
        <div className="w-20 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#242E69] to-[#E06227] rounded-full animate-[progressLine_0.8s_ease-out_forwards]"
          />
        </div>
      </div>
    </div>
  );
}
