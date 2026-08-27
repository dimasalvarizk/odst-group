import { useTranslation } from 'react-i18next';
import { useContact } from '../../hooks/useContact';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function ContactForm() {
  const { t } = useTranslation();
  const { formData, status, handleInputChange, submitForm } = useContact();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-10 space-y-6 text-start">
      {/* Header Info */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
          {t('contactForm.title')}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {t('contactForm.subtitle')}
        </p>
      </div>

      {/* Form Grid */}
      <form onSubmit={submitForm} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5 text-start">
            <label htmlFor="fullName" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('contactForm.labels.fullName')}
            </label>
            <Input
              type="text"
              name="fullName"
              placeholder={t('contactForm.placeholders.fullName')}
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5 text-start">
            <label htmlFor="email" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('contactForm.labels.email')}
            </label>
            <Input
              type="email"
              name="email"
              placeholder={t('contactForm.placeholders.email')}
              value={formData.email}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div className="space-y-1.5 text-start">
            <label htmlFor="phone" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('contactForm.labels.phone')}
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder={t('contactForm.placeholders.phone')}
              value={formData.phone}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>

          {/* Department Dropdown */}
          <div className="space-y-1.5 text-start">
            <label htmlFor="department" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('contactForm.labels.department')}
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed appearance-none cursor-pointer text-left"
              dir="auto"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.2em',
                paddingRight: '2.5rem',
                paddingLeft: '1rem',
              }}
            >
              <option value="" disabled hidden>{t('contactForm.placeholders.department')}</option>
              <option value="Hotels">{t('contactForm.options.hotels')}</option>
              <option value="Airlines">{t('contactForm.options.airlines')}</option>
              <option value="Travel">{t('contactForm.options.travel')}</option>
            </select>
          </div>
        </div>

        {/* Message Textarea */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="message" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('contactForm.labels.message')}
          </label>
          <textarea
            id="message"
            name="message"
            placeholder={t('contactForm.placeholders.message')}
            value={formData.message}
            onChange={handleInputChange}
            disabled={status === 'loading'}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed resize-none text-left"
            dir="auto"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-6 pt-3 border-t border-slate-100 rtl:space-x-reverse">
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-brand-orange text-white hover:bg-brand-orange/95 font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-brand-orange/20 transition-all duration-300 rounded-lg shrink-0"
          >
            {status === 'loading' ? t('contactForm.submitting') : t('contactForm.submit')}
          </Button>
          
          <span className="text-xs text-slate-400 leading-relaxed text-start">
            {t('contactForm.disclaimer')}
          </span>
        </div>

        {/* Success / Error Messages */}
        {status === 'success' && (
          <div className="text-emerald-600 text-sm font-medium mt-3 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-lg animate-fadeIn text-start">
            {t('contactForm.success')}
          </div>
        )}
        {status === 'error' && (
          <div className="text-rose-600 text-sm font-medium mt-3 bg-rose-50 border border-rose-100 py-2.5 px-4 rounded-lg animate-fadeIn text-start">
            {t('contactForm.error')}
          </div>
        )}
      </form>
    </div>
  );
}
