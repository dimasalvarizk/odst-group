let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (rawBaseUrl && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  if (rawBaseUrl.endsWith('/')) {
    rawBaseUrl = rawBaseUrl.slice(0, -1);
  }
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const API_BASE_URL = rawBaseUrl;


// Generic fetch handler
async function handleRequest(url: string, options: RequestInit = {}) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const token = localStorage.getItem('adminToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.headers) {
    const inputHeaders = new Headers(options.headers);
    inputHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const apiService = {
  // Auth API
  async login(emailOrUsername: string, password: string) {
    return handleRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailOrUsername, password }),
    });
  },

  async getProfile() {
    return handleRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Contacts API
  async getContacts() {
    return handleRequest('/contacts', {
      method: 'GET',
    });
  },

  async submitContact(contactData: any) {
    return handleRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  async updateContactStatus(id: string, status: 'unread' | 'read' | 'replied') {
    return handleRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteContact(id: string) {
    return handleRequest(`/contacts/${id}`, {
      method: 'DELETE',
    });
  },

  // Newsletter API
  async getNewsletterSubscribers() {
    return handleRequest('/newsletters', {
      method: 'GET',
    });
  },

  async subscribeNewsletter(subscriberData: any) {
    return handleRequest('/newsletters', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  },

  async deleteNewsletterSubscriber(id: string) {
    return handleRequest(`/newsletters/${id}`, {
      method: 'DELETE',
    });
  },

  // Services API
  async getServices() {
    return handleRequest('/services', {
      method: 'GET',
    });
  },

  async updateService(id: string, serviceData: any) {
    return handleRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  async createService(serviceData: any) {
    return handleRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  async deleteService(id: string) {
    return handleRequest(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiService;
