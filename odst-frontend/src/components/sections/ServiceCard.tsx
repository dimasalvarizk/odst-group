import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import type { Service } from '../../utils/servicesData';
import ImageCarousel from '../ui/ImageCarousel';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle dynamic translation with fallbacks for dynamic services from API
  const badge = t(`services.${service.id}.badge`, service.badge);
  const description = t(`services.${service.id}.description`, service.description);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
        service.imageLeft ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Text Column with Cascading Staggered Animation */}
      <div className="w-full lg:w-1/2 space-y-6">
        {/* Badge Label */}
        <div
          className={`transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
          style={{ transitionDelay: '50ms' }}
        >
          <Badge>{badge}</Badge>
        </div>

        {/* Title */}
        <h2
          className={`text-3xl md:text-4xl font-bold text-brand-navy leading-tight tracking-tight transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          {service.title}
        </h2>

        {/* Description */}
        <p
          className={`text-slate-600 leading-relaxed text-base md:text-lg font-spectral font-normal transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '250ms' }}
        >
          {description}
        </p>

        {/* Learn More Button */}
        <div
          className={`pt-2 transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '350ms' }}
        >
          <Link
            to="/coming-soon"
            aria-label={`${t('services.learnMore')} - ${service.title}`}
          >
            <Button>
              {t('services.learnMore')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Column with Directional Slide & Auto-Rotating Carousel */}
      <div
        className={`w-full lg:w-1/2 transform transition-all duration-850 ease-out ${
          isVisible
            ? 'opacity-100 translate-x-0'
            : service.imageLeft
            ? 'opacity-0 -translate-x-10 rtl:translate-x-10'
            : 'opacity-0 translate-x-10 rtl:-translate-x-10'
        }`}
        style={{
          transitionDelay: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <ImageCarousel
          imagesList={service.images}
          fallbackUrl={service.imageUrl}
          serviceId={service.id}
          title={service.title}
          interval={3000}
        />
      </div>
    </div>
  );
}

