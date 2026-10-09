import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, 
  Check, 
  Filter, 
  KeyRound, 
  Eye, 
  EyeOff, 
  LogOut, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Users, 
  Layers, 
  PhoneCall, 
  AlertTriangle,
  X
} from 'lucide-react';
import apiService from '../services/api';
import logo from '../assets/odstlogo.png';
import heroBg from '../assets/hero1.webp';
import { compressImageFile } from '../utils/imageCompressor';
import { resolveImageSource } from '../components/ui/ImageCarousel';
import { FlagID, FlagEN, FlagAR } from '../components/ui/FlagIcons';

const ADMIN_LANGUAGES = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia', nativeName: 'Indonesia', Flag: FlagID },
  { code: 'en', label: 'EN', name: 'English', nativeName: 'English (US/UK)', Flag: FlagEN },
  { code: 'ar', label: 'AR', name: 'العربية', nativeName: 'العربية (Arabic)', Flag: FlagAR },
];

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
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

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

  // Change Password Modal States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('admin.passwordFieldsRequired', 'Mohon lengkapi semua kolom kata sandi.'));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t('admin.passwordMinLength', 'Kata sandi baru minimal 6 karakter.'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('admin.passwordMismatch', 'Konfirmasi kata sandi baru tidak cocok.'));
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await apiService.changePassword(currentPassword, newPassword);
      showToast(res.message || t('admin.passwordChangeSuccess', 'Kata sandi berhasil diperbarui!'), 'success');
      setIsChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || t('admin.passwordChangeFailed', 'Gagal memperbarui kata sandi.'));
    } finally {
      setPasswordLoading(false);
    }
  };

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {t('admin.unread', 'Unread')}
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
            {t('admin.read', 'Read')}
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
    <div 
      className="min-h-screen text-slate-100 flex font-sans antialiased relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark translucent backdrop overlay without blur */}
      <div className="fixed inset-0 bg-[#050c1e]/80 pointer-events-none z-0" />
      
      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Responsive Left Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 rtl:right-0 rtl:left-auto z-50 w-64 max-w-[85vw] bg-[#090f1d] text-slate-300 flex flex-col justify-between border-r rtl:border-r-0 rtl:border-l border-slate-800/80 transition-transform duration-300 ease-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30 shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full rtl:translate-x-full'
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
              <X size={16} />
            </button>
          </div>

          {/* Clean Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            <span className="block px-3 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {t('admin.management', 'Manajemen')}
            </span>

            {/* Contacts / Inquiries Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); setStatusFilter('all'); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={15} className={activeTab === 'contacts' ? 'text-white' : 'text-slate-400'} />
                <span>{t('admin.nav.inquiries', 'Customer Inquiries')}</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                activeTab === 'contacts' 
                  ? 'bg-white/20 text-white font-semibold' 
                  : (unreadCount > 0 ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-500')
              }`}>
                {contacts.length}
              </span>
            </button>

            {/* Newsletter Subscribers Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'subscribers'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={15} className={activeTab === 'subscribers' ? 'text-white' : 'text-slate-400'} />
                <span>{t('admin.nav.subscribers', 'Newsletter Subscribers')}</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                activeTab === 'subscribers' ? 'bg-white/20 text-white font-semibold' : 'text-slate-500'
              }`}>
                {subscribers.length}
              </span>
            </button>

            {/* Landing Services Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('services'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'services'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={15} className={activeTab === 'services' ? 'text-white' : 'text-slate-400'} />
                <span>{t('admin.nav.services', 'Landing Services')}</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                activeTab === 'services' ? 'bg-white/20 text-white font-semibold' : 'text-slate-500'
              }`}>
                {services.length || 3}
              </span>
            </button>

            {/* Direct Contact Directory Tab */}
            <button
              type="button"
              onClick={() => { setActiveTab('connections'); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'connections'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall size={15} className={activeTab === 'connections' ? 'text-white' : 'text-slate-400'} />
                <span>{t('admin.nav.connections', 'Direct Contact Directory')}</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                activeTab === 'connections' ? 'bg-white/20 text-white font-semibold' : 'text-slate-500'
              }`}>
                {services.length || 3}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3.5 border-t border-slate-800/80 flex flex-col space-y-2.5 text-xs text-slate-400 shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">
              {(adminUser.username || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate leading-tight">
                {adminUser.username || 'admin'}
              </div>
              <div className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                {adminUser.email || 'info@odst.id'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => {
                setPasswordError('');
                setIsChangePasswordOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-[11px] font-medium px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <KeyRound size={12} className="text-brand-orange" />
              <span>{t('admin.changePassword', 'Ubah Sandi')}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
              title={t('admin.signOut', 'Keluar')}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen relative z-10">
        
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#080f20] border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-sm gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white border border-slate-700/80 hover:bg-slate-800/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
              aria-label="Open navigation menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden xs:inline">{t('admin.menu', 'Menu')}</span>
            </button>
            <h2 className="text-xs sm:text-base font-bold text-white tracking-tight truncate max-w-[100px] xs:max-w-[160px] sm:max-w-none">
              {activeTab === 'contacts' && t('admin.nav.inquiries', 'Customer Inquiries')}
              {activeTab === 'subscribers' && t('admin.nav.subscribers', 'Newsletter Subscribers')}
              {activeTab === 'services' && t('admin.nav.services', 'Landing Services')}
              {activeTab === 'connections' && t('admin.nav.connections', 'Direct Contact Directory')}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 rtl:space-x-reverse">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('admin.search', 'Cari...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 rtl:pr-8 rtl:pl-3 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-brand-orange w-24 xs:w-32 sm:w-44 md:w-52 transition-all"
              />
            </div>

            {activeTab === 'contacts' && (
              <div className="relative shrink-0" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className={`px-2.5 sm:px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all focus:outline-none ${
                    isStatusOpen ? 'border-brand-orange text-white ring-1 ring-brand-orange/30' : 'border-slate-700/80'
                  }`}
                  title={t('admin.filterStatus', 'Filter Status')}
                >
                  <Filter size={12} className="text-slate-400" />
                  <span className="hidden sm:inline">
                    {statusFilter === 'all' && t('admin.allStatus', 'All Status')}
                    {statusFilter === 'unread' && t('admin.unread', 'Unread')}
                    {statusFilter === 'read' && t('admin.read', 'Read')}
                    {statusFilter === 'replied' && t('admin.replied', 'Replied')}
                  </span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
                </button>

                {isStatusOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-44 bg-[#0c1427] border border-slate-700/90 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                    {[
                      { value: 'all', label: t('admin.allStatus', 'All Status'), dot: 'bg-slate-400' },
                      { value: 'unread', label: t('admin.unread', 'Unread'), dot: 'bg-amber-400' },
                      { value: 'read', label: t('admin.read', 'Read'), dot: 'bg-blue-400' },
                      { value: 'replied', label: t('admin.replied', 'Replied'), dot: 'bg-emerald-400' },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(item.value);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          statusFilter === item.value
                            ? 'bg-brand-orange/20 text-brand-orange font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                          <span>{item.label}</span>
                        </div>
                        {statusFilter === item.value && <Check size={13} className="text-brand-orange" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="p-2 bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-slate-200 rounded-lg shadow-sm transition-colors disabled:opacity-50 shrink-0"
              title={t('admin.refresh', 'Refresh')}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-brand-orange' : 'text-slate-300'} />
            </button>

            {/* Custom Styled Language Dropdown */}
            <div className="relative shrink-0" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-sm transition-all focus:outline-none active:scale-95 ${
                  isLangOpen ? 'border-brand-orange ring-1 ring-brand-orange/30 text-white' : 'border-slate-700/80 hover:border-slate-600'
                }`}
                aria-label="Pilih Bahasa"
              >
                {(() => {
                  const current = ADMIN_LANGUAGES.find((l) => l.code === i18n.language) || ADMIN_LANGUAGES[0];
                  const Flag = current.Flag;
                  return (
                    <span className="flex items-center gap-2">
                      <Flag className="w-4 h-3" />
                      <span className="font-bold tracking-wider">{current.label}</span>
                    </span>
                  );
                })()}
                <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180 text-brand-orange' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0c1427] border border-slate-700/90 rounded-xl shadow-2xl shadow-black/80 p-1.5 z-50 animate-fadeIn origin-top-right rtl:left-0 rtl:right-auto rtl:origin-top-left overflow-hidden">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800/70 mb-1">
                    {t('admin.selectLanguage', 'Pilih Bahasa')}
                  </div>
                  {ADMIN_LANGUAGES.map((lang) => {
                    const isActive = i18n.language === lang.code;
                    const Flag = lang.Flag;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 text-left rtl:text-right ${
                          isActive
                            ? 'bg-brand-orange/15 text-brand-orange font-semibold border border-brand-orange/30'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Flag className="w-4 h-3" />
                          <span className="font-medium text-slate-100">{lang.name}</span>
                        </div>
                        {isActive && <Check size={14} className="text-brand-orange shrink-0 ml-2 rtl:mr-2 rtl:ml-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 flex flex-col space-y-4">
          
          {/* Toast Notification */}
          {notification && (
            <div className={`py-2.5 px-4 text-xs font-medium border rounded-xl flex justify-between items-center shadow-lg ${
              notification.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800/80'
                : notification.type === 'info'
                ? 'bg-blue-950/90 text-blue-200 border-blue-800/80'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80'
            }`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)} className="font-bold text-slate-400 hover:text-white ml-4">✕</button>
            </div>
          )}

          {/* Main Table Card */}
          <div className="bg-[#0c1427]/95 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
            
            {loading && !contacts.length && !subscribers.length && !services.length ? (
              <div className="flex items-center justify-center py-24 text-slate-400 text-xs">
                Fetching records from server...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-rose-400 text-xs font-medium">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
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
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="overflow-x-auto flex-1 overscroll-x-contain">
                    <table className="w-full min-w-[700px] text-left rtl:text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">{t('admin.sender', 'Sender')}</th>
                          <th className="py-3 px-4">{t('admin.contactDetails', 'Contact Details')}</th>
                          <th className="py-3 px-4">{t('admin.division', 'Division')}</th>
                          <th className="py-3 px-4">{t('admin.message', 'Message')}</th>
                          <th className="py-3 px-4">{t('admin.status', 'Status')}</th>
                          <th className="py-3 px-4">{t('admin.date', 'Date')}</th>
                          <th className="py-3 px-4 text-right rtl:text-left">{t('admin.actions', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {paginatedContacts.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                              {c.fullName}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <a href={`mailto:${c.email}`} className="text-slate-300 hover:text-brand-orange hover:underline font-medium block transition-colors">
                                {c.email}
                              </a>
                              <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                                {c.department}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <p className="line-clamp-2 text-slate-400 font-light">{c.message}</p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {getStatusBadge(c.status)}
                            </td>
                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                              {formatDate(c.createdAt)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-right rtl:text-left space-x-1.5 rtl:space-x-reverse">
                              <button
                                onClick={() => setSelectedMessage(c)}
                                className="px-2.5 py-1 text-slate-200 hover:bg-slate-700 bg-slate-800/70 font-medium rounded border border-slate-700/80 transition-colors"
                              >
                                {t('admin.view', 'View')}
                              </button>
                              {c.status === 'unread' && (
                                <button
                                  onClick={() => handleUpdateStatus(c.id, 'read')}
                                  className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 bg-slate-800/70 font-medium rounded border border-slate-700/80 transition-colors"
                                >
                                  {t('admin.read', 'Read')}
                                </button>
                              )}
                              {c.status !== 'replied' && (
                                <button
                                  onClick={() => handleUpdateStatus(c.id, 'replied')}
                                  className="px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/25 bg-emerald-500/15 font-medium rounded border border-emerald-500/30 transition-colors"
                                >
                                  {t('admin.replied', 'Replied')}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteContact(c.id)}
                                className="px-2.5 py-1 text-rose-400 hover:bg-rose-500/25 bg-rose-500/15 font-medium rounded border border-rose-500/30 transition-colors"
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
                    <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>
                          {t('admin.showing', 'Showing')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {(currentPage - 1) * pageSize + 1}
                          </strong>{' '}
                          {t('admin.to', 'to')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {Math.min(currentPage * pageSize, filteredContacts.length)}
                          </strong>{' '}
                          {t('admin.of', 'of')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {filteredContacts.length}
                          </strong>{' '}
                          {t('admin.entries', 'entries')}
                        </span>
                        <span className="text-slate-700">|</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="bg-slate-900/80 border border-slate-700/80 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
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
                          className="px-2.5 py-1 rounded bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
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
                                  ? 'bg-brand-orange text-white shadow-sm'
                                  : 'bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalContactPages, p + 1))}
                          disabled={currentPage >= totalContactPages}
                          className="px-2.5 py-1 rounded bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
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
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="overflow-x-auto flex-1 overscroll-x-contain">
                    <table className="w-full min-w-[620px] text-left rtl:text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">{t('admin.subscriberName', 'Subscriber Name')}</th>
                          <th className="py-3 px-4">{t('admin.phone', 'Phone Number')}</th>
                          <th className="py-3 px-4">{t('admin.email', 'Email Address')}</th>
                          <th className="py-3 px-4">{t('admin.dateSubscribed', 'Date Subscribed')}</th>
                          <th className="py-3 px-4 text-right rtl:text-left">{t('admin.actions', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {paginatedSubscribers.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-semibold text-white">{s.fullName}</td>
                            <td className="py-3 px-4 font-mono text-slate-400">{s.phone || '-'}</td>
                            <td className="py-3 px-4">
                              <a href={`mailto:${s.email}`} className="text-slate-300 hover:text-brand-orange hover:underline font-medium transition-colors">
                                {s.email}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px]">{formatDate(s.createdAt)}</td>
                            <td className="py-3 px-4 text-right rtl:text-left">
                              <button
                                onClick={() => handleDeleteSubscriber(s.id)}
                                className="px-2.5 py-1 text-rose-400 hover:bg-rose-500/25 bg-rose-500/15 font-medium rounded border border-rose-500/30 transition-colors"
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
                    <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>
                          {t('admin.showing', 'Showing')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {(currentPage - 1) * pageSize + 1}
                          </strong>{' '}
                          {t('admin.to', 'to')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {Math.min(currentPage * pageSize, filteredSubscribers.length)}
                          </strong>{' '}
                          {t('admin.of', 'of')}{' '}
                          <strong className="text-slate-200 font-semibold">
                            {filteredSubscribers.length}
                          </strong>{' '}
                          {t('admin.entries', 'entries')}
                        </span>
                        <span className="text-slate-700">|</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="bg-slate-900/80 border border-slate-700/80 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
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
                          className="px-2.5 py-1 rounded bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
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
                                  ? 'bg-brand-orange text-white shadow-sm'
                                  : 'bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalSubscriberPages, p + 1))}
                          disabled={currentPage >= totalSubscriberPages}
                          className="px-2.5 py-1 rounded bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
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
                <div className="overflow-x-auto overscroll-x-contain flex-1">
                  <table className="w-full min-w-[760px] text-left rtl:text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">{t('admin.division', 'Service')} / {t('admin.status', 'Badge')}</th>
                        <th className="py-3 px-4">{t('admin.slideshow', 'Slideshow (3s)')}</th>
                        <th className="py-3 px-4">{t('admin.description', 'Description')}</th>
                        <th className="py-3 px-4">{t('admin.layout', 'Layout')}</th>
                        <th className="py-3 px-4">{t('admin.actionLink', 'Action Link')}</th>
                        <th className="py-3 px-4 text-right rtl:text-left">{t('admin.actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredServices.map((s) => {
                        const slideCount = Array.isArray(s.images) && s.images.length > 0 ? s.images.length : (s.imageUrl ? 1 : 0);
                        const coverSrc = resolveImageSource((s.images && s.images[0]) || s.imageUrl || '', s.id);
                        return (
                          <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 mb-0.5">
                                {s.badge}
                              </span>
                              <div className="font-bold text-white">{s.title}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-8 rounded bg-slate-900 overflow-hidden border border-slate-700 shrink-0">
                                  <img src={coverSrc} alt={s.title} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-slate-300 font-medium">
                                  {slideCount} {slideCount === 1 ? t('admin.photo', 'photo') : t('admin.photos', 'photos')}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 max-w-sm">
                              <p className="line-clamp-2 text-slate-400 font-light">{s.description}</p>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                              {s.imageLeft ? t('admin.imageLeft', 'Image Left') : t('admin.imageRight', 'Image Right')}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                              {s.link}
                            </td>
                            <td className="py-3.5 px-4 text-right rtl:text-left whitespace-nowrap">
                              <button
                                onClick={() => handleEditServiceClick(s)}
                                className="px-3 py-1.5 bg-slate-800/70 border border-slate-700/80 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs shadow-sm transition-colors"
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
                <div className="overflow-x-auto overscroll-x-contain flex-1">
                  <table className="w-full min-w-[680px] text-left rtl:text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">{t('admin.division', 'Division')} / {t('admin.status', 'Title')}</th>
                        <th className="py-3 px-4">{t('admin.phone', 'Phone Number')}</th>
                        <th className="py-3 px-4">{t('admin.email', 'Email Address')}</th>
                        <th className="py-3 px-4">{t('admin.officeAddress', 'Office Address')}</th>
                        <th className="py-3 px-4 text-right rtl:text-left">{t('admin.actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredServices.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 mb-0.5">
                              {s.badge}
                            </span>
                            <div className="font-bold text-white">{s.title}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                            {s.phone || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <a href={`mailto:${s.email}`} className="text-slate-300 hover:text-brand-orange hover:underline transition-colors">
                              {s.email || '-'}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 max-w-sm text-slate-400 font-light text-[11px]">
                            {s.address || '-'}
                          </td>
                          <td className="py-3.5 px-4 text-right rtl:text-left whitespace-nowrap">
                            <button
                              onClick={() => handleEditConnectionClick(s)}
                              className="px-3 py-1.5 bg-slate-800/70 border border-slate-700/80 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs shadow-sm transition-colors"
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
      {/* Customer Inquiry Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 font-sans animate-fadeIn">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700/80 max-h-[92vh] text-slate-200">
            
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white">{t('admin.inquiryDetails', 'Detail Pertanyaan Pelanggan')}</h3>
                <p className="text-[11px] text-slate-400 font-mono">ID: {selectedMessage.id}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.sender', 'Pengirim')}</span>
                  <span className="font-semibold text-white text-sm">{selectedMessage.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.division', 'Divisi')}</span>
                  <span className="font-semibold text-slate-200">{selectedMessage.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.email', 'Email')}</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-slate-300 hover:text-brand-orange hover:underline font-medium break-all">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.phone', 'Telepon')}</span>
                  <span className="font-mono text-slate-300">{selectedMessage.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.status', 'Status')}</span>
                  <div className="mt-0.5">{getStatusBadge(selectedMessage.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">{t('admin.date', 'Tanggal')}</span>
                  <span className="text-slate-300">{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">{t('admin.message', 'Pesan')}</span>
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  disabled={selectedMessage.status === 'read'}
                  className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700 disabled:opacity-40"
                >
                  {t('admin.markRead', 'Tandai Dibaca')}
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={selectedMessage.status === 'replied'}
                  className="px-2.5 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-lg hover:bg-emerald-500/30 disabled:opacity-40"
                >
                  {t('admin.markReplied', 'Tandai Dibalas')}
                </button>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleDeleteContact(selectedMessage.id)}
                  className="px-2.5 py-1.5 text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 text-xs font-medium rounded-lg border border-rose-500/30"
                >
                  {t('admin.delete', 'Hapus')}
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  {t('admin.close', 'Tutup')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Service & Slideshow Editor Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-sans animate-fadeIn">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700/80 max-h-[90vh] text-slate-200">
            
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div>
                <h3 className="text-sm font-bold text-white">{t('admin.editService', 'Edit Layanan')}</h3>
                <p className="text-[11px] text-slate-400">{selectedService.title} ({selectedService.id})</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-grow text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.serviceBadge', 'Badge / Kategori')}</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.serviceTitle', 'Judul Layanan')}</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.description', 'Deskripsi')}</label>
                  <textarea
                    required
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-orange leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.actionLink', 'Tautan Aksi (CTA)')}</label>
                  <input
                    type="text"
                    required
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                  <input
                    type="checkbox"
                    id="imageLeft"
                    checked={editImageLeft}
                    onChange={(e) => setEditImageLeft(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                  />
                  <label htmlFor="imageLeft" className="text-xs text-slate-300">
                    {t('admin.imageLeft', 'Gambar di Kiri')}
                  </label>
                </div>

                {/* Slideshow Manager */}
                <div className="border border-slate-800 rounded-xl p-4 space-y-3 bg-slate-900/80">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-semibold text-white text-xs block">{t('admin.slideshow', 'Slideshow (3 dtk)')}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[11px] font-semibold">
                      {editImages.length} {t('admin.photos', 'foto')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        {t('admin.uploadImages', 'Unggah File Gambar')}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={compressingImages}
                        onChange={handleMultiImageFileChange}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-slate-700 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                      />
                      {compressingImages && (
                        <p className="text-[10px] text-amber-400 mt-1">{t('admin.saving', 'Menyimpan...')}</p>
                      )}
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        {t('admin.addImage', 'Tambah Gambar via URL')}
                      </span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newImageUrlInput}
                          onChange={(e) => setNewImageUrlInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                          className="flex-grow px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageUrl()}
                          disabled={!newImageUrlInput.trim()}
                          className="px-3 py-1 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                      {t('admin.photos', 'Foto')}
                    </span>

                    {editImages.length === 0 ? (
                      <div className="text-center p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-400 text-xs">
                        -
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                        {editImages.map((imgUrl, idx) => {
                          const resolved = resolveImageSource(imgUrl, selectedService.id);
                          return (
                            <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                              <div className="relative aspect-video bg-black/40 overflow-hidden">
                                <img src={resolved} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute top-1 left-1 bg-black/75 text-white px-1.5 py-0.2 rounded text-[9px] font-mono">
                                  #{idx + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1 right-1 bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-700"
                                  title={t('admin.delete', 'Hapus')}
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="p-1 bg-slate-950/70 border-t border-slate-800 flex justify-between items-center text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded disabled:opacity-30 font-medium hover:bg-slate-700"
                                >
                                  ←
                                </button>
                                <span className="text-slate-400">{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx + 1)}
                                  disabled={idx === editImages.length - 1}
                                  className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded disabled:opacity-30 font-medium hover:bg-slate-700"
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

              <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={updatingService}
                  className="px-4 py-1.5 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700"
                >
                  {t('admin.cancel', 'Batal')}
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50 shadow-md"
                >
                  {updatingService ? t('admin.saving', 'Menyimpan...') : t('admin.saveChanges', 'Simpan Perubahan')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Direct Connection Editor Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-sans animate-fadeIn">
          <div className="bg-[#0f172a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700/80 text-slate-200">
            
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div>
                <h3 className="text-sm font-bold text-white">{t('admin.editContact', 'Edit Kontak')}</h3>
                <p className="text-[11px] text-slate-400">{selectedConnection.title}</p>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateConnectionSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.contactPhone', 'Nomor Telepon Kantor')}</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-brand-orange"
                  placeholder="+62 81111..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.contactEmail', 'Email Kontak')}</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-orange"
                  placeholder="info@odst.id"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t('admin.contactAddress', 'Alamat Kantor')}</label>
                <textarea
                  required
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-orange leading-relaxed"
                  placeholder="Street name, building, city..."
                />
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedConnection(null)}
                  disabled={updatingService}
                  className="px-4 py-1.5 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700"
                >
                  {t('admin.cancel', 'Batal')}
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50 shadow-md"
                >
                  {updatingService ? t('admin.saving', 'Menyimpan...') : t('admin.saveContact', 'Simpan Kontak')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Custom Branded Confirmation Popup Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fadeIn">
          <div className="bg-[#0f172a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/80 text-slate-200">
            <div className="p-6">
              <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800 flex justify-end space-x-2.5 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                {confirmModal.cancelText || t('admin.cancel', 'Batal')}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {confirmModal.confirmText || t('admin.confirmDelete', 'Hapus')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/90 w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {t('admin.changePasswordTitle', 'Ubah Kata Sandi Admin')}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('admin.changePasswordDesc', 'Perbarui kata sandi akun administrator Anda')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!passwordLoading) {
                    setIsChangePasswordOpen(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }
                }}
                disabled={passwordLoading}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePasswordSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {passwordError && (
                <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle size={15} className="shrink-0 text-rose-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('admin.currentPassword', 'Kata Sandi Saat Ini')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pr-10 rtl:pl-10 rtl:pr-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('admin.newPassword', 'Kata Sandi Baru')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pr-10 rtl:pl-10 rtl:pr-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <span className="block text-[10px] text-slate-500">
                  {t('admin.passwordRule', 'Minimal 6 karakter')}
                </span>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('admin.confirmNewPassword', 'Konfirmasi Kata Sandi Baru')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pr-10 rtl:pl-10 rtl:pr-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <span className="block text-[10px] text-rose-400 font-medium">
                    {t('admin.passwordMismatch', 'Konfirmasi kata sandi tidak cocok')}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-2.5 pt-3 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  disabled={passwordLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 text-center"
                >
                  {t('admin.cancel', 'Batal')}
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span>{t('admin.saving', 'Menyimpan...')}</span>
                    </>
                  ) : (
                    <span>{t('admin.savePassword', 'Simpan Kata Sandi')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
