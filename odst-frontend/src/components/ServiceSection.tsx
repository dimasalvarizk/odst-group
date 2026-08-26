import { images } from '../utils/images';

interface Service {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  imageLeft: boolean;
  link: string;
}

export default function ServiceSection() {
  const services: Service[] = [
    {
      id: 'hotels',
      badge: 'Premium Hospitality',
      title: 'ODST Hotels',
      description: 'Provides hospitality services close to the Holy sites. Our hotels offer comfort, convenience, and spiritual tranquility for many pilgrims. Experience refined stays with panoramic views of the Holy Mosque.',
      imageUrl: images.hotelLobby,
      imageLeft: false,
      link: '#hotels',
    },
    {
      id: 'airlines',
      badge: 'Aviation Charters',
      title: 'ODST Airlines',
      description: 'Seamless journeys to the Holy Land. Dedicated charters and flight solutions with exceptional comfort, premium catering, and a deeply attentive service tailored for your spiritual journey.',
      imageUrl: images.airplaneSalute,
      imageLeft: true,
      link: '#airlines',
    },
    {
      id: 'travel',
      badge: 'Pilgrim Services',
      title: 'ODST Tour & Travel',
      description: 'Complete pilgrim and package travel solutions for your needs. From guide grouping to highly personalized guided tours and excellent ground transportation, we handle every detail so you can focus on your spiritual fulfillment.',
      imageUrl: images.travelLuggage,
      imageLeft: false,
      link: '#travel',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-36">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
              service.imageLeft ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Text Column */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Badge Label */}
              <div className="inline-block">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-orange border border-brand-orange/30 px-3 py-1 rounded bg-brand-orange/5">
                  {service.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight">
                {service.title}
              </h2>

              {/* Thin Decorative Line */}
              <div className="w-12 h-1 bg-brand-orange rounded" />

              {/* Description */}
              <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                {service.description}
              </p>

              {/* Learn More Button */}
              <div>
                <a
                  href={service.link}
                  className="inline-block bg-brand-orange hover:bg-brand-orange/95 text-white font-semibold text-xs md:text-sm tracking-wider uppercase px-6 py-3 rounded-md shadow-md hover:shadow-brand-orange/15 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Image Column */}
            <div className="w-full lg:w-1/2">
              <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-slate-100">
                {/* Background decorative glow on hover */}
                <div className="absolute inset-0 bg-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                {/* Image */}
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-[300px] md:h-[400px] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
