import { useContact } from '../../hooks/useContact';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function ContactForm() {
  const { formData, status, handleInputChange, submitForm } = useContact();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-10 space-y-6">
      {/* Header Info */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
          Send a Message
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Fill out the form below and our regional representative will contact you within 24 hours.
        </p>
      </div>

      {/* Form Grid */}
      <form onSubmit={submitForm} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Name
            </label>
            <Input
              type="text"
              name="fullName"
              placeholder="e.g. Abdullah Rahman"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="e.g. abdullah@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="e.g. +966 50 000 0000"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
            />
          </div>

          {/* Department Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="department" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.2em'
              }}
            >
              <option value="" disabled hidden>Select ODST Service Division</option>
              <option value="Hotels">ODST Hotels (Hospitality)</option>
              <option value="Airlines">ODST Airlines (Aviation)</option>
              <option value="Travel">ODST Tour & Travel (Pilgrim Services)</option>
            </select>
          </div>
        </div>

        {/* Message Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Describe your requirements or questions in detail..."
            value={formData.message}
            onChange={handleInputChange}
            disabled={status === 'loading'}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-6 pt-3 border-t border-slate-100">
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-brand-orange text-white hover:bg-brand-orange/95 font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-brand-orange/20 transition-all duration-300 rounded-lg shrink-0"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
          
          <span className="text-xs text-slate-400 leading-relaxed text-left">
            Your data is securely processed in accordance with our privacy policy.
          </span>
        </div>

        {/* Success / Error Messages */}
        {status === 'success' && (
          <div className="text-emerald-600 text-sm font-medium mt-3 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-lg animate-fadeIn">
            ✓ Your inquiry has been submitted successfully. A representative will contact you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="text-rose-600 text-sm font-medium mt-3 bg-rose-50 border border-rose-100 py-2.5 px-4 rounded-lg animate-fadeIn">
            ⚠ Submission failed. Please fill out all fields.
          </div>
        )}
      </form>
    </div>
  );
}
