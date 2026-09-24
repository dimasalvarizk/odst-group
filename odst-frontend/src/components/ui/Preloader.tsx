import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo-group.png';

interface PreloaderProps {
  /** If provided, manually controls visibility */
  isLoading?: boolean;
  /** Display duration in ms for route transitions (default 380ms) */
  transitionDuration?: number;
}

export default function Preloader({
  isLoading,
  transitionDuration = 380,
}: PreloaderProps) {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);

  const isAdminRoute =
    location.pathname.startsWith('/internal-odst-gate') ||
    location.pathname.startsWith('/admin');

  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // Trigger loading animation on every page navigation and initial load
  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.remove('page-loading');
      setVisible(false);
      return;
    }

    // If manual control is passed
    if (typeof isLoading === 'boolean') {
      if (isLoading) {
        document.body.classList.add('page-loading');
        setVisible(true);
        setFading(false);
      } else {
        document.body.classList.remove('page-loading');
        setFading(true);
        const timer = setTimeout(() => setVisible(false), 300);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Scroll to top immediately on route change
    window.scrollTo(0, 0);

    // Show preloader animation and hold page entrance animations
    document.body.classList.add('page-loading');
    setVisible(true);
    setFading(false);

    // Fade out after transitionDuration and release page animations simultaneously
    const fadeTimer = setTimeout(() => {
      document.body.classList.remove('page-loading');
      setFading(true);
    }, transitionDuration);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, transitionDuration + 300);

    prevPathRef.current = location.pathname;

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.classList.remove('page-loading');
    };
  }, [location.pathname, isAdminRoute, isLoading, transitionDuration]);

  if (!visible || isAdminRoute) return null;

  return (
    <div
      id="site-preloader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-out select-none will-change-opacity ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden={fading}
    >
      <div className="flex flex-col items-center justify-center px-6">
        {/* ODST Logo */}
        <div className="mb-4 flex items-center justify-center preloader-anim">
          <img
            src={logo}
            alt="ODST"
            className="h-9 sm:h-10 w-auto object-contain animate-[fadeInUp_0.4s_ease-out_both]"
          />
        </div>

        {/* Hardware-Accelerated Progress Line */}
        <div className="w-24 h-[2.5px] bg-slate-100 rounded-full overflow-hidden">
          <div
            key={location.pathname}
            className="h-full bg-gradient-to-r from-[#242E69] via-[#e27435] to-[#c5a880] rounded-full animate-[progressLine_0.45s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          />
        </div>
      </div>
    </div>
  );
}

