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

  // Handle dynamic translation with fallbacks for dynamic services from API
  const badge = t(`services.${service.id}.badge`, service.badge);
  const description = t(`services.${service.id}.description`, service.description);

  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
        service.imageLeft ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Text Column */}
      <div className="w-full lg:w-1/2 space-y-6 animate-fadeIn">
        {/* Badge Label */}
        <Badge>{badge}</Badge>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight">
          {service.title}
        </h2>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-spectral font-normal">
          {description}
        </p>

        {/* Learn More Button */}
        <div>
          <Link to="/coming-soon">
            <Button>
              {t('services.learnMore')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Column with Auto-Rotating Carousel (3s interval) */}
      <div className="w-full lg:w-1/2">
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

