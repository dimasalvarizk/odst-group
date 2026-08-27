import React, { useState } from 'react';
import apiService from '../services/api';

export interface ContactForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  message: string;
}

export function useContact() {
  const [formData, setFormData] = useState<ContactForm>({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      message: '',
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.department ||
      !formData.message
    ) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      await apiService.submitContact(formData);
      setStatus('success');
      resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
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
export default useContact;
