import { services } from '../../utils/servicesData';
import ServiceCard from './ServiceCard';

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-36">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
