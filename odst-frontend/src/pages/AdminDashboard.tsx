import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';
import { compressImageFile } from '../utils/imageCompressor';
import { resolveImageSource } from '../components/ui/ImageCarousel';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

interface Subscriber {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  imageLeft: boolean;
  link: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'contacts' | 'subscribers' | 'services' | 'connections'>('contacts');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ServiceItem | null>(null);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Edit Service Form States
  const [editBadge, setEditBadge] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [compressingImages, setCompressingImages] = useState(false);
  const [editImageLeft, setEditImageLeft] = useState(false);
  const [editLink, setEditLink] = useState('');
  const [updatingService, setUpdatingService] = useState(false);

  // Edit Connection Form States
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Toast notification
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'contacts') {
        const data = await apiService.getContacts();
        setContacts(data);
      } else if (activeTab === 'subscribers') {
        const data = await apiService.getNewsletterSubscribers();
        setSubscribers(data);
      } else {
        const data = await apiService.getServices();
        const orderMap: Record<string, number> = { hotels: 0, airlines: 1, travel: 2 };
        const sorted = [...data].sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
        setServices(sorted);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data from the server. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/internal-odst-gate');
  };

  // Contacts Actions
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      const updated = await apiService.updateContactStatus(id, newStatus);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }
      showToast(`Inquiry marked as ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteContact = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: t('admin.confirmTitle', 'Confirm Deletion'),
      message: t('admin.deleteInquiryConfirm', 'Are you sure you want to delete this customer inquiry? This action cannot be undone.'),
      confirmText: t('admin.confirmDelete', 'Yes, Delete'),
      cancelText: t('admin.cancel', 'Cancel'),
      onConfirm: async () => {
        try {
          await apiService.deleteContact(id);
          setContacts((prev) => prev.filter((c) => c.id !== id));
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
          }
          showToast('Inquiry deleted', 'info');
        } catch (err: any) {
          showToast(err.message || 'Failed to delete inquiry', 'error');
        } finally {
          setConfirmModal(null);
        }
      },
    });
  };

  // Newsletter Actions
  const handleDeleteSubscriber = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: t('admin.confirmTitle', 'Confirm Deletion'),
      message: t('admin.deleteSubscriberConfirm', 'Are you sure you want to remove this subscriber from the newsletter audience?'),
      confirmText: t('admin.confirmDelete', 'Yes, Delete'),
      cancelText: t('admin.cancel', 'Cancel'),
      onConfirm: async () => {
        try {
          await apiService.deleteNewsletterSubscriber(id);
          setSubscribers((prev) => prev.filter((s) => s.id !== id));
          showToast('Subscriber removed from list', 'info');
        } catch (err: any) {
          showToast(err.message || 'Failed to delete subscriber', 'error');
        } finally {
          setConfirmModal(null);
        }
      },
    });
  };

  // Service Edit Actions
  const handleEditServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setEditBadge(service.badge || '');
    setEditTitle(service.title || '');
    setEditDescription(service.description || '');
    setEditImages(
      Array.isArray(service.images) && service.images.length > 0 
        ? service.images 
        : (service.imageUrl ? [service.imageUrl] : [])
    );
    setNewImageUrlInput('');
    setEditImageLeft(service.imageLeft || false);
    setEditLink(service.link || '');
  };

  const handleUpdateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setUpdatingService(true);
    try {
      const updated = await apiService.updateService(selectedService.id, {
        badge: editBadge,
        title: editTitle,
        description: editDescription,
        images: editImages,
        imageUrl: editImages.length > 0 ? editImages[0] : '',
        imageLeft: editImageLeft,
        link: editLink,
      });
      setServices((prev) => prev.map((s) => (s.id === selectedService.id ? updated : s)));
      setSelectedService(null);
      showToast('Service updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update service', 'error');
    } finally {
      setUpdatingService(false);
    }
  };

  const handleMultiImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setCompressingImages(true);
    try {
      const newImagesList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          showToast(`File "${file.name}" exceeds 15MB limit.`, 'error');
          continue;
        }
        const compressedBase64 = await compressImageFile(file, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.82,
        });
        newImagesList.push(compressedBase64);
      }

      if (newImagesList.length > 0) {
        setEditImages((prev) => [...prev, ...newImagesList]);
        showToast(`Added ${newImagesList.length} image(s) to slideshow`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to process images', 'error');
    } finally {
      setCompressingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newImageUrlInput.trim();
    if (!trimmed) return;
    setEditImages((prev) => [...prev, trimmed]);
    setNewImageUrlInput('');
    showToast('Image URL added to slideshow', 'success');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    showToast('Image removed from slideshow', 'info');
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editImages.length) return;
    setEditImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  // Direct Connections Actions
  const handleEditConnectionClick = (service: ServiceItem) => {
    setSelectedConnection(service);
    setEditBadge(service.badge || '');
    setEditTitle(service.title || '');
    setEditPhone(service.phone || '');
    setEditEmail(service.email || '');
    setEditAddress(service.address || '');
  };

  const handleUpdateConnectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConnection) return;
    setUpdatingService(true);
    try {
      const updated = await apiService.updateService(selectedConnection.id, {
        badge: editBadge,
        title: editTitle,
        phone: editPhone,
        email: editEmail,
        address: editAddress,
      });
      setServices((prev) => prev.map((s) => (s.id === selectedConnection.id ? updated : s)));
      setSelectedConnection(null);
      showToast('Direct Connection updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update connection', 'error');
    } finally {
      setUpdatingService(false);
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when tab, search, or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  // Filter Services
  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  // Filter Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch = 
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  // Paginated Contacts
  const totalContactPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  // Filter Subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
    );
  }, [subscribers, searchQuery]);

  // Paginated Subscribers
  const totalSubscriberPages = Math.max(1, Math.ceil(filteredSubscribers.length / pageSize));
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscribers.slice(start, start + pageSize);
  }, [filteredSubscribers, currentPage, pageSize]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return contacts.filter((c) => c.status === 'unread').length;
  }, [contacts]);

  const getStatusBadge = (status: 'unread' | 'read' | 'replied') => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {t('admin.unread', 'Unread')}
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t('admin.read', 'Read')}
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t('admin.replied', 'Replied')}
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      
      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Responsive Left Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-[#0c1427] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        
        {/* Top Branding Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
            <Link to="/" aria-label="ODST Group - Home" className="flex items-center gap-2.5">
              <img src={logo} alt="ODST Group Logo" width={110} height={28} className="h-7 w-auto object-contain" decoding="async" />
              <span className="text-white font-semibold text-sm tracking-tight">Admin Console</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>

          {/* Clean Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            <span className="block px-3 pt-3 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t('admin.management', 'Manajemen')}
            </span>

            {/* Contacts / Inquiries Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); setStatusFilter('all'); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{t('admin.nav.inquiries', 'Customer Inquiries')}</span>
              <span className={`text-xs ${unreadCount > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400 font-mono'}`}>
                {contacts.length}
              </span>
            </button>

            {/* Newsletter Subscribers Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                activeTab === 'subscribers'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{t('admin.nav.subscribers', 'Newsletter Subscribers')}</span>
              <span className="text-xs text-slate-400 font-mono">
                {subscribers.length}
              </span>
            </button>

            {/* Landing Services Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('services'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                activeTab === 'services'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{t('admin.nav.services', 'Landing Services')}</span>
              <span className="text-xs text-slate-400 font-mono">
                {services.length || 3}
              </span>
            </button>

            {/* Direct Contact Directory Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('connections'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                activeTab === 'connections'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{t('admin.nav.connections', 'Direct Contact Directory')}</span>
              <span className="text-xs text-slate-400 font-mono">
                {services.length || 3}
              </span>
            </button>

            {/* Language Selector */}
            <div className="pt-4 mt-3 border-t border-slate-800/70 space-y-2">
              <span className="block px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('admin.languageLabel', 'Bahasa')}
              </span>
              <div className="flex gap-1.5 px-2">
                {[
                  { code: 'id', label: 'Indo' },
                  { code: 'en', label: 'English' },
                  { code: 'ar', label: 'العربية' },
                ].map((lang) => {
                  const isActive = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* External Link */}
            <div className="pt-3 mt-2 border-t border-slate-800/70 space-y-1">
              <span className="block px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('admin.external', 'Eksternal')}
              </span>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/30 flex items-center justify-between transition-colors"
              >
                <span>{t('admin.liveWebsite', 'Lihat Website')}</span>
                <span className="text-xs text-slate-400">↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <div className="text-xs font-semibold text-white truncate leading-tight">
              {adminUser.username || 'admin'}
            </div>
            <div className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
              {adminUser.email || 'admin@odst.id'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 text-xs font-medium px-2 py-1 hover:bg-rose-500/10 rounded transition-colors shrink-0"
          >
            {t('admin.signOut', 'Keluar')}
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
              aria-label="Open navigation menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{t('admin.menu', 'Menu')}</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {activeTab === 'contacts' && t('admin.nav.inquiries', 'Customer Inquiries')}
              {activeTab === 'subscribers' && t('admin.nav.subscribers', 'Newsletter Subscribers')}
              {activeTab === 'services' && t('admin.nav.services', 'Landing Services')}
              {activeTab === 'connections' && t('admin.nav.connections', 'Direct Contact Directory')}
            </h2>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <input
              type="text"
              placeholder={t('admin.search', 'Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 w-28 sm:w-48 md:w-56 transition-all"
            />

            {activeTab === 'contacts' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="hidden sm:block px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="all">{t('admin.allStatus', 'All Status')}</option>
                <option value="unread">{t('admin.unread', 'Unread')}</option>
                <option value="read">{t('admin.read', 'Read')}</option>
                <option value="replied">{t('admin.replied', 'Replied')}</option>
              </select>
            )}

            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? '...' : t('admin.refresh', 'Refresh')}
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 flex flex-col space-y-4">
          
          {/* Toast Notification */}
          {notification && (
            <div className={`py-2.5 px-4 text-xs font-medium border rounded-lg flex justify-between items-center shadow-xs ${
              notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : notification.type === 'info'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)} className="font-bold text-slate-400 hover:text-slate-700 ml-4">✕</button>
            </div>
          )}

          {/* Main Table Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
            
            {loading && !contacts.length && !subscribers.length && !services.length ? (
              <div className="flex items-center justify-center py-24 text-slate-400 text-xs">
                Fetching records from server...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-rose-600 text-xs font-medium">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
                >
                  Retry
                </button>
              </div>
            ) : activeTab === 'contacts' ? (
              
              // INQUIRIES
              filteredContacts.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs">
                  {t('admin.noInquiries', 'No customer inquiries found.')}
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">{t('admin.sender', 'Sender')}</th>
                          <th className="py-3 px-4">{t('admin.contactDetails', 'Contact Details')}</th>
                          <th className="py-3 px-4">{t('admin.division', 'Division')}</th>
                          <th className="py-3 px-4">{t('admin.message', 'Message')}</th>
                          <th className="py-3 px-4">{t('admin.status', 'Status')}</th>
                          <th className="py-3 px-4">{t('admin.date', 'Date')}</th>
                          <th className="py-3 px-4 text-right">{t('admin.actions', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedContacts.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                              {c.fullName}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <a href={`mailto:${c.email}`} className="text-slate-800 hover:text-brand-orange hover:underline font-medium block">
                                {c.email}
                              </a>
                              <span className="text-[11px] text-slate-500 font-mono">{c.phone}</span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                                {c.department}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <p className="line-clamp-2 text-slate-600 font-light">{c.message}</p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {getStatusBadge(c.status)}
                            </td>
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                              {formatDate(c.createdAt)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedMessage(c)}
                                className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-medium rounded border border-slate-200"
                              >
                                {t('admin.view', 'View')}
                              </button>
                              {c.status === 'unread' && (
                                <button
                                  onClick={() => handleUpdateStatus(c.id, 'read')}
                                  className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-medium rounded border border-slate-200"
                                >
                                  {t('admin.read', 'Read')}
                                </button>
                              )}
                              {c.status !== 'replied' && (
                                <button
                                  onClick={() => handleUpdateStatus(c.id, 'replied')}
                                  className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 font-medium rounded border border-emerald-200"
                                >
                                  {t('admin.replied', 'Replied')}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteContact(c.id)}
                                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded border border-rose-200"
                              >
                                {t('admin.delete', 'Delete')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Inquiries Pagination Footer */}
                  {filteredContacts.length > 0 && (
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span>
                          {t('admin.showing', 'Showing')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {(currentPage - 1) * pageSize + 1}
                          </strong>{' '}
                          {t('admin.to', 'to')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {Math.min(currentPage * pageSize, filteredContacts.length)}
                          </strong>{' '}
                          {t('admin.of', 'of')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {filteredContacts.length}
                          </strong>{' '}
                          {t('admin.entries', 'entries')}
                        </span>
                        <span className="text-slate-300">|</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value={10}>10 {t('admin.perPage', 'per page')}</option>
                          <option value={25}>25 {t('admin.perPage', 'per page')}</option>
                          <option value={50}>50 {t('admin.perPage', 'per page')}</option>
                          <option value={100}>100 {t('admin.perPage', 'per page')}</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          {t('admin.prev', 'Previous')}
                        </button>

                        {Array.from({ length: Math.min(5, totalContactPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalContactPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1;
                            if (pageNum > totalContactPages) pageNum = totalContactPages - (4 - i);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-brand-orange text-white'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalContactPages, p + 1))}
                          disabled={currentPage >= totalContactPages}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          {t('admin.next', 'Next')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : activeTab === 'subscribers' ? (
              
              // SUBSCRIBERS
              filteredSubscribers.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs">
                  {t('admin.noSubscribers', 'No newsletter subscribers found.')}
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">{t('admin.subscriberName', 'Subscriber Name')}</th>
                          <th className="py-3 px-4">{t('admin.phone', 'Phone Number')}</th>
                          <th className="py-3 px-4">{t('admin.email', 'Email Address')}</th>
                          <th className="py-3 px-4">{t('admin.dateSubscribed', 'Date Subscribed')}</th>
                          <th className="py-3 px-4 text-right">{t('admin.actions', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedSubscribers.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900">{s.fullName}</td>
                            <td className="py-3 px-4 font-mono text-slate-600">{s.phone || '-'}</td>
                            <td className="py-3 px-4">
                              <a href={`mailto:${s.email}`} className="text-slate-800 hover:text-brand-orange hover:underline font-medium">
                                {s.email}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">{formatDate(s.createdAt)}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteSubscriber(s.id)}
                                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded border border-rose-200"
                              >
                                {t('admin.unsubscribe', 'Unsubscribe')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Subscribers Pagination Footer */}
                  {filteredSubscribers.length > 0 && (
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span>
                          {t('admin.showing', 'Showing')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {(currentPage - 1) * pageSize + 1}
                          </strong>{' '}
                          {t('admin.to', 'to')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {Math.min(currentPage * pageSize, filteredSubscribers.length)}
                          </strong>{' '}
                          {t('admin.of', 'of')}{' '}
                          <strong className="text-slate-900 font-semibold">
                            {filteredSubscribers.length}
                          </strong>{' '}
                          {t('admin.entries', 'entries')}
                        </span>
                        <span className="text-slate-300">|</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value={10}>10 {t('admin.perPage', 'per page')}</option>
                          <option value={25}>25 {t('admin.perPage', 'per page')}</option>
                          <option value={50}>50 {t('admin.perPage', 'per page')}</option>
                          <option value={100}>100 {t('admin.perPage', 'per page')}</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          {t('admin.prev', 'Previous')}
                        </button>

                        {Array.from({ length: Math.min(5, totalSubscriberPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalSubscriberPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1;
                            if (pageNum > totalSubscriberPages) pageNum = totalSubscriberPages - (4 - i);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-brand-orange text-white'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalSubscriberPages, p + 1))}
                          disabled={currentPage >= totalSubscriberPages}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          {t('admin.next', 'Next')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : activeTab === 'services' ? (
              
              // LANDER SERVICES
              filteredServices.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs">
                  {t('admin.noServices', 'No services configured.')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">{t('admin.division', 'Service')} / {t('admin.status', 'Badge')}</th>
                        <th className="py-3 px-4">{t('admin.slideshow', 'Slideshow (3s)')}</th>
                        <th className="py-3 px-4">{t('admin.description', 'Description')}</th>
                        <th className="py-3 px-4">{t('admin.layout', 'Layout')}</th>
                        <th className="py-3 px-4">{t('admin.actionLink', 'Action Link')}</th>
                        <th className="py-3 px-4 text-right">{t('admin.actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.map((s) => {
                        const slideCount = Array.isArray(s.images) && s.images.length > 0 ? s.images.length : (s.imageUrl ? 1 : 0);
                        const coverSrc = resolveImageSource((s.images && s.images[0]) || s.imageUrl || '', s.id);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 mb-0.5">
                                {s.badge}
                              </span>
                              <div className="font-bold text-slate-900">{s.title}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-8 rounded bg-slate-900 overflow-hidden border border-slate-200 shrink-0">
                                  <img src={coverSrc} alt={s.title} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-slate-600 font-medium">
                                  {slideCount} {slideCount === 1 ? t('admin.photo', 'photo') : t('admin.photos', 'photos')}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 max-w-sm">
                              <p className="line-clamp-2 text-slate-600 font-light">{s.description}</p>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                              {s.imageLeft ? t('admin.imageLeft', 'Image Left') : t('admin.imageRight', 'Image Right')}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                              {s.link}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleEditServiceClick(s)}
                                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium rounded text-xs shadow-sm transition-colors"
                              >
                                {t('admin.editService', 'Edit Service')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              
              // DIRECT CONNECTIONS
              filteredServices.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs">
                  {t('admin.noServices', 'No direct connections configured.')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">{t('admin.division', 'Division')} / {t('admin.status', 'Title')}</th>
                        <th className="py-3 px-4">{t('admin.phone', 'Phone Number')}</th>
                        <th className="py-3 px-4">{t('admin.email', 'Email Address')}</th>
                        <th className="py-3 px-4">{t('admin.officeAddress', 'Office Address')}</th>
                        <th className="py-3 px-4 text-right">{t('admin.actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/75 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 mb-0.5">
                              {s.badge}
                            </span>
                            <div className="font-bold text-slate-900">{s.title}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                            {s.phone || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <a href={`mailto:${s.email}`} className="text-slate-800 hover:text-brand-orange hover:underline">
                              {s.email || '-'}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 max-w-sm text-slate-600 font-light text-[11px]">
                            {s.address || '-'}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEditConnectionClick(s)}
                              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium rounded text-xs shadow-sm transition-colors"
                            >
                              {t('admin.editContact', 'Edit Contact')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

          </div>

        </main>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col border border-slate-200 max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Contact Inquiry</h3>
                <p className="text-[11px] text-slate-500">ID: {selectedMessage.id}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Sender</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedMessage.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Division</span>
                  <span className="font-semibold text-slate-800">{selectedMessage.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Email</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-slate-800 hover:underline font-medium">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Phone</span>
                  <span className="font-mono text-slate-700">{selectedMessage.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Status</span>
                  <div className="mt-0.5">{getStatusBadge(selectedMessage.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Received</span>
                  <span className="text-slate-600">{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Customer Message</span>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  disabled={selectedMessage.status === 'read'}
                  className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 disabled:opacity-40"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={selectedMessage.status === 'replied'}
                  className="px-2.5 py-1 bg-white border border-slate-300 text-emerald-700 text-xs font-medium rounded hover:bg-emerald-50 disabled:opacity-40"
                >
                  Mark Replied
                </button>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleDeleteContact(selectedMessage.id)}
                  className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-medium rounded border border-rose-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Service & Slideshow Editor Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden flex flex-col border border-slate-200 max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Service Details</h3>
                <p className="text-[11px] text-slate-500">Configuring {selectedService.title} ({selectedService.id})</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-grow text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Badge Title</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Action Link (CTA)</label>
                  <input
                    type="text"
                    required
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="imageLeft"
                    checked={editImageLeft}
                    onChange={(e) => setEditImageLeft(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  <label htmlFor="imageLeft" className="text-xs text-slate-700">
                    Display image on the left side on desktop view
                  </label>
                </div>

                {/* Slideshow Manager */}
                <div className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50/50">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800 text-xs block">Rotating Image Slideshow</span>
                      <span className="text-[11px] text-slate-500">Auto-rotates every 3 seconds on the public website.</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px] font-semibold">
                      {editImages.length} Slides
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                        Upload Files (Multi-selection)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={compressingImages}
                        onChange={handleMultiImageFileChange}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-slate-300 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                      />
                      {compressingImages && (
                        <p className="text-[10px] text-amber-600 mt-1">Compressing image files...</p>
                      )}
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                        Add Image via URL
                      </span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newImageUrlInput}
                          onChange={(e) => setNewImageUrlInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                          className="flex-grow px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageUrl()}
                          disabled={!newImageUrlInput.trim()}
                          className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium disabled:opacity-40"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-1.5">
                      Current Slides
                    </span>

                    {editImages.length === 0 ? (
                      <div className="text-center p-4 bg-white border border-slate-200 rounded text-slate-400 text-xs">
                        No custom images uploaded. Default preset images will be used.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                        {editImages.map((imgUrl, idx) => {
                          const resolved = resolveImageSource(imgUrl, selectedService.id);
                          return (
                            <div key={idx} className="bg-white border border-slate-200 rounded overflow-hidden flex flex-col">
                              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                <img src={resolved} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.2 rounded text-[9px] font-mono">
                                  #{idx + 1} {idx === 0 ? '(Cover)' : ''}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1 right-1 bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-700"
                                  title="Remove"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="p-1 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-30 font-medium"
                                >
                                  ←
                                </button>
                                <span className="text-slate-500">Order {idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx + 1)}
                                  disabled={idx === editImages.length - 1}
                                  className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-30 font-medium"
                                >
                                  →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={updatingService}
                  className="px-4 py-1.5 border border-slate-300 bg-white text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold disabled:opacity-50"
                >
                  {updatingService ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Direct Connection Editor Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col border border-slate-200">
            
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Direct Contact</h3>
                <p className="text-[11px] text-slate-500">{selectedConnection.title}</p>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateConnectionSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-slate-900"
                  placeholder="+62 81111..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-900"
                  placeholder="info@odst.id"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Office Address</label>
                <textarea
                  required
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-900 leading-relaxed"
                  placeholder="Street name, building, city..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedConnection(null)}
                  disabled={updatingService}
                  className="px-4 py-1.5 border border-slate-300 bg-white text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold disabled:opacity-50"
                >
                  {updatingService ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Custom Branded Confirmation Popup Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-lg">
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2.5 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                {confirmModal.cancelText || t('admin.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {confirmModal.confirmText || t('admin.confirmDelete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
