import React, { useState, useEffect } from 'react';
import { Order, Customer, OrderStatus } from '../types';
import { storeService } from '../lib/storeService';
import {
  Package,
  Users,
  LogOut,
  Headphones,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Loader2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface AdminDashboardProps {
  isDemoMode: boolean;
  onLogout: () => void;
  onGoToStorefront: () => void;
}

type TabType = 'orders' | 'customers';

export default function AdminDashboard({ isDemoMode, onLogout, onGoToStorefront }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await storeService.getAdminOrders();
      const fetchedCustomers = await storeService.getAdminCustomers();
      setOrders(fetchedOrders);
      setCustomers(fetchedCustomers);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Update order status handler
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(orderId);
    try {
      await storeService.updateOrderStatus(orderId, newStatus);
      // Update local state directly to prevent a full refetch flash
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating order status. Please try again.');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Compute Metrics
  const totalOrdersCount = orders.length;
  const uniqueCustomersCount = customers.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  // Filter & Search Logic
  const filteredOrders = orders.filter(o => {
    const custName = o.customer?.name || '';
    const custEmail = o.customer?.email || '';
    const matchesSearch =
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter(c => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25';
      case 'paid':
        return 'bg-white/10 text-white border border-white/20';
      case 'shipped':
        return 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-bold';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-white/5 text-[#E0D8D0]/60 border border-white/10';
    }
  };

  return (
    <div id="admin-dashboard-layout" className="min-h-screen bg-[#050505] text-[#E0D8D0] flex flex-col md:flex-row font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#D4AF37] flex items-center justify-center">
              <Headphones className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="font-serif font-bold text-sm tracking-widest text-white uppercase">AeroSound</span>
          </div>
          {/* Mobile Back Shortcut */}
          <button
            onClick={onGoToStorefront}
            className="md:hidden text-[10px] uppercase tracking-widest text-[#E0D8D0]/60 hover:text-[#D4AF37]"
          >
            Store ↗
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); setStatusFilter('all'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/15'
                : 'text-[#E0D8D0]/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            Orders Panel
          </button>

          <button
            onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/15'
                : 'text-[#E0D8D0]/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Customer Logs
          </button>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={onGoToStorefront}
            className="w-full text-[10px] text-center text-[#E0D8D0]/60 hover:text-white py-2.5 px-4 rounded-none bg-white/5 border border-white/10 transition-all block cursor-pointer uppercase tracking-widest font-semibold"
          >
            Open Storefront ↗
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 py-2.5 px-4 rounded-none transition-all border border-transparent hover:border-rose-500/10 cursor-pointer uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        
        {/* Header bar */}
        <header className="p-6 border-b border-white/5 bg-[#111111]/40 backdrop-blur flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-serif text-white tracking-wider uppercase">
                {activeTab === 'orders' ? 'Orders Ledger' : 'Customers Directory'}
              </h1>
              {/* Dynamic Connection Indicator */}
              <span className={`px-2.5 py-0.5 rounded-none text-[9px] uppercase font-bold tracking-[0.15em] flex items-center gap-1 border ${
                isDemoMode
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <span className={`w-1 h-1 rounded-full ${isDemoMode ? 'bg-[#D4AF37]' : 'bg-emerald-400 animate-pulse'}`} />
                {isDemoMode ? 'DEMO ENVIRONMENT' : 'SUPABASE CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-[#E0D8D0]/60 mt-1 uppercase tracking-widest font-light">
              Review transactions, customer registries, and adjust fulfillment parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2.5 bg-white/5 border border-white/10 text-[#E0D8D0]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all cursor-pointer flex items-center justify-center rounded-none"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Core Workspace Wrapper */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          
          {/* KPI Dashboard Metrics - Always present */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#111111] border border-white/5 p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#E0D8D0]/40 font-bold uppercase tracking-[0.2em] block">Total Revenue</span>
                <h3 className="text-2xl font-serif text-[#D4AF37] font-semibold">{formattedRevenue}</h3>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" />
                  +100% COD
                </p>
              </div>
              <div className="w-11 h-11 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#E0D8D0]/40 font-bold uppercase tracking-[0.2em] block">Orders Processed</span>
                <h3 className="text-2xl font-serif text-white font-semibold">{totalOrdersCount}</h3>
                <p className="text-[10px] text-[#E0D8D0]/40 uppercase tracking-widest">Transaction lines</p>
              </div>
              <div className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#E0D8D0]/40 font-bold uppercase tracking-[0.2em] block">Unique Shoppers</span>
                <h3 className="text-2xl font-serif text-white font-semibold">{uniqueCustomersCount}</h3>
                <p className="text-[10px] text-[#E0D8D0]/40 uppercase tracking-widest">Profiles registered</p>
              </div>
              <div className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* Table Operations: Search and Status Select Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111111]/40 border border-white/5 p-4 rounded-none">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#E0D8D0]/40" />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? 'Search reference or customer name...' : 'Search by name, email, or phone...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 pl-11 pr-4 py-2.5 text-xs text-[#E0D8D0] placeholder-white/20 outline-none transition-all"
              />
            </div>

            {/* Status Select Filter for Orders panel */}
            {activeTab === 'orders' && (
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <Filter className="w-4 h-4 text-[#E0D8D0]/40" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-[#050505] border border-white/10 text-xs text-[#E0D8D0]/80 rounded-none px-3.5 py-2.5 outline-none focus:border-[#D4AF37]/40 cursor-pointer"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {/* 3. Core Data Container */}
          <div className="bg-[#111111] border border-white/5 rounded-none overflow-hidden shadow-xl min-h-[400px] flex flex-col">
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                <span className="text-xs uppercase tracking-widest text-[#E0D8D0]/50">Syncing ledger records...</span>
              </div>
            ) : (
              <>
                {/* 3a. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold uppercase text-[#E0D8D0]/50 tracking-[0.2em] bg-[#111111]/90">
                          <th className="py-4.5 px-5 font-bold">Ref ID / Date</th>
                          <th className="py-4.5 px-5 font-bold">Customer Info</th>
                          <th className="py-4.5 px-5 font-bold">Qty / Total</th>
                          <th className="py-4.5 px-5 font-bold">Status (Interactive Dropdown)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs uppercase tracking-wider">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-[#E0D8D0]/40 font-light normal-case">
                              No matching orders found.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                              {/* ID / Date */}
                              <td className="py-5 px-5 font-mono whitespace-nowrap normal-case">
                                <div className="font-bold text-white tracking-wide text-xs">{order.id}</div>
                                <div className="text-[10px] text-[#E0D8D0]/40 mt-1 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#E0D8D0]/30" />
                                  {new Date(order.created_at).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>

                              {/* Customer Contact Card */}
                              <td className="py-5 px-5 normal-case">
                                {order.customer ? (
                                  <div className="space-y-1.5">
                                    <div className="font-bold text-white text-xs leading-none">{order.customer.name}</div>
                                    <div className="text-[11px] text-[#E0D8D0]/60 flex items-center gap-1.5">
                                      <Mail className="w-3.5 h-3.5 text-[#E0D8D0]/40 shrink-0" />
                                      {order.customer.email}
                                    </div>
                                    <div className="text-[11px] text-[#E0D8D0]/60 flex items-center gap-1.5">
                                      <Phone className="w-3.5 h-3.5 text-[#E0D8D0]/40 shrink-0" />
                                      {order.customer.phone}
                                    </div>
                                    <div className="text-[11px] text-[#E0D8D0]/40 flex items-start gap-1.5 max-w-xs mt-1 leading-normal" title={order.customer.address}>
                                      <MapPin className="w-3.5 h-3.5 text-[#E0D8D0]/30 shrink-0 mt-0.5" />
                                      <span className="line-clamp-1 truncate">{order.customer.address}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-[#E0D8D0]/40 italic">No customer profiles linked</span>
                                )}
                              </td>

                              {/* Price and Details */}
                              <td className="py-5 px-5 font-mono normal-case">
                                <div className="text-[#E0D8D0]/60 text-xs">
                                  Qty: <span className="text-white font-bold">{order.quantity}</span>
                                </div>
                                <div className="text-[#D4AF37] font-serif font-bold text-sm mt-1">
                                  {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                  }).format(order.total_amount)}
                                </div>
                                <div className="text-[10px] text-[#E0D8D0]/40 mt-1 uppercase tracking-[0.15em] font-bold">
                                  {order.payment_method}
                                </div>
                              </td>

                              {/* Interactive Status dropdown Column */}
                              <td className="py-5 px-5">
                                <div className="flex items-center gap-2">
                                  {isUpdatingStatus === order.id ? (
                                    <div className="flex items-center gap-2 text-[10px] text-[#E0D8D0]/50 lowercase">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                                      <span>saving changes...</span>
                                    </div>
                                  ) : (
                                    <select
                                      value={order.status}
                                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                      className={`text-[10px] font-bold rounded-none px-3 py-1.5 outline-none cursor-pointer tracking-wider ${getStatusBadgeClass(order.status)}`}
                                    >
                                      <option value="pending" className="bg-[#111111] text-[#D4AF37] font-bold">PENDING</option>
                                      <option value="paid" className="bg-[#111111] text-white font-bold">PAID</option>
                                      <option value="shipped" className="bg-[#111111] text-[#D4AF37] font-bold">SHIPPED</option>
                                      <option value="cancelled" className="bg-[#111111] text-red-400 font-bold">CANCELLED</option>
                                    </select>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3b. CUSTOMERS TAB */}
                {activeTab === 'customers' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold uppercase text-[#E0D8D0]/50 tracking-[0.2em] bg-[#111111]/90">
                          <th className="py-4.5 px-5 font-bold">Name</th>
                          <th className="py-4.5 px-5 font-bold">Contact Details</th>
                          <th className="py-4.5 px-5 font-bold">Shipping Address</th>
                          <th className="py-4.5 px-5 font-bold">Order metrics</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs uppercase tracking-wider">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-[#E0D8D0]/40 font-light normal-case">
                              No customer profiles registered.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map(cust => (
                            <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                              {/* Name */}
                              <td className="py-5 px-5 font-bold text-white">
                                {cust.name}
                              </td>

                              {/* Contact Details */}
                              <td className="py-5 px-5 font-mono text-xs text-[#E0D8D0]/80 normal-case">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-[#E0D8D0]/30 shrink-0" />
                                  <span>{cust.email}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Phone className="w-3.5 h-3.5 text-[#E0D8D0]/30 shrink-0" />
                                  <span>{cust.phone}</span>
                                </div>
                              </td>

                              {/* Shipping Address */}
                              <td className="py-5 px-5 text-xs text-[#E0D8D0]/60 leading-relaxed max-w-xs break-words normal-case">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-[#E0D8D0]/30 shrink-0 mt-0.5" />
                                  <span>{cust.address}</span>
                                </div>
                              </td>

                              {/* Order metrics */}
                              <td className="py-5 px-5 font-mono normal-case">
                                <span className={`inline-flex items-center justify-center text-xs font-bold w-7 h-7 rounded-none ${
                                  (cust.orders_count || 0) > 1
                                    ? 'bg-[#D4AF37] text-black font-black'
                                    : 'bg-white/5 text-white border border-white/10'
                                }`}>
                                  {cust.orders_count || 0}
                                </span>
                                <span className="text-xs text-[#E0D8D0]/40 ml-2">orders placed</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

