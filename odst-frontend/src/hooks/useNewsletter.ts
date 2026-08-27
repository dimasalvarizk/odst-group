import React, { useState } from 'react';
import apiService from '../services/api';

export interface NewsletterForm {
  fullName: string;
  phone: string;
  email: string;
}

export function useNewsletter() {
  const [formData, setFormData] = useState<NewsletterForm>({
    fullName: '',
    phone: '',
    email: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorType, setErrorType] = useState<'validation' | 'already_subscribed' | 'generic' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorType(null);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', phone: '', email: '' });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      setErrorType('validation');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorType(null);
    
    try {
      await apiService.subscribeNewsletter(formData);
      setStatus('success');
      resetForm();
    } catch (error: any) {
      console.error('Subscription failed:', error);
      if (error.message && error.message.toLowerCase().includes('already subscribed')) {
        setErrorType('already_subscribed');
      } else {
        setErrorType('generic');
      }
      setStatus('error');
    }
  };

  return {
    formData,
    status,
    errorType,
    handleInputChange,
    submitForm,
    setStatus,
  };
}
export default useNewsletter;
