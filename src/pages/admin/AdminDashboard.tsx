import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { useOrchardStore, type HarvestOrderItem, type OrchardVisitItem, type PackagingItem } from '../../stores/orchardStore';
import { formatPrice, formatDate, formatDateShort } from '../../lib/utils';
import { compressImage } from '../../lib/imageCompression';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Trees,
  Calendar,
  BookOpen,
  Settings,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Camera,
  Upload,
  RefreshCw,
  Printer,
  Download,
  AlertTriangle,
  RotateCcw,
  Truck,
  Eye,
  Edit,
  Trash2,
  Menu,
  X,
  FileText,
  DollarSign,
  Box,
  ClipboardList,
  Check,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Database as DatabaseIcon,
} from 'lucide-react';
import type { Product, Tree, JournalArticle } from '../../types/database';
import { isRealSupabaseConfigured, syncFromSupabase, seedDatabaseToSupabase } from '../../lib/supabaseService';

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'trees'
  | 'pricing'
  | 'visits'
  | 'enquiries'
  | 'inventory'
  | 'journal'
  | 'activity';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Store connection
  const {
    products,
    updateProduct,
    addProduct,
    toggleProductStock,
    adjustProductStock,
    trees,
    updateTree,
    setTreeStatus,
    updateTreePhoto,
    setTreePrice,
    pricingConfig,
    updateAdoptionPricing,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    updateOrderNotes,
    visits,
    updateVisitStatus,
    cancelVisit,
    restoreVisit,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    packaging,
    adjustPackagingStock,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    inventoryLogs,
    activityLogs,
    logActivity,
  } = useOrchardStore();

  // Search & Filter States
  const [treeSearch, setTreeSearch] = useState('');
  const [treeFilter, setTreeFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [visitSearch, setVisitSearch] = useState('');
  const [visitFilter, setVisitFilter] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');

  // Modal States
  const [selectedTreeForPhoto, setSelectedTreeForPhoto] = useState<Tree | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [compressedFileStats, setCompressedFileStats] = useState<{ origKB: number; compKB: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedTreeForAdopter, setSelectedTreeForAdopter] = useState<Tree | null>(null);

  // Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Order Modals
  const [selectedOrderForView, setSelectedOrderForView] = useState<HarvestOrderItem | null>(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<HarvestOrderItem | null>(null);
  const [dispatchData, setDispatchData] = useState({ courier: 'Blue Dart', trackingNumber: '', dispatchDate: new Date().toISOString().split('T')[0] });
  const [selectedOrderForPackingSlip, setSelectedOrderForPackingSlip] = useState<HarvestOrderItem | null>(null);

  // Visit Reschedule Modal
  const [selectedVisitForReschedule, setSelectedVisitForReschedule] = useState<OrchardVisitItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Inventory Modal
  const [selectedPackagingForAdjust, setSelectedPackagingForAdjust] = useState<PackagingItem | null>(null);
  const [packagingAdjustQty, setPackagingAdjustQty] = useState<number>(0);
  const [packagingAdjustReason, setPackagingAdjustReason] = useState<string>('');

  // Journal Modal
  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

  // File input ref for camera/upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase sync states
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Computed Dashboard Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingPayments = orders.filter((o) => o.payment_status === 'pending').length;
  const newOrdersCount = orders.filter((o) => o.status === 'confirmed').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'preparing').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'dispatched').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'cancelled').length;

  const totalTrees = trees.length;
  const availableTrees = trees.filter((t) => t.status === 'available').length;
  const reservedTrees = trees.filter((t) => t.status === 'reserved').length;
  const adoptedTrees = trees.filter((t) => t.status === 'adopted').length;

  const totalVisits = visits.length;
  const pendingVisits = visits.filter((v) => v.status === 'pending' || v.status === 'under_review').length;
  const confirmedVisits = visits.filter((v) => v.status === 'confirmed').length;

  const publishedArticles = articles.filter((a) => a.status === 'published').length;

  // Filtered Trees
  const filteredTrees = trees.filter((t) => {
    if (treeFilter !== 'all' && t.status !== treeFilter) return false;
    if (treeSearch.trim()) {
      const q = treeSearch.toLowerCase().trim();
      return t.tree_id.toLowerCase().includes(q) || (t.location_description?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  // Filtered Visits
  const filteredVisits = visits.filter((v) => {
    if (visitFilter !== 'all' && v.status !== visitFilter) return false;
    if (visitSearch.trim()) {
      const q = visitSearch.toLowerCase().trim();
      return (
        v.request_number.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.phone.includes(q)
      );
    }
    return true;
  });

  // Filtered Enquiries
  const filteredEnquiries = (enquiries || []).filter((e) => {
    if (enquiryFilter !== 'all' && e.status !== enquiryFilter) return false;
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase().trim();
      return (
        e.reference_number?.toLowerCase().includes(q) ||
        e.name?.toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        e.category?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadEnquiryCount = (enquiries || []).filter((e) => e.status === 'new' || !e.is_read).length;

  // Handle Photo File Selection & Client-Side Compression
  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedTreeForPhoto) return;

    try {
      setIsCompressing(true);
      const origKB = Math.round(file.size / 1024);

      // Client-side WebP compression targeting ~200-300 KB
      const { dataUrl, sizeKB } = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
      });

      setPhotoPreview(dataUrl);
      setCompressedFileStats({ origKB, compKB: sizeKB });
      setIsCompressing(false);
    } catch (err: any) {
      alert(`Image processing failed: ${err.message}`);
      setIsCompressing(false);
    }
  }

  // Save Compressed Photo to Store
  function handleSavePhoto() {
    if (!selectedTreeForPhoto || !photoPreview) return;
    updateTreePhoto(selectedTreeForPhoto.tree_id, photoPreview);
    setSelectedTreeForPhoto(null);
    setPhotoPreview(null);
    setCompressedFileStats(null);
  }

  // Export CSV Functions
  function exportTreesCSV() {
    const headers = ['Tree ID', 'Variety', 'Location', 'Status', 'Adoption Fee (INR)', 'Guarantee (kg)', 'Adopter Name', 'Adopter Phone'];
    const rows = trees.map((t) => [
      t.tree_id,
      t.variety,
      `"${t.location_description}"`,
      t.status,
      (t.adoption_fee || pricingConfig.price) / 100,
      t.min_guarantee_kg,
      t.adopter_info ? `"${t.adopter_info.name}"` : 'None',
      t.adopter_info ? `"${t.adopter_info.phone}"` : 'None',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob(csvContent, `kesari_van_tree_registry_${Date.now()}.csv`, 'text/csv');
  }

  function exportOrdersCSV() {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Type of Collection', 'Quantity', 'Total (INR)', 'Status', 'Payment', 'Courier', 'Tracking', 'Customer Notes'];
    const rows = orders.map((o) => [
      o.order_number,
      o.order_date.split('T')[0],
      `"${o.customer_name}"`,
      `"${o.phone}"`,
      `"${o.items_summary || o.collection_type || 'Gir Kesar'}"`,
      o.quantity || o.items_count || 1,
      o.total_amount / 100,
      o.status,
      o.payment_status,
      o.courier_name || 'N/A',
      o.tracking_number || 'N/A',
      `"${o.notes || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob(csvContent, `kesari_van_orders_${Date.now()}.csv`, 'text/csv');
  }

  function exportInventoryCSV() {
    const headers = ['Item Name', 'SKU', 'Category', 'Stock Qty', 'Min Threshold', 'Unit'];
    const rows = packaging.map((p) => [
      `"${p.name}"`,
      p.sku,
      p.category,
      p.current_stock,
      p.min_threshold,
      p.unit,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob(csvContent, `kesari_van_packaging_inventory_${Date.now()}.csv`, 'text/csv');
  }

  function downloadBlob(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <SEO
        title="Kesari Van Admin Portal — Operations & Commerce Management"
        description="Central operational and administrative management portal for Kesari Van mango orchard."
        noIndex
      />

      {/* Print-only Packing Slip View */}
      {selectedOrderForPackingSlip && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 font-body text-charcoal z-[9999]">
          <div className="border-b-2 border-charcoal pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="font-display text-3xl font-bold text-deep-forest">KESARI VAN</h1>
              <p className="text-xs text-charcoal/70">Authentic Gir Kesar Mango Orchard</p>
              <p className="text-xs text-charcoal/70">Umbhel, Kamrej, Surat, Gujarat — 394150</p>
              <p className="text-xs text-charcoal/70">WhatsApp / Phone: +91 94091 16104</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold uppercase tracking-wider block">PACKING SLIP & DISPATCH NOTE</span>
              <p className="text-sm font-semibold mt-1">Order #{selectedOrderForPackingSlip.order_number}</p>
              <p className="text-xs text-charcoal/60">Date: {formatDate(selectedOrderForPackingSlip.order_date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6 p-4 bg-charcoal/5 rounded border border-charcoal/20 text-xs">
            <div>
              <p className="font-bold text-charcoal mb-1 uppercase tracking-wide">Ship To (Customer):</p>
              <p className="font-semibold text-sm">{selectedOrderForPackingSlip.customer_name}</p>
              <p>{selectedOrderForPackingSlip.delivery_address.line1}</p>
              <p>{selectedOrderForPackingSlip.delivery_address.city}, {selectedOrderForPackingSlip.delivery_address.state} — {selectedOrderForPackingSlip.delivery_address.pincode}</p>
              <p className="mt-1 font-semibold">Contact: {selectedOrderForPackingSlip.phone}</p>
              {selectedOrderForPackingSlip.email && <p>Email: {selectedOrderForPackingSlip.email}</p>}
            </div>
            <div>
              <p className="font-bold text-charcoal mb-1 uppercase tracking-wide">Dispatch Coordinates:</p>
              <p><strong>Courier:</strong> {selectedOrderForPackingSlip.courier_name || 'Express Courier Partner'}</p>
              <p><strong>Tracking No:</strong> {selectedOrderForPackingSlip.tracking_number || 'Awaiting dispatch scan'}</p>
              <p><strong>Payment Status:</strong> {selectedOrderForPackingSlip.payment_status.toUpperCase()}</p>
              {selectedOrderForPackingSlip.notes && (
                <p className="mt-2 text-xs italic bg-white p-2 border border-charcoal/10 rounded">
                  <strong>Notes:</strong> {selectedOrderForPackingSlip.notes}
                </p>
              )}
            </div>
          </div>

          <table className="w-full text-left text-xs mb-8 border border-charcoal/20">
            <thead className="bg-charcoal/10 border-b border-charcoal/20">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Quantity</th>
                <th className="py-2.5 px-3 text-right">Handling Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              <tr>
                <td className="py-3 px-3 font-semibold">{selectedOrderForPackingSlip.items_summary}</td>
                <td className="py-3 px-3 text-center">{selectedOrderForPackingSlip.items_count} Box(es)</td>
                <td className="py-3 px-3 text-right text-xs">Perishable Fruit · Handle with Extreme Care</td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-charcoal/20 pt-4 text-xs space-y-2">
            <p className="font-semibold text-deep-forest">Farm Unpacking Instructions for Customer:</p>
            <p>1. Open outer box immediately upon arrival in a well-ventilated room.</p>
            <p>2. Keep mangoes nestled in grass/wood-wool until they turn golden saffron and release sweet fragrance.</p>
            <p>3. Do NOT refrigerate unripe mangoes. Chill only 30 minutes before cutting once fully ripe.</p>
          </div>

          <div className="mt-8 text-center border-t border-charcoal/15 pt-4 text-[11px] text-charcoal/50">
            Thank you for choosing mangoes grown with honesty at Kesari Van Orchard.
          </div>
        </div>
      )}

      {/* Main Admin UI */}
      <div className="min-h-screen bg-mango-cream flex flex-col md:flex-row print:hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-deep-forest text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">Kesari Van Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-deep-forest text-white p-6 space-y-6 flex-shrink-0 transition-transform duration-200 md:relative md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="font-display text-2xl font-bold tracking-tight text-white block">
                Kesari Van
              </Link>
              <span className="font-body text-[10px] text-dawn-gold tracking-widest uppercase block font-semibold">
                Central Orchard Ops
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-body text-xs" aria-label="Admin Navigation">
            <button
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'overview' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
            </button>

            <button
              onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'products' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" /> Products & Mango Boxes
            </button>

            <button
              onClick={() => { setActiveTab('trees'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'trees' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <Trees className="w-4 h-4" /> 100-Tree Registry ({availableTrees})
            </button>

            <button
              onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'pricing' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Adoption Pricing & Terms
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'orders' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" /> Harvest Orders
              </span>
              {newOrdersCount > 0 && (
                <span className="bg-amber-500 text-deep-forest font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                  {newOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('visits'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'visits' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-4 h-4" /> Orchard Visits
              </span>
              {pendingVisits > 0 && (
                <span className="bg-amber-500 text-deep-forest font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                  {pendingVisits}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('enquiries'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'enquiries' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Enquiries
              </span>
              {unreadEnquiryCount > 0 && (
                <span className="bg-amber-500 text-deep-forest font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                  {unreadEnquiryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'inventory' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <Box className="w-4 h-4" /> Packaging & Crates
            </button>

            <button
              onClick={() => { setActiveTab('journal'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'journal' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Journal CMS ({publishedArticles})
            </button>

            <button
              onClick={() => { setActiveTab('activity'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-soft transition-colors ${
                activeTab === 'activity' ? 'bg-orchard-green text-white font-semibold' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Activity Audit Log
            </button>
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-body text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto max-w-7xl">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Orchard Operations Overview</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Live operational metrics for {pricingConfig.season} derived from database state.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="green">{pricingConfig.season} Active</Badge>
                  <span className="text-xs font-body text-charcoal/50">Surat Grove, Gujarat</span>
                </div>
              </div>

              {/* Real-time Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10">
                  <span className="font-body text-[11px] text-charcoal/50 uppercase tracking-wider font-semibold block">Total Revenue</span>
                  <p className="font-display text-2xl sm:text-3xl text-orchard-green font-bold mt-1">
                    {formatPrice(totalRevenue)}
                  </p>
                  <span className="text-[11px] text-charcoal/50 mt-1 block font-body">
                    From {orders.length} orders & adoptions
                  </span>
                </div>

                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10">
                  <span className="font-body text-[11px] text-charcoal/50 uppercase tracking-wider font-semibold block">Harvest Orders</span>
                  <p className="font-display text-2xl sm:text-3xl text-charcoal font-bold mt-1">
                    {orders.length}
                  </p>
                  <span className="text-[11px] text-amber-700 mt-1 block font-body font-medium">
                    {newOrdersCount} new · {preparingOrdersCount} preparing
                  </span>
                </div>

                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10">
                  <span className="font-body text-[11px] text-charcoal/50 uppercase tracking-wider font-semibold block">Tree Adoptions</span>
                  <p className="font-display text-2xl sm:text-3xl text-charcoal font-bold mt-1">
                    {adoptedTrees} / 100
                  </p>
                  <span className="text-[11px] text-orchard-green mt-1 block font-body font-semibold">
                    {availableTrees} trees available to adopt
                  </span>
                </div>

                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10">
                  <span className="font-body text-[11px] text-charcoal/50 uppercase tracking-wider font-semibold block">Orchard Visits</span>
                  <p className="font-display text-2xl sm:text-3xl text-charcoal font-bold mt-1">
                    {totalVisits}
                  </p>
                  <span className="text-[11px] text-amber-700 mt-1 block font-body font-medium">
                    {pendingVisits} pending · {confirmedVisits} confirmed
                  </span>
                </div>
              </div>

              {/* Supabase Cloud Connection & Sync Card */}
              <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-body text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DatabaseIcon className="w-4 h-4 text-orchard-green" />
                    <span className="font-display text-base font-bold text-charcoal">Supabase Cloud Database</span>
                    <Badge variant={isRealSupabaseConfigured() ? 'green' : 'gold'} size="sm">
                      {isRealSupabaseConfigured() ? 'Cloud Connected' : 'Local Offline / Demo Mode'}
                    </Badge>
                  </div>
                  <p className="text-charcoal/60">
                    {isRealSupabaseConfigured()
                      ? `Connected to ${import.meta.env.VITE_SUPABASE_URL}. Real-time synchronization active.`
                      : 'Running on local persistent storage. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect your live database.'}
                  </p>
                  {supabaseSyncStatus && (
                    <p className="text-emerald-700 font-semibold pt-1">{supabaseSyncStatus}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={async () => {
                      setIsSyncing(true);
                      const res = await syncFromSupabase();
                      setSupabaseSyncStatus(res.message);
                      setIsSyncing(false);
                    }}
                    variant="outline"
                    size="sm"
                    isLoading={isSyncing}
                    disabled={!isRealSupabaseConfigured()}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync from Cloud
                  </Button>
                  <Button
                    onClick={async () => {
                      setIsSyncing(true);
                      const res = await seedDatabaseToSupabase();
                      setSupabaseSyncStatus(res.message);
                      setIsSyncing(false);
                    }}
                    variant="primary"
                    size="sm"
                    isLoading={isSyncing}
                    disabled={!isRealSupabaseConfigured()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Seed Cloud Database
                  </Button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10 space-y-3">
                <h3 className="font-display text-lg text-charcoal font-semibold">Quick Actions</h3>
                <div className="flex flex-wrap gap-2.5">
                  <Button onClick={() => setIsAddProductOpen(true)} variant="outline" size="sm">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
                  </Button>
                  <Button onClick={() => setActiveTab('trees')} variant="outline" size="sm">
                    <Trees className="w-3.5 h-3.5 mr-1" /> Manage 100-Tree Registry
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTreeForPhoto(trees[0]);
                      setPhotoPreview(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1" /> Upload Tree Photo
                  </Button>
                  <Button onClick={() => setActiveTab('orders')} variant="outline" size="sm">
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" /> View Harvest Orders
                  </Button>
                  <Button onClick={() => setActiveTab('visits')} variant="outline" size="sm">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Manage Orchard Visits
                  </Button>
                  <Button onClick={() => setActiveTab('inventory')} variant="outline" size="sm">
                    <Box className="w-3.5 h-3.5 mr-1" /> Update Packaging Stock
                  </Button>
                  <Button onClick={() => setIsAddArticleOpen(true)} variant="outline" size="sm">
                    <BookOpen className="w-3.5 h-3.5 mr-1" /> Create Journal Post
                  </Button>
                  <Button onClick={() => setActiveTab('pricing')} variant="outline" size="sm">
                    <DollarSign className="w-3.5 h-3.5 mr-1" /> Tree Pricing Settings
                  </Button>
                </div>
              </div>

              {/* Two Column Grid: Recent Orders & Recent Visit Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
                    <h3 className="font-display text-xl text-charcoal">Recent Harvest Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-orchard-green font-semibold hover:underline"
                    >
                      View all ({orders.length}) →
                    </button>
                  </div>
                  <div className="divide-y divide-charcoal/5">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="py-2.5 flex items-center justify-between text-xs font-body">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-charcoal">{order.order_number}</span>
                            <Badge
                              variant={
                                order.status === 'confirmed'
                                  ? 'gold'
                                  : order.status === 'dispatched'
                                  ? 'sage'
                                  : order.status === 'delivered'
                                  ? 'green'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-charcoal/60 truncate max-w-xs">{order.customer_name} · {order.items_summary}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orchard-green">{formatPrice(order.total_amount)}</p>
                          <span className="text-[10px] text-charcoal/40">{formatDateShort(order.order_date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Visits */}
                <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
                    <h3 className="font-display text-xl text-charcoal">Pending Orchard Visits</h3>
                    <button
                      onClick={() => setActiveTab('visits')}
                      className="text-xs text-orchard-green font-semibold hover:underline"
                    >
                      View all ({visits.length}) →
                    </button>
                  </div>
                  <div className="divide-y divide-charcoal/5">
                    {visits.slice(0, 4).map((visit) => (
                      <div key={visit.id} className="py-2.5 flex items-center justify-between text-xs font-body">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-charcoal">{visit.name}</span>
                            <Badge
                              variant={
                                visit.status === 'confirmed'
                                  ? 'green'
                                  : visit.status === 'pending'
                                  ? 'gold'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {visit.status}
                            </Badge>
                          </div>
                          <p className="text-charcoal/60">{visit.number_of_visitors} guests · Preferred: {visit.preferred_date}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {visit.status === 'pending' && (
                            <button
                              onClick={() => updateVisitStatus(visit.id, 'confirmed')}
                              className="px-2 py-1 bg-orchard-green text-white rounded text-[11px] font-semibold hover:bg-deep-forest"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => setActiveTab('visits')}
                            className="p-1 text-charcoal/50 hover:text-charcoal"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCTS & MANGO BOXES */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Product Management</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Manage the 3 harvest collections and any custom offerings. Prices, stock, and descriptions update the live shop immediately.
                  </p>
                </div>
                <Button onClick={() => setIsAddProductOpen(true)} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add New Box Product
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 bg-soft-sage/30 flex items-center justify-center text-5xl relative">
                        🥭
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <Badge variant={p.is_available ? 'green' : 'neutral'} size="sm">
                            {p.is_available ? 'In Stock' : 'Sold Out'}
                          </Badge>
                          {p.is_featured && <Badge variant="gold" size="sm">Featured</Badge>}
                        </div>
                      </div>

                      <div className="p-5 space-y-3 font-body text-xs">
                        <div>
                          <h4 className="font-display text-xl text-charcoal font-bold">{p.name}</h4>
                          <p className="text-charcoal/60 line-clamp-2 mt-1">{p.description}</p>
                        </div>

                        <div className="space-y-1.5 border-t border-charcoal/10 pt-3 text-charcoal/70">
                          <div className="flex justify-between">
                            <span>Box Weight</span>
                            <span className="font-semibold text-charcoal">
                              {p.box_weight_kg ? `${p.box_weight_kg} kg` : (p.weight_kg ? `${p.weight_kg} kg` : (p.piece_count ? `${p.piece_count} mangoes` : (p.mango_count ? `${p.mango_count} mangoes` : '10 kg')))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minimum Fruit Spec</span>
                            <span className="font-semibold text-charcoal">{p.min_mango_weight_g || p.min_weight_g || 200}g+</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stock Remaining</span>
                            <span className="font-bold text-charcoal">{p.stock_quantity} boxes</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-1">
                            <span>Price</span>
                            <span className="font-bold text-base text-orchard-green">{formatPrice(p.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-charcoal/5 border-t border-charcoal/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold font-body transition-colors ${
                          p.is_available
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {p.is_available ? 'Mark Sold Out' : 'Mark In Stock'}
                      </button>

                      <Button
                        onClick={() => setEditingProduct(p)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit Product
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 100-TREE ADOPTION REGISTRY */}
          {/* ========================================================================= */}
          {activeTab === 'trees' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">100-Tree Adoption Registry</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Central operational control for all 100 trees opened for {pricingConfig.season}. Upload mobile camera photos, assign statuses, and inspect adopter info.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={exportTreesCSV} variant="outline" size="sm">
                    <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
                  </Button>
                  <Button onClick={() => window.print()} variant="outline" size="sm">
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print Registry
                  </Button>
                </div>
              </div>

              {/* Status Counters Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-soft border border-charcoal/10 text-center">
                  <span className="text-[10px] text-charcoal/50 uppercase font-semibold block">Total Registry</span>
                  <span className="font-display text-2xl font-bold text-charcoal">{totalTrees} Trees</span>
                </div>
                <div className="bg-white p-3 rounded-soft border border-charcoal/10 text-center">
                  <span className="text-[10px] text-charcoal/50 uppercase font-semibold block">Available</span>
                  <span className="font-display text-2xl font-bold text-orchard-green">{availableTrees}</span>
                </div>
                <div className="bg-white p-3 rounded-soft border border-charcoal/10 text-center">
                  <span className="text-[10px] text-charcoal/50 uppercase font-semibold block">Adopted</span>
                  <span className="font-display text-2xl font-bold text-charcoal">{adoptedTrees}</span>
                </div>
                <div className="bg-white p-3 rounded-soft border border-charcoal/10 text-center">
                  <span className="text-[10px] text-charcoal/50 uppercase font-semibold block">Reserved</span>
                  <span className="font-display text-2xl font-bold text-dawn-gold">{reservedTrees}</span>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white p-4 rounded-softer shadow-card border border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Tree ID (e.g. KV-018)..."
                    value={treeSearch}
                    onChange={(e) => setTreeSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-body rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['all', 'available', 'reserved', 'adopted', 'maintenance'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setTreeFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                        treeFilter === st
                          ? 'bg-orchard-green text-white font-semibold'
                          : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 100-Trees Table */}
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Tree ID</th>
                        <th className="py-3 px-4">Photo</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Fee</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Adopter Details</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {filteredTrees.map((tree) => (
                        <tr key={tree.id} className="hover:bg-mango-cream/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-charcoal">{tree.tree_id}</td>
                          <td className="py-3 px-4">
                            <div className="w-10 h-10 rounded-soft bg-soft-sage/30 flex items-center justify-center overflow-hidden border border-charcoal/10">
                              {tree.photo_url ? (
                                <img
                                  src={tree.photo_url}
                                  alt={tree.tree_id}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg">🌳</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-charcoal/70">{tree.location_description}</td>
                          <td className="py-3 px-4 font-semibold text-orchard-green">
                            {formatPrice(tree.adoption_fee || pricingConfig.price)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                tree.status === 'available'
                                  ? 'green'
                                  : tree.status === 'reserved'
                                  ? 'gold'
                                  : tree.status === 'adopted'
                                  ? 'neutral'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {tree.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {tree.adopter_info ? (
                              <button
                                onClick={() => setSelectedTreeForAdopter(tree)}
                                className="text-xs text-orchard-green font-semibold hover:underline flex items-center gap-1"
                              >
                                <User className="w-3.5 h-3.5" /> {tree.adopter_info.name}
                              </button>
                            ) : (
                              <span className="text-charcoal/40 italic">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Upload/Change Photo Button */}
                              <button
                                onClick={() => {
                                  setSelectedTreeForPhoto(tree);
                                  setPhotoPreview(tree.photo_url || null);
                                  setCompressedFileStats(null);
                                }}
                                className="p-1.5 text-charcoal/60 hover:text-orchard-green hover:bg-soft-sage/30 rounded"
                                title="Upload or Take Photo"
                              >
                                <Camera className="w-4 h-4" />
                              </button>

                              {/* Quick Status Cycle / Select */}
                              <select
                                value={tree.status}
                                onChange={(e) => setTreeStatus(tree.tree_id, e.target.value as any)}
                                className="text-[11px] py-1 px-1.5 rounded border border-charcoal/20 bg-white focus:outline-none"
                              >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="adopted">Adopted</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: TREE ADOPTION PRICING & SEASON SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <div>
                <h2 className="font-display text-3xl text-charcoal">Adoption Pricing & Season Settings</h2>
                <p className="font-body text-xs text-charcoal/60">
                  Configure the primary seasonal tree adoption package. These terms and figures power the public adoption pages directly.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6 font-body text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal block">Package Name</label>
                  <input
                    type="text"
                    value={pricingConfig.name}
                    onChange={(e) => updateAdoptionPricing({ name: e.target.value })}
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal block">Season Label</label>
                    <input
                      type="text"
                      value={pricingConfig.season}
                      onChange={(e) => updateAdoptionPricing({ season: e.target.value })}
                      className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal block">Adoption Fee (in Rupees)</label>
                    <input
                      type="number"
                      value={pricingConfig.price / 100}
                      onChange={(e) => updateAdoptionPricing({ price: parseInt(e.target.value, 10) * 100 })}
                      className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal block">Minimum Guaranteed Harvest (kg)</label>
                    <input
                      type="number"
                      value={pricingConfig.min_guarantee_kg}
                      onChange={(e) => updateAdoptionPricing({ min_guarantee_kg: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal block">Excess Yield Policy</label>
                    <input
                      type="text"
                      value={pricingConfig.excess_yield_policy}
                      onChange={(e) => updateAdoptionPricing({ excess_yield_policy: e.target.value })}
                      className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal block">Shipping & Harvest Logistics Policy Text</label>
                  <textarea
                    rows={2}
                    value={pricingConfig.shipping_policy_text}
                    onChange={(e) => updateAdoptionPricing({ shipping_policy_text: e.target.value })}
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal block">Description / Customer Promise</label>
                  <textarea
                    rows={3}
                    value={pricingConfig.description}
                    onChange={(e) => updateAdoptionPricing({ description: e.target.value })}
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 text-xs focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Changes persist and update the live website immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: HARVEST ORDERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Harvest Orders Management</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Track box orders and adoptions, record tracking numbers, dispatch orders, and print packing slips.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={exportOrdersCSV} variant="outline" size="sm">
                    <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
                  </Button>
                  <Button onClick={() => window.print()} variant="outline" size="sm">
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print Orders List
                  </Button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-softer shadow-card border border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Order #, customer, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-body rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['all', 'confirmed', 'preparing', 'dispatched', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                        orderFilter === st
                          ? 'bg-orchard-green text-white font-semibold'
                          : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Type of Collection</th>
                        <th className="py-3 px-4">Quantity</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-mango-cream/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-charcoal">{order.order_number}</td>
                          <td className="py-3 px-4 text-charcoal/60">{formatDateShort(order.order_date)}</td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-charcoal">{order.customer_name}</p>
                            <p className="text-[11px] text-charcoal/50">{order.phone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-charcoal block">{order.items_summary || order.collection_type || 'Gir Kesar Mangoes'}</span>
                            {order.notes && order.notes !== order.items_summary && (
                              <span className="text-[11px] text-charcoal/50 italic block mt-0.5 max-w-[200px] truncate" title={order.notes}>
                                Note: {order.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-charcoal">
                            {order.quantity || order.items_count || 1} box{(order.quantity || order.items_count || 1) > 1 ? 'es' : ''}
                          </td>
                          <td className="py-3 px-4 font-bold text-orchard-green">{formatPrice(order.total_amount)}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                order.status === 'confirmed'
                                  ? 'gold'
                                  : order.status === 'preparing'
                                  ? 'gold'
                                  : order.status === 'dispatched'
                                  ? 'sage'
                                  : order.status === 'delivered'
                                  ? 'green'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {order.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedOrderForView(order)}
                                className="p-1.5 text-charcoal/60 hover:text-orchard-green hover:bg-soft-sage/30 rounded"
                                title="View Order Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Print Packing Slip */}
                              <button
                                onClick={() => {
                                  setSelectedOrderForPackingSlip(order);
                                  setTimeout(() => window.print(), 200);
                                }}
                                className="p-1.5 text-charcoal/60 hover:text-orchard-green hover:bg-soft-sage/30 rounded"
                                title="Print Packing Slip"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              {/* Dispatch / Update Status */}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="px-2 py-1 bg-amber-500 text-white rounded text-[11px] font-semibold hover:bg-amber-600"
                                >
                                  Prepare
                                </button>
                              )}
                              {order.status === 'preparing' && (
                                <button
                                  onClick={() => {
                                    setSelectedOrderForDispatch(order);
                                    setDispatchData({
                                      courier: 'Blue Dart Express',
                                      trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
                                      dispatchDate: new Date().toISOString().split('T')[0],
                                    });
                                  }}
                                  className="px-2 py-1 bg-orchard-green text-white rounded text-[11px] font-semibold hover:bg-deep-forest flex items-center gap-1"
                                >
                                  <Truck className="w-3 h-3" /> Dispatch
                                </button>
                              )}
                              {order.status === 'dispatched' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700"
                                >
                                  Delivered
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: ORCHARD VISIT REQUESTS */}
          {/* ========================================================================= */}
          {activeTab === 'visits' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Orchard Visit Requests</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Manage guest visit requests. Confirm dates, decline with notice, or restore previously cancelled requests.
                  </p>
                </div>
                <Button onClick={() => window.print()} variant="outline" size="sm">
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print Visits List
                </Button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-softer shadow-card border border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search request #, visitor, phone..."
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-body rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['all', 'pending', 'confirmed', 'declined', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setVisitFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                        visitFilter === st
                          ? 'bg-orchard-green text-white font-semibold'
                          : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visits Table */}
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Request Ref</th>
                        <th className="py-3 px-4">Visitor</th>
                        <th className="py-3 px-4">Visitors</th>
                        <th className="py-3 px-4">Preferred Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Notes</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {filteredVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-mango-cream/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-charcoal">{visit.request_number}</td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-charcoal">{visit.name}</p>
                            <p className="text-[11px] text-charcoal/50">{visit.phone}</p>
                          </td>
                          <td className="py-3 px-4 font-semibold">{visit.number_of_visitors} Guests</td>
                          <td className="py-3 px-4 text-charcoal/70">{visit.preferred_date}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                visit.status === 'confirmed'
                                  ? 'green'
                                  : visit.status === 'pending'
                                  ? 'gold'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {visit.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-charcoal/60 truncate max-w-xs">
                            {visit.message || 'No additional note'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Confirm Action */}
                              {visit.status === 'pending' && (
                                <button
                                  onClick={() => updateVisitStatus(visit.id, 'confirmed')}
                                  className="px-2 py-1 bg-orchard-green text-white rounded text-[11px] font-semibold hover:bg-deep-forest"
                                >
                                  Confirm
                                </button>
                              )}

                              {/* Reschedule Modal Trigger */}
                              <button
                                onClick={() => {
                                  setSelectedVisitForReschedule(visit);
                                  setRescheduleDate(visit.preferred_date);
                                }}
                                className="px-2 py-1 bg-charcoal/5 text-charcoal rounded text-[11px] font-semibold hover:bg-charcoal/10"
                              >
                                Reschedule
                              </button>

                              {/* Cancel / Decline Action */}
                              {visit.status !== 'cancelled' && visit.status !== 'declined' ? (
                                <button
                                  onClick={() => cancelVisit(visit.id, 'Declined by admin')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Decline / Cancel Visit"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              ) : (
                                /* CANCELLATION UNDO / RESTORE ACTION */
                                <button
                                  onClick={() => restoreVisit(visit.id)}
                                  className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-[11px] font-bold hover:bg-amber-200 flex items-center gap-1"
                                  title="Restore / Undo Cancellation"
                                >
                                  <RotateCcw className="w-3 h-3" /> Restore
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CUSTOMER CONTACT ENQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Customer Enquiries & Messages</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Review incoming queries submitted via the contact form. Direct communication available via WhatsApp and email.
                  </p>
                </div>
                <Button onClick={() => window.print()} variant="outline" size="sm">
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print Enquiries
                </Button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-softer shadow-card border border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search ref #, name, phone, email, message..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-body rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['all', 'new', 'in_progress', 'responded', 'archived'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setEnquiryFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                        enquiryFilter === st
                          ? 'bg-orchard-green text-white font-semibold'
                          : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Ref #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Topic / Category</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Received</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {filteredEnquiries.length > 0 ? (
                        filteredEnquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-mango-cream/20 transition-colors">
                            <td className="py-3 px-4 font-bold text-charcoal whitespace-nowrap">
                              {enq.reference_number}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-charcoal">{enq.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-charcoal/60 mt-0.5">
                                <a
                                  href={`tel:${enq.phone}`}
                                  className="hover:text-orchard-green flex items-center gap-0.5"
                                >
                                  <Phone className="w-3 h-3" /> {enq.phone}
                                </a>
                                {enq.email && (
                                  <a
                                    href={`mailto:${enq.email}`}
                                    className="hover:text-orchard-green flex items-center gap-0.5"
                                    title={enq.email}
                                  >
                                    <Mail className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="neutral" size="sm">
                                {enq.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <p className="text-charcoal/80 leading-relaxed line-clamp-3">
                                {enq.message}
                              </p>
                              {enq.admin_notes && (
                                <p className="text-[10px] text-orchard-green italic mt-1">
                                  Note: {enq.admin_notes}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-charcoal/60 whitespace-nowrap">
                              {enq.created_at ? enq.created_at.split('T')[0] : 'Just now'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge
                                variant={
                                  enq.status === 'responded'
                                    ? 'green'
                                    : enq.status === 'new'
                                    ? 'gold'
                                    : 'neutral'
                                }
                                size="sm"
                              >
                                {enq.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* WhatsApp Direct Contact */}
                                <a
                                  href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                    `Hello ${enq.name}, greetings from Kesari Van regarding your enquiry (${enq.reference_number}).`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 inline-flex items-center gap-1"
                                  title="Chat on WhatsApp"
                                >
                                  WhatsApp
                                </a>

                                {/* Status Transitions */}
                                {enq.status !== 'responded' && (
                                  <button
                                    onClick={() => updateEnquiryStatus(enq.id, 'responded')}
                                    className="px-2 py-1 bg-orchard-green text-white rounded text-[11px] font-semibold hover:bg-deep-forest"
                                    title="Mark as Responded"
                                  >
                                    Responded
                                  </button>
                                )}
                                {enq.status !== 'archived' ? (
                                  <button
                                    onClick={() => updateEnquiryStatus(enq.id, 'archived')}
                                    className="px-2 py-1 bg-charcoal/10 text-charcoal/70 rounded text-[11px] hover:bg-charcoal/20"
                                    title="Archive Enquiry"
                                  >
                                    Archive
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateEnquiryStatus(enq.id, 'new')}
                                    className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-[11px] font-semibold hover:bg-amber-200"
                                    title="Mark as New"
                                  >
                                    Reopen
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete enquiry ${enq.reference_number}?`)) {
                                      deleteEnquiry(enq.id);
                                    }
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete Enquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-charcoal/50">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-charcoal/30" />
                            <p className="font-semibold text-charcoal/70">No enquiries found</p>
                            <p className="text-[11px] text-charcoal/40">
                              {enquirySearch || enquiryFilter !== 'all'
                                ? 'Try adjusting your search query or filter.'
                                : 'Incoming customer enquiries from the website will appear here in real-time.'}
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: PACKAGING & CRATE INVENTORY */}
          {/* ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Packaging & Materials Inventory</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Track crates, boxes, fruit bags, wood wool, and labels. Every adjustment requires a documented reason for audit compliance.
                  </p>
                </div>
                <Button onClick={exportInventoryCSV} variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
                </Button>
              </div>

              {/* Packaging Items Table */}
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Material / SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Current Stock</th>
                        <th className="py-3 px-4">Minimum Threshold</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {packaging.map((item) => {
                        const isLow = item.current_stock <= item.min_threshold;
                        return (
                          <tr key={item.id} className="hover:bg-mango-cream/20 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-charcoal">{item.name}</p>
                              <span className="text-[10px] text-charcoal/40 uppercase">{item.sku}</span>
                            </td>
                            <td className="py-3 px-4 capitalize text-charcoal/70">{item.category}</td>
                            <td className="py-3 px-4 font-bold text-base text-charcoal">
                              {item.current_stock} <span className="text-xs font-normal text-charcoal/50">{item.unit}</span>
                            </td>
                            <td className="py-3 px-4 text-charcoal/60">{item.min_threshold} {item.unit}</td>
                            <td className="py-3 px-4">
                              <Badge variant={isLow ? 'gold' : 'green'} size="sm">
                                {isLow ? 'Low Stock' : 'Adequate'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                onClick={() => {
                                  setSelectedPackagingForAdjust(item);
                                  setPackagingAdjustQty(item.current_stock);
                                  setPackagingAdjustReason('');
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Adjust Stock
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inventory Audit Logs */}
              <div className="bg-white p-5 rounded-softer shadow-card border border-charcoal/10 space-y-4">
                <h3 className="font-display text-xl text-charcoal">Packaging Adjustment Audit Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Item Name</th>
                        <th className="py-2.5 px-3">Prev Qty</th>
                        <th className="py-2.5 px-3">Adjustment</th>
                        <th className="py-2.5 px-3">New Qty</th>
                        <th className="py-2.5 px-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {inventoryLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="py-2 px-3 text-charcoal/50">{formatDateShort(log.created_at)}</td>
                          <td className="py-2 px-3 font-semibold text-charcoal">{log.item_name}</td>
                          <td className="py-2 px-3">{log.previous_quantity}</td>
                          <td className={`py-2 px-3 font-bold ${log.adjustment >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {log.adjustment >= 0 ? `+${log.adjustment}` : log.adjustment}
                          </td>
                          <td className="py-2 px-3 font-bold text-charcoal">{log.new_quantity}</td>
                          <td className="py-2 px-3 text-charcoal/70 italic">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: JOURNAL CMS */}
          {/* ========================================================================= */}
          {activeTab === 'journal' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-charcoal">Journal CMS</h2>
                  <p className="font-body text-xs text-charcoal/60">
                    Publish authentic notes from the orchard. Articles immediately appear on the public Journal page.
                  </p>
                </div>
                <Button onClick={() => setIsAddArticleOpen(true)} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> New Journal Post
                </Button>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-32 bg-soft-sage/30 flex items-center justify-center text-4xl relative">
                        🌱
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Badge variant={art.status === 'published' ? 'green' : 'neutral'} size="sm">
                            {art.status}
                          </Badge>
                          {art.is_featured && <Badge variant="gold" size="sm">Featured</Badge>}
                        </div>
                      </div>

                      <div className="p-5 space-y-2 font-body text-xs">
                        <Badge variant="sage" size="sm">{art.category}</Badge>
                        <h4 className="font-display text-xl text-charcoal font-bold">{art.title}</h4>
                        <p className="text-charcoal/60 line-clamp-2">{art.excerpt}</p>
                        <p className="text-[11px] text-charcoal/40 pt-2">By {art.author_name} · {art.reading_time_min} min read</p>
                      </div>
                    </div>

                    <div className="p-4 bg-charcoal/5 border-t border-charcoal/10 flex items-center justify-between">
                      <Button
                        onClick={() => setEditingArticle(art)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete post "${art.title}"?`)) {
                            deleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: ACTIVITY AUDIT LOG */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl text-charcoal">Activity Audit Log</h2>
                <p className="font-body text-xs text-charcoal/60">
                  Full chronological history of operational actions taken in this orchard administration session.
                </p>
              </div>

              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-charcoal/5 border-b border-charcoal/10 text-charcoal/70">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target Type</th>
                        <th className="py-3 px-4">Target ID</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Operator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-mango-cream/20 transition-colors">
                          <td className="py-2.5 px-4 text-charcoal/50">{formatDate(log.created_at)}</td>
                          <td className="py-2.5 px-4 font-semibold text-charcoal">{log.action}</td>
                          <td className="py-2.5 px-4 uppercase text-[10px] text-charcoal/60">{log.target_type}</td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-orchard-green">{log.target_id}</td>
                          <td className="py-2.5 px-4 text-charcoal/80">{log.description}</td>
                          <td className="py-2.5 px-4 font-medium text-charcoal">{log.admin_user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: MOBILE CAMERA / TREE PHOTO UPLOAD (Section 4 & 6) */}
      {/* ========================================================================= */}
      {selectedTreeForPhoto && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full p-6 space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">
                Tree Photo — {selectedTreeForPhoto.tree_id}
              </h3>
              <button
                onClick={() => {
                  setSelectedTreeForPhoto(null);
                  setPhotoPreview(null);
                }}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-body text-xs text-charcoal/60">
              Take a photo using your phone camera or select an image file. It will be automatically compressed to WebP/JPEG (~200–300 KB) before saving.
            </p>

            {/* Hidden native input with mobile camera capture support */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoFileChange}
              className="hidden"
            />

            {/* Image Preview Area */}
            <div className="aspect-square bg-soft-sage/30 rounded-soft border-2 border-dashed border-charcoal/20 flex flex-col items-center justify-center relative overflow-hidden">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Tree preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-charcoal/40 mx-auto" />
                  <p className="font-body text-xs text-charcoal/60">No photo selected yet</p>
                </div>
              )}

              {isCompressing && (
                <div className="absolute inset-0 bg-charcoal/50 flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-semibold">Compressing image...</p>
                </div>
              )}
            </div>

            {/* Compression Stats */}
            {compressedFileStats && (
              <div className="p-3 bg-emerald-50 rounded-soft border border-emerald-200 text-xs font-body text-emerald-800 flex justify-between">
                <span>Original: {compressedFileStats.origKB} KB</span>
                <span className="font-bold">Compressed: {compressedFileStats.compKB} KB (WebP)</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                fullWidth
              >
                <Camera className="w-4 h-4 mr-1.5" /> Choose / Take Photo
              </Button>

              <Button
                onClick={handleSavePhoto}
                variant="primary"
                size="sm"
                fullWidth
                disabled={!photoPreview || isCompressing}
              >
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PROTECTED ADOPTER DETAILS */}
      {/* ========================================================================= */}
      {selectedTreeForAdopter && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full p-6 space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-dawn-gold block">
                  Protected Adopter Record
                </span>
                <h3 className="font-display text-2xl text-charcoal">
                  Tree {selectedTreeForAdopter.tree_id}
                </h3>
              </div>
              <button onClick={() => setSelectedTreeForAdopter(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-body text-xs">
              <div className="p-3 bg-mango-cream/40 rounded-soft space-y-2 border border-charcoal/5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-orchard-green" />
                  <span className="font-bold text-charcoal text-sm">{selectedTreeForAdopter.adopter_info?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal/70">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedTreeForAdopter.adopter_info?.phone}</span>
                </div>
                {selectedTreeForAdopter.adopter_info?.email && (
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedTreeForAdopter.adopter_info?.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-charcoal/10">
                <p><strong>Adoption Season:</strong> {pricingConfig.season}</p>
                <p><strong>Guaranteed Harvest:</strong> {pricingConfig.min_guarantee_kg} kg minimum Gir Kesar</p>
                <p><strong>Plaque Status:</strong> Tagged on row</p>
              </div>
            </div>

            <Button onClick={() => setSelectedTreeForAdopter(null)} variant="primary" size="sm" fullWidth>
              Done
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISPATCH ORDER (Courier & Tracking Input) */}
      {/* ========================================================================= */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full p-6 space-y-5 animate-fade-in font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">
                Dispatch Order #{selectedOrderForDispatch.order_number}
              </h3>
              <button onClick={() => setSelectedOrderForDispatch(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Courier Partner</label>
                <select
                  value={dispatchData.courier}
                  onChange={(e) => setDispatchData({ ...dispatchData, courier: e.target.value })}
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="Orchard Local Delivery">Orchard Local Delivery (Surat)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={dispatchData.trackingNumber}
                  onChange={(e) => setDispatchData({ ...dispatchData, trackingNumber: e.target.value })}
                  placeholder="E.g. BD12345678IN"
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Dispatch Date</label>
                <input
                  type="date"
                  value={dispatchData.dispatchDate}
                  onChange={(e) => setDispatchData({ ...dispatchData, dispatchDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setSelectedOrderForDispatch(null)} variant="ghost" size="sm" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateOrderTracking(
                    selectedOrderForDispatch.id,
                    dispatchData.courier,
                    dispatchData.trackingNumber,
                    dispatchData.dispatchDate
                  );
                  setSelectedOrderForDispatch(null);
                }}
                variant="primary"
                size="sm"
                fullWidth
              >
                Confirm Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PACKAGING INVENTORY ADJUSTMENT */}
      {/* ========================================================================= */}
      {selectedPackagingForAdjust && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full p-6 space-y-5 animate-fade-in font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">
                Adjust Stock — {selectedPackagingForAdjust.name}
              </h3>
              <button onClick={() => setSelectedPackagingForAdjust(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  New Current Stock ({selectedPackagingForAdjust.unit})
                </label>
                <input
                  type="number"
                  value={packagingAdjustQty}
                  onChange={(e) => setPackagingAdjustQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Adjustment Reason (Required for Audit Log)
                </label>
                <input
                  type="text"
                  value={packagingAdjustReason}
                  onChange={(e) => setPackagingAdjustReason(e.target.value)}
                  placeholder="E.g. Supplier PO delivery, Harvest pack batch 1, Damaged box write-off"
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setSelectedPackagingForAdjust(null)} variant="ghost" size="sm" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!packagingAdjustReason.trim()) {
                    alert('Please provide a reason for the stock adjustment.');
                    return;
                  }
                  adjustPackagingStock(selectedPackagingForAdjust.id, packagingAdjustQty, packagingAdjustReason);
                  setSelectedPackagingForAdjust(null);
                }}
                variant="primary"
                size="sm"
                fullWidth
              >
                Record Adjustment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW ORDER DETAILS */}
      {/* ========================================================================= */}
      {selectedOrderForView && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-lg w-full p-6 space-y-5 animate-fade-in font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <div>
                <span className="text-[10px] text-charcoal/50 uppercase font-semibold">Order Details</span>
                <h3 className="font-display text-2xl text-charcoal">#{selectedOrderForView.order_number}</h3>
              </div>
              <button onClick={() => setSelectedOrderForView(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-mango-cream/40 rounded-soft border border-charcoal/5 space-y-1">
                <p className="font-bold text-sm text-charcoal">{selectedOrderForView.customer_name}</p>
                <p className="text-charcoal/70">Phone: {selectedOrderForView.phone}</p>
                {selectedOrderForView.email && <p className="text-charcoal/70">Email: {selectedOrderForView.email}</p>}
                <p className="text-charcoal/70 pt-1">
                  <strong>Delivery:</strong> {selectedOrderForView.delivery_address.line1}, {selectedOrderForView.delivery_address.city}, {selectedOrderForView.delivery_address.state} — {selectedOrderForView.delivery_address.pincode}
                </p>
              </div>

              <div className="space-y-1.5 border-y border-charcoal/10 py-3">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Type of Collection:</span>
                  <span className="font-semibold text-charcoal">{selectedOrderForView.items_summary || selectedOrderForView.collection_type || 'Gir Kesar Mangoes'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Quantity:</span>
                  <span className="font-semibold text-charcoal">{selectedOrderForView.quantity || selectedOrderForView.items_count || 1} box(es)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Total Paid:</span>
                  <span className="font-bold text-orchard-green">{formatPrice(selectedOrderForView.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Order Status:</span>
                  <Badge variant="green" size="sm">{selectedOrderForView.status.toUpperCase()}</Badge>
                </div>
                {selectedOrderForView.courier_name && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Courier:</span>
                    <span>{selectedOrderForView.courier_name} ({selectedOrderForView.tracking_number})</span>
                  </div>
                )}
                {selectedOrderForView.notes && (
                  <div className="pt-1 text-charcoal/60 italic">
                    <strong>Customer Note:</strong> {selectedOrderForView.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setSelectedOrderForPackingSlip(selectedOrderForView);
                  setTimeout(() => window.print(), 200);
                }}
                variant="outline"
                size="sm"
                fullWidth
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Packing Slip
              </Button>
              <Button onClick={() => setSelectedOrderForView(null)} variant="primary" size="sm" fullWidth>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESCHEDULE VISIT */}
      {/* ========================================================================= */}
      {selectedVisitForReschedule && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full p-6 space-y-5 animate-fade-in font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">Reschedule Visit</h3>
              <button onClick={() => setSelectedVisitForReschedule(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-charcoal/70">
              Visitor: <strong>{selectedVisitForReschedule.name}</strong> ({selectedVisitForReschedule.number_of_visitors} guests)
            </p>

            <div>
              <label className="font-semibold text-charcoal block mb-1">New Preferred Date</label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setSelectedVisitForReschedule(null)} variant="ghost" size="sm" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateVisitStatus(selectedVisitForReschedule.id, 'rescheduled', `Rescheduled to ${rescheduleDate}`);
                  setSelectedVisitForReschedule(null);
                }}
                variant="primary"
                size="sm"
                fullWidth
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {(editingProduct || isAddProductOpen) && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-lg w-full p-6 space-y-4 my-auto font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Mango Box Product'}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(false);
                }}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div key={editingProduct?.id || 'new-product'} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Product Name</label>
                <input
                  type="text"
                  defaultValue={editingProduct?.name || ''}
                  id="prod-name"
                  placeholder="E.g. Royal Select Kesar 5 kg"
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={editingProduct ? editingProduct.price / 100 : 2500}
                    id="prod-price"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.stock_quantity ?? 100}
                    id="prod-stock"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Box Weight (kg)</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.weight_kg || 10}
                    id="prod-weight"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Min Mango Weight (g)</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.min_weight_g || 200}
                    id="prod-min-wt"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue={editingProduct?.description || ''}
                  id="prod-desc"
                  placeholder="Orchard harvest description..."
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-charcoal/10">
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(false);
                }}
                variant="ghost"
                size="sm"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const name = (document.getElementById('prod-name') as HTMLInputElement)?.value;
                  const price = parseInt((document.getElementById('prod-price') as HTMLInputElement)?.value || '0', 10) * 100;
                  const stock = parseInt((document.getElementById('prod-stock') as HTMLInputElement)?.value || '0', 10);
                  const weight = parseFloat((document.getElementById('prod-weight') as HTMLInputElement)?.value || '10');
                  const minWt = parseInt((document.getElementById('prod-min-wt') as HTMLInputElement)?.value || '200', 10);
                  const desc = (document.getElementById('prod-desc') as HTMLTextAreaElement)?.value;

                  if (!name) {
                    alert('Please provide product name.');
                    return;
                  }

                  if (editingProduct) {
                    updateProduct(editingProduct.id, {
                      name,
                      price,
                      stock_quantity: stock,
                      weight_kg: weight,
                      min_weight_g: minWt,
                      description: desc,
                    });
                  } else {
                    addProduct({
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      tagline: 'Fresh from Surat Grove',
                      description: desc,
                      short_description: desc,
                      price,
                      compare_price: null,
                      weight_kg: weight,
                      mango_count: null,
                      min_weight_g: minWt,
                      is_bagged: true,
                      stock_quantity: stock,
                      is_available: true,
                      sort_order: products.length + 1,
                      seo_title: name,
                      seo_description: desc,
                    });
                  }

                  setSupabaseSyncStatus('Product changes saved and synced to database.');
                  setEditingProduct(null);
                  setIsAddProductOpen(false);
                }}
                variant="primary"
                size="sm"
                fullWidth
              >
                Save Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT JOURNAL POST */}
      {/* ========================================================================= */}
      {(editingArticle || isAddArticleOpen) && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-lg w-full p-6 space-y-4 my-auto font-body text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
              <h3 className="font-display text-2xl text-charcoal">
                {editingArticle ? `Edit Story: ${editingArticle.title}` : 'Write New Journal Post'}
              </h3>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsAddArticleOpen(false);
                }}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div key={editingProduct?.id || 'new-product'} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Story Title</label>
                <input
                  type="text"
                  defaultValue={editingArticle?.title || ''}
                  id="art-title"
                  placeholder="E.g. Preparing the Soil After Winter"
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Category</label>
                  <select
                    defaultValue={editingArticle?.category || 'Field Notes'}
                    id="art-cat"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none"
                  >
                    <option value="Field Notes">Field Notes</option>
                    <option value="Harvest Journal">Harvest Journal</option>
                    <option value="Orchard Life">Orchard Life</option>
                    <option value="Farming Reflections">Farming Reflections</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Reading Time (min)</label>
                  <input
                    type="number"
                    defaultValue={editingArticle?.reading_time_min || 4}
                    id="art-read-time"
                    className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Excerpt / Hook</label>
                <textarea
                  rows={2}
                  defaultValue={editingArticle?.excerpt || ''}
                  id="art-excerpt"
                  placeholder="Short one-line preview for cards..."
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Article Content (Markdown / Paragraphs)</label>
                <textarea
                  rows={6}
                  defaultValue={editingArticle?.content || ''}
                  id="art-content"
                  placeholder="Full text of the dispatch..."
                  className="w-full px-3 py-2 rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-charcoal/10">
              <Button
                onClick={() => {
                  setEditingArticle(null);
                  setIsAddArticleOpen(false);
                }}
                variant="ghost"
                size="sm"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const title = (document.getElementById('art-title') as HTMLInputElement)?.value;
                  const cat = (document.getElementById('art-cat') as HTMLSelectElement)?.value;
                  const readTime = parseInt((document.getElementById('art-read-time') as HTMLInputElement)?.value || '4', 10);
                  const excerpt = (document.getElementById('art-excerpt') as HTMLTextAreaElement)?.value;
                  const content = (document.getElementById('art-content') as HTMLTextAreaElement)?.value;

                  if (!title || !content) {
                    alert('Please enter title and content.');
                    return;
                  }

                  if (editingArticle) {
                    updateArticle(editingArticle.id, {
                      title,
                      category: cat,
                      reading_time_min: readTime,
                      excerpt,
                      content,
                    });
                  } else {
                    addArticle({
                      title,
                      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      excerpt,
                      content,
                      cover_image_url: null,
                      cover_image_alt: null,
                      category: cat,
                      tags: ['orchard', 'kesar', 'farming'],
                      season: 'Season 2025',
                      author_name: 'Kesari Van Team',
                      published_at: new Date().toISOString(),
                      reading_time_min: readTime,
                      is_featured: false,
                      status: 'published',
                      seo_title: title,
                      seo_description: excerpt,
                    });
                  }

                  setEditingArticle(null);
                  setIsAddArticleOpen(false);
                }}
                variant="primary"
                size="sm"
                fullWidth
              >
                Publish Story
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
