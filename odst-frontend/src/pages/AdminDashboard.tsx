import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Inbox, 
  Mail, 
  LogOut, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  MessageSquare, 
  RefreshCw, 
  Search,
  User as UserIcon,
  Calendar,
  Phone,
  Tag,
  Edit,
  Globe,
  ExternalLink,
  X,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import apiService from '../services/api';
import { Badge } from '../components/ui/Badge';
import logo from '../assets/odstlogo.png';

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
  imageUrl: string;
  imageLeft: boolean;
  link: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'subscribers' | 'services' | 'connections'>('contacts');
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
  
  // Edit Service Form States
  const [editBadge, setEditBadge] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageLeft, setEditImageLeft] = useState(false);
  const [editLink, setEditLink] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [updatingService, setUpdatingService] = useState(false);
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
    navigate('/admin/login');
  };

  // Contacts Actions
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      const updated = await apiService.updateContactStatus(id, newStatus);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      
      // Update selected message modal details if open
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }
      showToast(`Inquiry marked as ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await apiService.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      showToast('Inquiry deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  // Newsletter Actions
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this newsletter subscriber?')) return;
    try {
      await apiService.deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      showToast('Subscriber removed from list', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove subscriber', 'error');
    }
  };

  // Services Actions
  const handleEditServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setEditBadge(service.badge);
    setEditTitle(service.title);
    setEditDescription(service.description);
    setEditImageUrl(service.imageUrl || '');
    setEditImageLeft(service.imageLeft || false);
    setEditLink(service.link || '');
    setEditPhone(service.phone || '');
    setEditEmail(service.email || '');
    setEditAddress(service.address || '');
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
        imageUrl: editImageUrl,
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('File is too large. Max size is 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Filter Subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
    );
  }, [subscribers, searchQuery]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return contacts.filter((c) => c.status === 'unread').length;
  }, [contacts]);

  const getStatusBadgeColor = (status: 'unread' | 'read' | 'replied') => {
    switch (status) {
      case 'unread':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'read':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'replied':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 bg-[#050c1e]/95 backdrop-blur-md text-white py-3.5 px-4 sm:px-6 lg:px-10 flex justify-between items-center shadow-lg border-b border-slate-800">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
            <img src={logo} alt="ODST Logo" className="h-8 sm:h-10 w-auto" />
          </Link>
          <div className="border-l border-slate-700 pl-3 sm:pl-3.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white uppercase font-sans">
                Control Center
              </h1>
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30 uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium tracking-widest uppercase hidden sm:block">
              ODST Group Management
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* External website link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Public Website"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <Globe size={13} className="text-brand-gold" />
            <span>Public Site</span>
            <ExternalLink size={11} className="opacity-60" />
          </Link>

          {/* User Badge */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-lg bg-brand-navy flex items-center justify-center text-brand-gold border border-brand-gold/30 text-xs font-bold shrink-0">
              {(adminUser.username || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider leading-none">
                {adminUser.username || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                {adminUser.email || 'admin@odst.id'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all text-xs font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col space-y-5 sm:space-y-6">
        
        {/* KPI Quick Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* Inquiries Stat */}
          <button
            onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
            className={`p-3.5 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'contacts'
                ? 'bg-white border-brand-navy shadow-md ring-2 ring-brand-navy/10'
                : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-sm hover:shadow'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiries</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Inbox size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {contacts.length}
              </span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              Customer contact forms
            </p>
          </button>

          {/* Subscribers Stat */}
          <button
            onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
            className={`p-3.5 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'subscribers'
                ? 'bg-white border-brand-navy shadow-md ring-2 ring-brand-navy/10'
                : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-sm hover:shadow'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Subscribers</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Mail size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {subscribers.length}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                Mailchimp
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              Live newsletter audience
            </p>
          </button>

          {/* Services Stat */}
          <button
            onClick={() => { setActiveTab('services'); setSearchQuery(''); }}
            className={`p-3.5 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'services'
                ? 'bg-white border-brand-navy shadow-md ring-2 ring-brand-navy/10'
                : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-sm hover:shadow'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Services</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Layers size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {services.length || 3}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Divisions</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              Landing page showcases
            </p>
          </button>

          {/* Direct Connections Stat */}
          <button
            onClick={() => { setActiveTab('connections'); setSearchQuery(''); }}
            className={`p-3.5 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'connections'
                ? 'bg-white border-brand-navy shadow-md ring-2 ring-brand-navy/10'
                : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-sm hover:shadow'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                {services.length || 3}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Direct</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              Phones, emails & offices
            </p>
          </button>

        </div>

        {/* Navigation Tabs and Refresh Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          
          {/* Scrollable Pills Container on Mobile */}
          <div className="overflow-x-auto scrollbar-hide py-0.5 -mx-1 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-max min-w-full sm:min-w-0">
              
              <button
                onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'bg-white text-brand-navy shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Inbox size={15} className={activeTab === 'contacts' ? 'text-brand-orange' : ''} />
                <span>Contact Messages</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'bg-white text-brand-navy shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Mail size={15} className={activeTab === 'subscribers' ? 'text-brand-orange' : ''} />
                <span>Newsletter Subscribers</span>
              </button>

              <button
                onClick={() => { setActiveTab('services'); setSearchQuery(''); }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-white text-brand-navy shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Globe size={15} className={activeTab === 'services' ? 'text-brand-orange' : ''} />
                <span>Services Content</span>
              </button>

              <button
                onClick={() => { setActiveTab('connections'); setSearchQuery(''); }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'connections'
                    ? 'bg-white text-brand-navy shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Phone size={15} className={activeTab === 'connections' ? 'text-brand-orange' : ''} />
                <span>Direct Connections</span>
              </button>

            </div>
          </div>

          {/* Refresh Data Button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.98] text-xs font-semibold text-slate-700 transition-all shadow-sm disabled:opacity-60 shrink-0 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-brand-orange' : 'text-slate-500'} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs sm:text-sm flex items-start space-x-3 shadow-sm animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error: </span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-rose-400 hover:text-rose-700 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-grow sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder={
                activeTab === 'contacts' 
                  ? 'Search sender, email, phone, message...' 
                  : activeTab === 'subscribers' 
                  ? 'Search subscriber name, email, phone...' 
                  : activeTab === 'services'
                  ? 'Search service title, badge, content...'
                  : 'Search division, phone, email, address...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Filters & Counts */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {activeTab === 'contacts' && (
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">All Statuses ({contacts.length})</option>
                  <option value="unread">Unread ({contacts.filter(c => c.status === 'unread').length})</option>
                  <option value="read">Read ({contacts.filter(c => c.status === 'read').length})</option>
                  <option value="replied">Replied ({contacts.filter(c => c.status === 'replied').length})</option>
                </select>
              </div>
            )}

            <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden md:inline-block">
              Showing {activeTab === 'contacts' ? filteredContacts.length : activeTab === 'subscribers' ? filteredSubscribers.length : filteredServices.length} items
            </span>
          </div>
        </div>

        {/* Data Presentation Area */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex-grow flex flex-col min-h-[380px]">
          
          {loading ? (
            <div className="flex-grow flex flex-col justify-center items-center py-20 space-y-4">
              <RefreshCw className="animate-spin text-brand-orange w-8 h-8 sm:w-10 sm:h-10" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Retrieving live records...</p>
            </div>
          ) : activeTab === 'contacts' ? (
            
            // CONTACT INQUIRIES TAB
            filteredContacts.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                  <Inbox size={28} />
                </div>
                <p className="text-slate-700 font-bold text-sm sm:text-base">No contact inquiries found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search query or filter options.' 
                    : 'Submissions from the public contact form will automatically appear here.'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View (md and up) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Sender Details</th>
                        <th className="py-3.5 px-6">Division</th>
                        <th className="py-3.5 px-6">Message Snippet</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-800">{c.fullName}</div>
                            <div className="text-xs text-slate-500 space-y-0.5 mt-0.5">
                              <a href={`mailto:${c.email}`} className="hover:text-brand-navy hover:underline block">{c.email}</a>
                              <a href={`tel:${c.phone}`} className="hover:text-brand-navy hover:underline block font-mono text-[11px]">{c.phone}</a>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge>{c.department}</Badge>
                          </td>
                          <td className="py-4 px-6 max-w-xs">
                            <p className="truncate text-slate-600 font-light text-xs sm:text-sm" title={c.message}>
                              {c.message}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full ${getStatusBadgeColor(c.status)}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                            {formatDate(c.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex justify-center items-center space-x-1.5">
                              <button
                                onClick={() => setSelectedMessage(c)}
                                title="View details"
                                className="p-2 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(c.id, 'replied')}
                                title="Mark as replied"
                                disabled={c.status === 'replied'}
                                className="p-2 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteContact(c.id)}
                                title="Delete inquiry"
                                className="p-2 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card View (under md) */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredContacts.map((c) => (
                    <div key={c.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{c.fullName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-[9px] px-2 py-0.5">{c.department}</Badge>
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-full ${getStatusBadgeColor(c.status)}`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-brand-navy hover:underline">
                          <Mail size={12} className="text-brand-gold" />
                          <span className="truncate max-w-[200px]">{c.email}</span>
                        </a>
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-brand-navy hover:underline">
                          <Phone size={12} className="text-brand-gold" />
                          <span>{c.phone}</span>
                        </a>
                      </div>

                      {/* Message Preview */}
                      <div 
                        onClick={() => setSelectedMessage(c)}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-2 cursor-pointer hover:border-slate-200"
                      >
                        {c.message}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setSelectedMessage(c)}
                          className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1"
                        >
                          <Eye size={14} />
                          <span>View Full Message</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'replied')}
                            disabled={c.status === 'replied'}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 disabled:opacity-40 rounded-lg text-xs"
                            title="Mark replied"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === 'subscribers' ? (
            
            // NEWSLETTER SUBSCRIBERS TAB
            filteredSubscribers.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                  <Mail size={28} />
                </div>
                <p className="text-slate-700 font-bold text-sm sm:text-base">No newsletter subscribers found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Subscribers signing up via the website footer are synced here directly from Mailchimp.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Name</th>
                        <th className="py-3.5 px-6">Phone Number</th>
                        <th className="py-3.5 px-6">Email Address</th>
                        <th className="py-3.5 px-6">Subscribed Date</th>
                        <th className="py-3.5 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredSubscribers.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-semibold text-slate-800">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-xs">
                                {(s.fullName || 'S').charAt(0).toUpperCase()}
                              </div>
                              <span>{s.fullName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                            {s.phone || '-'}
                          </td>
                          <td className="py-4 px-6 text-slate-700 font-medium">
                            <a href={`mailto:${s.email}`} className="hover:text-brand-navy hover:underline">{s.email}</a>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {formatDate(s.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteSubscriber(s.id)}
                              title="Unsubscribe member"
                              className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredSubscribers.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-xs shrink-0">
                          {(s.fullName || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{s.fullName}</h4>
                          <a href={`mailto:${s.email}`} className="text-[11px] text-slate-500 block truncate hover:underline">{s.email}</a>
                          <p className="text-[10px] text-slate-400">{s.phone ? `Phone: ${s.phone} • ` : ''}{formatDate(s.createdAt)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubscriber(s.id)}
                        title="Unsubscribe"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === 'services' ? (
            
            // SERVICES CONTENT TAB
            filteredServices.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                  <Globe size={28} />
                </div>
                <p className="text-slate-700 font-bold text-sm sm:text-base">No services found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Connect your database or run the backend seed script to populate services.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Badge / Title</th>
                        <th className="py-3.5 px-6">Description</th>
                        <th className="py-3.5 px-6">Layout Direction</th>
                        <th className="py-3.5 px-6">Action Button Link</th>
                        <th className="py-3.5 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredServices.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">{s.badge}</span>
                            <div className="font-semibold text-slate-800">{s.title}</div>
                          </td>
                          <td className="py-4 px-6 max-w-sm">
                            <p className="line-clamp-2 text-slate-600 font-light text-xs sm:text-sm">{s.description}</p>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {s.imageLeft ? 'Image on Left' : 'Image on Right'}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                            {s.link}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleEditServiceClick(s)}
                              title="Edit Service Content"
                              className="p-2 hover:bg-brand-orange/10 text-slate-600 hover:text-brand-orange rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredServices.map((s) => (
                    <div key={s.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">
                            {s.badge}
                          </span>
                          <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                        </div>
                        <button
                          onClick={() => handleEditServiceClick(s)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-xs font-semibold hover:bg-brand-orange hover:text-white transition-colors"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 font-light leading-relaxed">
                        {s.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Layout: {s.imageLeft ? 'Image Left' : 'Image Right'}</span>
                        <span className="font-mono text-slate-500">{s.link}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            
            // DIRECT CONNECTIONS TAB
            filteredServices.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                  <Phone size={28} />
                </div>
                <p className="text-slate-700 font-bold text-sm sm:text-base">No connections found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Seed services in database to manage direct connection channels.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Division / Badge</th>
                        <th className="py-3.5 px-6">Phone Number</th>
                        <th className="py-3.5 px-6">Email Address</th>
                        <th className="py-3.5 px-6">Office Address</th>
                        <th className="py-3.5 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredServices.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">{s.badge}</span>
                            <div className="font-semibold text-slate-800">{s.title}</div>
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-700 text-xs sm:text-sm">
                            {s.phone ? (
                              <a href={`tel:${s.phone}`} className="hover:underline hover:text-brand-navy font-mono">{s.phone}</a>
                            ) : '-'}
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs sm:text-sm">
                            {s.email ? (
                              <a href={`mailto:${s.email}`} className="hover:underline hover:text-brand-navy">{s.email}</a>
                            ) : '-'}
                          </td>
                          <td className="py-4 px-6 text-slate-500 max-w-xs truncate text-xs sm:text-sm">
                            {s.address || '-'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleEditConnectionClick(s)}
                              title="Edit Direct Connection details"
                              className="p-2 hover:bg-brand-orange/10 text-slate-600 hover:text-brand-orange rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredServices.map((s) => (
                    <div key={s.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">
                            {s.badge}
                          </span>
                          <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                        </div>
                        <button
                          onClick={() => handleEditConnectionClick(s)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-xs font-semibold hover:bg-brand-orange hover:text-white transition-colors"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-brand-gold shrink-0" />
                          {s.phone ? (
                            <a href={`tel:${s.phone}`} className="hover:underline font-mono">{s.phone}</a>
                          ) : (
                            <span className="text-slate-400">No phone configured</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-brand-gold shrink-0" />
                          {s.email ? (
                            <a href={`mailto:${s.email}`} className="hover:underline truncate">{s.email}</a>
                          ) : (
                            <span className="text-slate-400">No email configured</span>
                          )}
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={13} className="text-brand-gold shrink-0 mt-0.5" />
                          <span className="text-slate-500 leading-snug">{s.address || 'No office address configured'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </main>

      {/* Message Viewer Modal Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-4 sm:p-5 flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span>Contact Inquiry Details</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">ID: {selectedMessage.id}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 md:p-8 space-y-5 overflow-y-auto flex-grow">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <UserIcon size={14} className="text-brand-orange shrink-0" />
                    <span className="font-semibold text-slate-800">Sender:</span>
                    <span className="truncate">{selectedMessage.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail size={14} className="text-brand-orange shrink-0" />
                    <span className="font-semibold text-slate-800">Email:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-brand-navy font-medium truncate">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone size={14} className="text-brand-orange shrink-0" />
                    <span className="font-semibold text-slate-800">Phone:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="hover:underline text-brand-navy font-medium">
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Tag size={14} className="text-brand-orange shrink-0" />
                    <span className="font-semibold text-slate-800">Division:</span>
                    <Badge className="text-[10px]">{selectedMessage.department}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar size={14} className="text-brand-orange shrink-0" />
                    <span className="font-semibold text-slate-800">Submitted:</span>
                    <span className="text-slate-500">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span className="font-semibold text-slate-800">Status:</span>
                    <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-full ${getStatusBadgeColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  Customer Message Content
                </h4>
                <div className="bg-slate-50/80 border border-slate-200/80 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-light">
                  {selectedMessage.message}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              
              {/* Quick Status Adjustments */}
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  disabled={selectedMessage.status === 'read'}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all disabled:opacity-40"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={selectedMessage.status === 'replied'}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all disabled:opacity-40"
                >
                  Mark Replied
                </button>
              </div>

              {/* Close & Delete Buttons */}
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleDeleteContact(selectedMessage.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 border border-rose-200 bg-white hover:bg-rose-500 hover:text-white rounded-xl text-rose-600 text-xs font-semibold transition-all"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 sm:flex-none px-5 py-2 bg-[#050c1e] text-white hover:bg-brand-navy rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Service Editor Modal Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-4 sm:p-5 flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Edit Service Details</h3>
                <p className="text-[10px] text-slate-400 font-mono">Service ID: {selectedService.id}</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="flex flex-col flex-grow overflow-hidden">
              {/* Modal Body */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 overflow-y-auto flex-grow">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Badge */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Badge Label</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Service Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                  />
                </div>

                {/* Learn More URL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Action Link (Learn More)</label>
                  <input
                    type="text"
                    required
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all font-mono"
                  />
                </div>

                {/* Layout Checkbox */}
                <div className="flex items-center space-x-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="imageLeft"
                    checked={editImageLeft}
                    onChange={(e) => setEditImageLeft(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-orange focus:ring-brand-orange/40 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="imageLeft" className="text-xs font-medium text-slate-700 select-none cursor-pointer">
                    Layout: Display Image on Left side on desktop
                  </label>
                </div>

                {/* Image upload & preview */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Service Image</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left: Input file & URL text */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Upload Local Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy/10 file:text-brand-navy hover:file:bg-brand-navy/20 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Or paste Image URL</span>
                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-xs font-mono"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    {/* Right: Live Preview */}
                    <div className="flex flex-col justify-center items-center bg-white border border-slate-200 rounded-xl p-2.5 min-h-[120px] max-h-[160px] overflow-hidden relative">
                      {editImageUrl ? (
                        <>
                          <img
                            src={
                              editImageUrl === 'hotels'
                                ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
                                : editImageUrl === 'airlines'
                                ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80'
                                : editImageUrl === 'travel'
                                ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80'
                                : editImageUrl
                            }
                            alt="Preview"
                            className="max-h-[130px] max-w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setEditImageUrl('')}
                            className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 text-[10px] hover:bg-rose-600 transition-colors shadow"
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-3 text-slate-400 text-xs">
                          <Sparkles size={18} className="mx-auto mb-1 text-slate-300" />
                          <span>No custom image (uses fallback)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={updatingService}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-xl text-xs font-bold transition-all shadow hover:shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updatingService ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Direct Connection Editor Modal Overlay */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-4 sm:p-5 flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Edit Direct Connection Details</h3>
                <p className="text-[10px] text-slate-400 font-mono">Division ID: {selectedConnection.id}</p>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateConnectionSubmit} className="flex flex-col flex-grow overflow-hidden">
              {/* Modal Body */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 overflow-y-auto flex-grow">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Badge */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Badge Label</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Division Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all font-mono"
                      placeholder="+62 811..."
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all"
                      placeholder="info@odst.id"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Office Address</label>
                  <textarea
                    required
                    rows={3}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs sm:text-sm transition-all leading-relaxed"
                    placeholder="Office address details..."
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedConnection(null)}
                  disabled={updatingService}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-xl text-xs font-bold transition-all shadow hover:shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updatingService ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Custom Responsive Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[100] bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 animate-fadeIn font-sans">
          <div className={`p-2 rounded-xl shrink-0 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {notification.type === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">
              {notification.message}
            </p>
          </div>

          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X size={15} />
          </button>
        </div>
      )}

    </div>
  );
}
