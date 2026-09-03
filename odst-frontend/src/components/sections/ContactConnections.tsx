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
      phone: '+62 81111 202225',
      email: 'info@odst.id',
      address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740',
    },
    {
      id: 'airlines',
      badge: 'Aviation & Charter',
      title: 'ODST Airlines',
      phone: '+62 81111 202220',
      email: 'info@odst.id',
      address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740',
    },
    {
      id: 'travel',
      badge: 'Bespoke Journeys',
      title: 'ODST Tour & Travel',
      phone: '+62 81111 203330',
      email: 'info@odst.id',
      address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740',
    },
  ];

  const [connections, setConnections] = useState<ConnectionInfo[]>(defaultConnections);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await apiService.getServices();
        if (data && data.length > 0) {
          const orderMap: Record<string, number> = { hotels: 0, airlines: 1, travel: 2 };
          const sorted = [...data].sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
          const mapped = sorted.map((s: any) => {
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
              phone: s.phone || defaults.phone,
              email: s.email || defaults.email,
              address: s.address || defaults.address,
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
          // Translate dynamic badge if default, or use custom DB badge
          const isStandardBadge = ['Premium Hospitality', 'Aviation & Charter', 'Bespoke Journeys', 'ODST Hotels', 'ODST Airlines', 'ODST Tour & Travel'].includes(conn.badge);
          const badge = isStandardBadge ? t(`services.${conn.id}.badge`, conn.badge) : conn.badge;
          
          // Address directly from database
          const address = conn.address || t('contactConnections.address', '');

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
                  <Phone size={15} className="text-brand-gold shrink-0" />
                  <a
                    href={`tel:${conn.phone.replace(/\s+/g, '')}`}
                    className="hover:text-brand-orange font-medium transition-colors"
                  >
                    {conn.phone}
                  </a>
                </div>

                {/* Email Line */}
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <Mail size={15} className="text-brand-gold shrink-0" />
                  <a
                    href={`mailto:${conn.email}`}
                    className="hover:text-brand-orange font-medium transition-colors"
                  >
                    {conn.email}
                  </a>
                </div>

                {/* Address Line */}
                <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                  <MapPin size={15} className="text-brand-gold shrink-0 mt-0.5" />
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

