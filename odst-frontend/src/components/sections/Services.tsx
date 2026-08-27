import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { services as staticServices } from '../../utils/servicesData';
import type { Service } from '../../utils/servicesData';
import ServiceCard from './ServiceCard';
import apiService from '../../services/api';
import logo from '../../assets/odstlogo.png';

export default function Services() {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

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
            <ServiceCard 
              service={service} 
              onLearnMoreClick={() => setActiveModalService(service)}
            />
          </div>
        </section>
      ))}

      {/* Coming Soon Modal Overlay */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="bg-[#050c1e] text-white w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col">
            
            {/* Background glowing circle decorator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
              <img src={logo} alt="ODST Logo" className="h-8 w-auto" />
              <button
                onClick={() => setActiveModalService(null)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 backdrop-blur rounded-full text-brand-gold text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <Clock size={12} className="text-brand-orange" />
                <span>{activeModalService.badge} Coming Soon</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {activeModalService.title} Portal
                </h3>
                <p className="text-xs md:text-sm text-slate-300 font-light font-spectral leading-relaxed max-w-md">
                  We are currently finalizing the digital gateway for our premium <span className="font-semibold text-white">{activeModalService.title}</span> services. Our customized portals for flights, premium accommodations, and bespoke guides will be live shortly.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-brand-orange/20 hover:-translate-y-0.5 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="relative z-10 w-full text-center py-4.5 border-t border-white/5 bg-black/20 text-[9px] text-slate-550 uppercase tracking-widest">
              © 2026 ODST Group. All rights reserved.
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
