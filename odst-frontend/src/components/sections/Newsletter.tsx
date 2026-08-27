import { useTranslation } from 'react-i18next';
import { useNewsletter } from '../../hooks/useNewsletter';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function Newsletter() {
  const { t } = useTranslation();
  const { formData, status, handleInputChange, submitForm } = useNewsletter();

  return (
    <section id="newsletter" className="py-20 bg-[#fafbfd] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <Badge className="mb-4">{t('newsletter.badge')}</Badge>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 animate-fadeIn">
          {t('newsletter.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-500 max-w-none mb-10 text-sm md:text-base font-spectral font-normal animate-fadeIn">
          {t('newsletter.description')}
        </p>

        {/* Subscription Form */}
        <form onSubmit={submitForm} className="max-w-2xl mx-auto space-y-4">
          {/* Row 1: First Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="fullName"
              placeholder={t('newsletter.fullName')}
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
            <Input
              type="tel"
              name="phone"
              placeholder={t('newsletter.phone')}
              value={formData.phone}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>

          {/* Row 2: Email & Subscribe Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              name="email"
              placeholder={t('newsletter.email')}
              value={formData.email}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto font-semibold py-3"
            >
              {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.subscribe')}
            </Button>
          </div>

          {/* Feedback Messages */}
          {status === 'success' && (
            <div className="text-emerald-600 text-sm font-medium mt-3 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-lg animate-fadeIn text-start rtl:text-end">
              {t('newsletter.success')}
            </div>
          )}
          {status === 'error' && (
            <div className="text-rose-600 text-sm font-medium mt-3 bg-rose-50 border border-rose-100 py-2.5 px-4 rounded-lg animate-fadeIn text-start rtl:text-end">
              {t('newsletter.error')}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
