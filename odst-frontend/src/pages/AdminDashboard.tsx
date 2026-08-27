import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Globe
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
      }, 3000);
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
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter Subscribers
  const filteredSubscribers = subscribers.filter((s) => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  const getStatusBadgeColor = (status: 'unread' | 'read' | 'replied') => {
    switch (status) {
      case 'unread':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'read':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'replied':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <header className="bg-[#050c1e] text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-md border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="ODST Logo" className="h-10 w-auto" />
          <div className="border-l border-slate-700 pl-3">
            <h1 className="text-sm md:text-base font-bold tracking-tight text-white uppercase">Control Center</h1>
            <p className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 text-sm">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <UserIcon size={12} className="text-brand-gold" />
              {adminUser.username || 'Admin'}
            </span>
            <span className="text-[10px] text-slate-400">{adminUser.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-rose-500 hover:text-white rounded-lg transition-colors text-xs font-semibold"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-grow max-w-[85rem] w-full mx-auto px-4 md:px-8 py-8 flex flex-col space-y-6">
        
        {/* Navigation Tabs and Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex space-x-2 bg-slate-200/60 p-1.5 rounded-xl self-start">
            <button
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'contacts'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Inbox size={16} />
              <span>Contact Messages</span>
            </button>
            <button
              onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'subscribers'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail size={16} />
              <span>Newsletter Subscribers</span>
            </button>
            <button
              onClick={() => { setActiveTab('services'); setSearchQuery(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe size={16} />
              <span>Services Content</span>
            </button>
            <button
              onClick={() => { setActiveTab('connections'); setSearchQuery(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'connections'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone size={16} />
              <span>Direct Connections</span>
            </button>
          </div>

          {/* Quick Stats or Actions */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 self-end md:self-auto px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-sm flex items-center space-x-3">
            <span className="font-bold">⚠ Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={
                activeTab === 'contacts' 
                  ? 'Search messages, name, email...' 
                  : activeTab === 'subscribers' 
                  ? 'Search subscribers, email...' 
                  : 'Search services, badge, description...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm placeholder-slate-400 transition-all"
            />
          </div>

          {/* Contacts Filter Dropdown */}
          {activeTab === 'contacts' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">All Inquiries</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          )}
        </div>

        {/* Data Presentation Area */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex-grow flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex-grow flex flex-col justify-center items-center py-20 space-y-4">
              <RefreshCw className="animate-spin text-brand-orange w-10 h-10" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Retrieving records...</p>
            </div>
          ) : activeTab === 'contacts' ? (
            // CONTACT INQUIRIES TAB
            filteredContacts.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-20 text-center space-y-3">
                <Inbox size={48} className="text-slate-300" />
                <p className="text-slate-500 font-medium text-sm">No contact inquiries found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Submissions from the front-end page contact form will appear in this workspace.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Sender Details</th>
                      <th className="py-4 px-6">Division Target</th>
                      <th className="py-4 px-6">Message Snippet</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Submitted At</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800">{c.fullName}</div>
                          <div className="text-xs text-slate-400 space-y-0.5">
                            <p>{c.email}</p>
                            <p>{c.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge>{c.department}</Badge>
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <p className="truncate text-slate-600 font-light">{c.message}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full ${getStatusBadgeColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-light">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <button
                              onClick={() => setSelectedMessage(c)}
                              title="View details"
                              className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(c.id, 'replied')}
                              title="Mark as replied"
                              disabled={c.status === 'replied'}
                              className="p-2 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(c.id)}
                              title="Delete inquiry"
                              className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
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
            )
) : activeTab === 'subscribers' ? (
            // NEWSLETTER SUBSCRIBERS TAB
            filteredSubscribers.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-20 text-center space-y-3">
                <Mail size={48} className="text-slate-300" />
                <p className="text-slate-500 font-medium text-sm">No subscribers found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Subscribers signing up via the footer newsletter box will be recorded here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Subscribed Date</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredSubscribers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {s.fullName}
                        </td>
                        <td className="py-4 px-6 font-light text-slate-600">
                          {s.phone}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {s.email}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-light">
                          {formatDate(s.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteSubscriber(s.id)}
                            title="Unsubscribe subscriber"
                            className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'services' ? (
            // SERVICES CONTENT TAB
            filteredServices.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-20 text-center space-y-3">
                <Globe size={48} className="text-slate-300 animate-pulse" />
                <p className="text-slate-500 font-medium text-sm">No services found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Connect your database or run seed to see services.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Badge / Title</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6">Layout Direction</th>
                      <th className="py-4 px-6">Action Button Link</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredServices.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">{s.badge}</span>
                          <div className="font-semibold text-slate-800">{s.title}</div>
                        </td>
                        <td className="py-4 px-6 max-w-sm">
                          <p className="line-clamp-2 text-slate-600 font-light">{s.description}</p>
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
                            className="p-2 hover:bg-brand-orange/10 text-slate-500 hover:text-brand-orange rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // DIRECT CONNECTIONS TAB
            filteredServices.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center py-20 text-center space-y-3">
                <Phone size={48} className="text-slate-300 animate-pulse" />
                <p className="text-slate-500 font-medium text-sm">No connections found</p>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Seed services in database to manage direct connections.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Division / Badge</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Office Address</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredServices.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-brand-gold bg-brand-navy/5 border border-brand-gold/20 rounded-md mb-1">{s.badge}</span>
                          <div className="font-semibold text-slate-800">{s.title}</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {s.phone || '-'}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {s.email || '-'}
                        </td>
                        <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                          {s.address || '-'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleEditConnectionClick(s)}
                            title="Edit Direct Connection details"
                            className="p-2 hover:bg-brand-orange/10 text-slate-500 hover:text-brand-orange rounded-lg transition-colors"
                          >
                            <Edit size={16} />
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
      </div>

      {/* Message Viewer Modal Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-5 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Contact Inquiry Details</h3>
                <p className="text-[10px] text-slate-400">ID: {selectedMessage.id}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow">
              
              {/* Metadata row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-xl border border-slate-100 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <UserIcon size={14} className="text-brand-orange" />
                    <span className="font-semibold text-slate-800">Sender:</span>
                    <span>{selectedMessage.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail size={14} className="text-brand-orange" />
                    <span className="font-semibold text-slate-800">Email:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-brand-navy font-medium">{selectedMessage.email}</a>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone size={14} className="text-brand-orange" />
                    <span className="font-semibold text-slate-800">Phone:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="hover:underline text-brand-navy font-medium">{selectedMessage.phone}</a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Tag size={14} className="text-brand-orange" />
                    <span className="font-semibold text-slate-800">Target Division:</span>
                    <Badge>{selectedMessage.department}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar size={14} className="text-brand-orange" />
                    <span className="font-semibold text-slate-800">Submitted:</span>
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span className="font-semibold text-slate-800">Current Status:</span>
                    <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-full ${getStatusBadgeColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message content block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  Message
                </h4>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-light">
                  {selectedMessage.message}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Quick Status Adjustments */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mark status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  disabled={selectedMessage.status === 'read'}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400"
                >
                  Read
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={selectedMessage.status === 'replied'}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400"
                >
                  Replied
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteContact(selectedMessage.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 border border-rose-200 hover:bg-rose-500 hover:text-white rounded-lg text-rose-500 text-xs font-semibold transition-all"
                >
                  <Trash2 size={13} />
                  <span>Delete Inquiry</span>
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-5 py-2 bg-[#050c1e] text-white hover:bg-brand-navy rounded-lg text-xs font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-5 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Edit Service Details</h3>
                <p className="text-[10px] text-slate-400">ID: {selectedService.id}</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="flex flex-col flex-grow overflow-hidden">
              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-5 overflow-y-auto flex-grow">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Badge */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Badge Label</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Service Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                  />
                </div>

                {/* Learn More URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Action Link (Learn More)</label>
                  <input
                    type="text"
                    required
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                  />
                </div>


                {/* Layout Checkbox */}
                <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="imageLeft"
                    checked={editImageLeft}
                    onChange={(e) => setEditImageLeft(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-orange focus:ring-brand-orange/40 border-slate-300"
                  />
                  <label htmlFor="imageLeft" className="text-xs font-medium text-slate-600 select-none cursor-pointer">
                    Layout: Display Image on Left (Reverses default Right-side alignment on desktop)
                  </label>
                </div>

                {/* Image upload & preview */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Service Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Input file & URL text */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Upload Local Image file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy/10 file:text-brand-navy hover:file:bg-brand-navy/20 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Or paste Image URL / base64 string</span>
                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs transition-all"
                          placeholder="http://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    {/* Right: Live Preview */}
                    <div className="flex flex-col justify-center items-center bg-white border border-slate-200 rounded-lg p-2.5 max-h-[160px] overflow-hidden relative">
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
                            className="max-h-[140px] max-w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setEditImageUrl('')}
                            className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 text-[9px] hover:bg-rose-600 transition-colors"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">No image selected (uses local fallback)</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={updatingService}
                  className="px-5 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {updatingService ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Direct Connection Editor Modal Overlay */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#050c1e] text-white p-5 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Edit Direct Connection Details</h3>
                <p className="text-[10px] text-slate-400">Division ID: {selectedConnection.id}</p>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateConnectionSubmit} className="flex flex-col flex-grow overflow-hidden">
              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-5 overflow-y-auto flex-grow">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Badge */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Badge Label</label>
                    <input
                      type="text"
                      required
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Division Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                      placeholder="+62 811..."
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                      placeholder="info@odst.id"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Office Address</label>
                  <textarea
                    required
                    rows={3}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm transition-all"
                    placeholder="Office address details..."
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedConnection(null)}
                  disabled={updatingService}
                  className="px-5 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingService}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {updatingService ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Custom Toast Notification Pop-up */}
      {notification && (
        <>
          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateY(1.5rem) scale(0.95); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-toast {
              animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white/95 backdrop-blur border border-slate-100/80 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 animate-toast font-sans">
            <div className={`p-2.5 rounded-xl ${
              notification.type === 'success' 
                ? 'bg-emerald-50 text-emerald-500 border border-emerald-100/50' 
                : 'bg-rose-50 text-rose-500 border border-rose-100/50'
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
              <p className="text-xs font-medium text-slate-700 mt-0.5 leading-snug">
                {notification.message}
              </p>
            </div>

            <button 
              onClick={() => setNotification(null)}
              className="text-slate-300 hover:text-slate-500 text-sm font-semibold p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </>
      )}

    </div>
  );
}
