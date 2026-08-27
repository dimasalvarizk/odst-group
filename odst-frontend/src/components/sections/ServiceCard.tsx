import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import type { Service } from '../../utils/servicesData';
import { images } from '../../utils/images';

interface ServiceCardProps {
  service: Service;
}

const resolveImageUrl = (imageUrl: string, id: string) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  if (imageUrl === 'hotels' || id === 'hotels') return images.hotelLobby;
  if (imageUrl === 'airlines' || id === 'airlines') return images.airplaneSalute;
  if (imageUrl === 'travel' || id === 'travel') return images.travelLuggage;
  return imageUrl;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
        service.imageLeft ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Text Column */}
      <div className="w-full lg:w-1/2 space-y-6 animate-fadeIn">
        {/* Badge Label */}
        <Badge>{service.badge}</Badge>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight">
          {service.title}
        </h2>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-spectral font-normal">
          {service.description}
        </p>

        {/* Learn More Button */}
        <div>
          <Link to="/coming-soon">
            <Button>
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Column */}
      <div className="w-full lg:w-1/2">
        <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-slate-100">
          {/* Background decorative glow on hover */}
          <div className="absolute inset-0 bg-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          {/* Image */}
          <img
            src={resolveImageUrl(service.imageUrl, service.id)}
            alt={service.title}
            className="w-full h-[300px] md:h-[400px] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
