import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { images } from '../../utils/images';

interface ImageCarouselProps {
  imagesList?: string[];
  fallbackUrl?: string;
  serviceId?: string;
  title: string;
  interval?: number; // default 3000ms
  className?: string;
}

// Helper to resolve keyword shortcuts or fallback images
export const resolveImageSource = (img: string, serviceId?: string): string => {
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http') || img.startsWith('/') || img.startsWith('blob:')) {
    return img;
  }
  if (img === 'hotels' || serviceId === 'hotels') return images.hotelLobby;
  if (img === 'airlines' || serviceId === 'airlines') return images.airplaneSalute;
  if (img === 'travel' || serviceId === 'travel') return images.travelLuggage;
  return img;
};

export default function ImageCarousel({
  imagesList,
  fallbackUrl,
  serviceId,
  title,
  interval = 3000,
  className = '',
}: ImageCarouselProps) {
  // Determine normalized slides array
  const slides = (imagesList && imagesList.length > 0 ? imagesList : (fallbackUrl ? [fallbackUrl] : []))
    .map((img) => resolveImageSource(img, serviceId))
    .filter(Boolean);

  // If no slides at all, fallback to service default
  const activeSlides = slides.length > 0 ? slides : [resolveImageSource(serviceId || '', serviceId)];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Advance to next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  // Go to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // 3-second auto-rotation effect, paused when user hovers or if only 1 slide
  useEffect(() => {
    if (activeSlides.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [activeSlides.length, isHovered, interval, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      nextSlide();
    } else if (diffX < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} image showcase`}
      className={`relative group overflow-hidden rounded-2xl shadow-xl border border-slate-100/80 bg-slate-900 select-none service-card-glow ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {`Slide ${currentSlide + 1} of ${activeSlides.length}: ${title}`}
      </div>

      {/* Decorative Brand Overlay on Hover */}
      <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

      {/* Slide Images Container */}
      <div className="relative w-full h-[300px] md:h-[420px] overflow-hidden">
        {activeSlides.map((imgUrl, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={`${index}-${imgUrl.slice(0, 30)}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${title} - Photo ${index + 1}`}
                width={600}
                height={420}
                className={`w-full h-full object-cover transform transition-transform duration-3000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
              />
            </div>
          );
        })}
      </div>

      {/* Subtle Navigation Chevrons (Shown on hover if > 1 slide) */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 focus:opacity-100 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 focus:opacity-100 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Navigation Indicators (Dots) */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 rtl:space-x-reverse bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className="group focus:outline-none p-0.5"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={currentSlide === idx ? 'true' : 'false'}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-6 bg-brand-orange shadow-sm'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
