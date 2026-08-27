import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import apiService from '../../services/api';

interface ConnectionInfo {
  id: string;
  badge: string;
  title: string;
  phone: string;
  email: string;
  address: string;
}

export default function ContactConnections() {
  const { t } = useTranslation();

  const defaultConnections: ConnectionInfo[] = [
    {
      id: 'hotels',
      badge: 'Premium Hospitality',
      title: 'ODST Hotels',
      phone: '+62 811 1202 225',
      email: 'info@odst.id',
      address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125',
    },
    {
      id: 'airlines',
      badge: 'Aviation & Charter',
      title: 'ODST Airlines',
      phone: '+62 811 1202 230',
      email: 'info@odst.id',
      address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125',
    },
    {
      id: 'travel',
      badge: 'Bespoke Journeys',
      title: 'ODST Tour & Travel',
      phone: '+62 811 1203 332',
      email: 'info@odst.id',
      address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125',
    },
  ];

  const [connections, setConnections] = useState<ConnectionInfo[]>(defaultConnections);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await apiService.getServices();
        if (data && data.length > 0) {
          const mapped = data.map((s: any) => {
            const defaults = defaultConnections.find((dc) => dc.id === s.id) || {
              badge: '',
              title: '',
              phone: '',
              email: '',
              address: '',
            };
            return {
              id: s.id,
              badge: s.badge || defaults.badge,
              title: s.title || defaults.title,
              phone: s.phone || defaults.phone || '',
              email: s.email || defaults.email || '',
              address: s.address || defaults.address || '',
            };
          });
          setConnections(mapped);
        }
      } catch (err) {
        console.error('Failed to load connections from database, using fallback:', err);
      }
    };
    fetchConnections();
  }, []);

  return (
    <div className="space-y-6 text-start">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
          {t('contactConnections.title')}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
          {t('contactConnections.subtitle')}
        </p>
      </div>

      {/* Connection Cards Stack */}
      <div className="space-y-4">
        {connections.map((conn) => {
          // Translate dynamic fields or use fallback values
          const badge = t(`services.${conn.id}.badge`, conn.badge);
          const address = t(`contactConnections.address`, conn.address);

          return (
            <div
              key={conn.id}
              className="bg-white rounded-xl border border-slate-100 shadow-lg p-5 md:p-6 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Badge Tag */}
              <div className="mb-3">
                <Badge>{badge}</Badge>
              </div>

              {/* Division Title */}
              <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-orange transition-colors">
                {conn.title}
              </h3>

              {/* Details Wrapper */}
              <div className="space-y-3 text-xs md:text-sm text-slate-500 font-sans">
                {/* Phone Line */}
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <Phone size={15} className="text-black shrink-0" />
                  <a
                    href={`tel:${conn.phone.replace(/\s+/g, '')}`}
                    className="hover:text-brand-orange font-medium transition-colors"
                  >
                    {conn.phone}
                  </a>
                </div>

                {/* Email Line */}
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <Mail size={15} className="text-black shrink-0" />
                  <a
                    href={`mailto:${conn.email}`}
                    className="hover:text-brand-orange font-medium transition-colors"
                  >
                    {conn.email}
                  </a>
                </div>

                {/* Address Line */}
                <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                  <MapPin size={15} className="text-black shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
