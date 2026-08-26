import React, { useState } from 'react';

export interface NewsletterForm {
  firstName: string;
  phone: string;
  email: string;
}

export function useNewsletter() {
  const [formData, setFormData] = useState<NewsletterForm>({
    firstName: '',
    phone: '',
    email: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  const resetForm = () => {
    setFormData({ firstName: '', phone: '', email: '' });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.email) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      resetForm();
    } catch {
      setStatus('error');
    }
  };

  return {
    formData,
    status,
    handleInputChange,
    submitForm,
    setStatus,
  };
}
export default useNewsletter;
