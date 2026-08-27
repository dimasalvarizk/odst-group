import { useState, useEffect } from 'react';
import { services as staticServices } from '../../utils/servicesData';
import type { Service } from '../../utils/servicesData';
import ServiceCard from './ServiceCard';
import apiService from '../../services/api';

export default function Services() {
  const [services, setServices] = useState<Service[]>(staticServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        if (data && data.length > 0) {
          const orderMap: Record<string, number> = { hotels: 0, airlines: 1, travel: 2 };
          const sorted = [...data].sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
          setServices(sorted);
        }
      } catch (err) {
        console.error('Failed to load services from API, using fallback data:', err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div id="services">
      {services.map((service) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 md:py-28 ${
            service.id === 'airlines' ? 'bg-[#fafbfd] border-y border-slate-100' : 'bg-white'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <ServiceCard service={service} />
          </div>
        </section>
      ))}
    </div>
  );
}
