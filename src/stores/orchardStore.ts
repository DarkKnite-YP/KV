import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_PRODUCTS, MOCK_TREES, MOCK_JOURNAL_ARTICLES } from '../lib/mockData';
import type { Product, Tree, JournalArticle } from '../types/database';

export interface PackagingItem {
  id: string;
  name: string;
  sku: string;
  category: 'boxes' | 'bags' | 'cushioning' | 'labels';
  current_stock: number;
  min_threshold: number;
  unit: string;
  last_restocked?: string;
}

export interface InventoryLog {
  id: string;
  item_type: 'product' | 'packaging';
  item_id: string;
  item_name: string;
  previous_quantity: number;
  new_quantity: number;
  adjustment: number;
  reason: string;
  admin_user: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target_type: 'tree' | 'product' | 'order' | 'visit' | 'journal' | 'inventory' | 'pricing';
  target_id: string;
  description: string;
  previous_value?: string;
  new_value?: string;
  admin_user: string;
  created_at: string;
}

export interface OrchardVisitItem {
  id: string;
  request_number: string;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  number_of_visitors: number;
  message: string | null;
  status:
    | 'pending'
    | 'under_review'
    | 'confirmed'
    | 'reschedule_requested'
    | 'rescheduled'
    | 'declined'
    | 'cancelled'
    | 'completed';
  admin_notes?: string;
  cancelled_reason?: string;
  previous_status?: string;
  restored_at?: string;
  created_at: string;
}

export interface HarvestOrderItem {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  order_date: string;
  items_summary: string;
  items_count: number;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'dispatched'
    | 'delivered'
    | 'cancelled'
    | 'refund_initiated'
    | 'refunded';
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refund_initiated' | 'refunded';
  delivery_address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  courier_name?: string;
  tracking_number?: string;
  dispatch_date?: string;
  notes?: string;
}

export interface AdoptionPricingConfig {
  name: string;
  price: number; // in paise
  season: string;
  min_guarantee_kg: number;
  excess_yield_policy: string;
  shipping_policy_text: string;
  description: string;
  is_active: boolean;
}

interface OrchardState {
  // Data
  products: Product[];
  trees: Tree[];
  pricingConfig: AdoptionPricingConfig;
  orders: HarvestOrderItem[];
  visits: OrchardVisitItem[];
  articles: JournalArticle[];
  packaging: PackagingItem[];
  inventoryLogs: InventoryLog[];
  activityLogs: ActivityLog[];

  // Product Actions
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  toggleProductStock: (id: string) => void;
  adjustProductStock: (id: string, newStock: number, reason: string) => void;

  // Tree Registry Actions
  updateTree: (treeId: string, updates: Partial<Tree>) => void;
  setTreeStatus: (treeId: string, status: Tree['status']) => void;
  updateTreePhoto: (treeId: string, photoUrl: string) => void;
  setTreePrice: (treeId: string, feeInPaise: number) => void;
  reserveTree: (treeId: string, adopter: { name: string; phone: string; email?: string }) => void;
  adoptTree: (treeId: string, adopter: { name: string; phone: string; email?: string }) => void;

  // Adoption Pricing
  updateAdoptionPricing: (updates: Partial<AdoptionPricingConfig>) => void;

  // Order Actions
  addOrder: (order: Omit<HarvestOrderItem, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: HarvestOrderItem['status'], note?: string) => void;
  updateOrderTracking: (orderId: string, courier: string, trackingNumber: string, dispatchDate?: string) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;

  // Visit Actions
  addVisitRequest: (request: Omit<OrchardVisitItem, 'id' | 'request_number' | 'status' | 'created_at'>) => string;
  updateVisitStatus: (id: string, status: OrchardVisitItem['status'], adminNotes?: string) => void;
  cancelVisit: (id: string, reason?: string) => void;
  restoreVisit: (id: string) => void;

  // Journal CMS Actions
  addArticle: (article: Omit<JournalArticle, 'id' | 'created_at' | 'updated_at'>) => void;
  updateArticle: (id: string, updates: Partial<JournalArticle>) => void;
  deleteArticle: (id: string) => void;

  // Packaging Inventory
  adjustPackagingStock: (id: string, newStock: number, reason: string) => void;

  // Activity Log
  logActivity: (log: Omit<ActivityLog, 'id' | 'created_at'>) => void;
}

// Initial packaging inventory
const INITIAL_PACKAGING: PackagingItem[] = [
  {
    id: 'pack-1',
    name: '10 kg Heavy-Duty Corrugated Boxes',
    sku: 'BOX-10KG-STD',
    category: 'boxes',
    current_stock: 450,
    min_threshold: 100,
    unit: 'boxes',
    last_restocked: '2025-01-10',
  },
  {
    id: 'pack-2',
    name: '10 kg Premium Ventilated Boxes (Gold Print)',
    sku: 'BOX-10KG-PREM',
    category: 'boxes',
    current_stock: 320,
    min_threshold: 80,
    unit: 'boxes',
    last_restocked: '2025-01-12',
  },
  {
    id: 'pack-3',
    name: '12-Mango Luxury Rigid Gift Presentation Box',
    sku: 'BOX-12M-SIGN',
    category: 'boxes',
    current_stock: 180,
    min_threshold: 50,
    unit: 'boxes',
    last_restocked: '2025-01-15',
  },
  {
    id: 'pack-4',
    name: 'Breathable Fruit Protection Bags (Double-Layer)',
    sku: 'BAG-FRUIT-PROT',
    category: 'bags',
    current_stock: 8500,
    min_threshold: 2000,
    unit: 'bags',
    last_restocked: '2024-12-20',
  },
  {
    id: 'pack-5',
    name: 'Unbleached Organic Wood Wool Cushioning',
    sku: 'CUSH-WOOD-WOOL',
    category: 'cushioning',
    current_stock: 240,
    min_threshold: 50,
    unit: 'kg',
    last_restocked: '2025-01-05',
  },
  {
    id: 'pack-6',
    name: 'Orchard Security & Saffron Guarantee Seals',
    sku: 'LBL-CRATE-SEAL',
    category: 'labels',
    current_stock: 1200,
    min_threshold: 300,
    unit: 'stickers',
    last_restocked: '2025-01-10',
  },
];

// Initial orders (starts empty for fresh real start)
const INITIAL_ORDERS: HarvestOrderItem[] = [];

// Initial visits (starts empty for fresh real start)
const INITIAL_VISITS: OrchardVisitItem[] = [];

export const useOrchardStore = create<OrchardState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      trees: MOCK_TREES,
      pricingConfig: {
        name: 'Primary Tree Adoption Package',
        price: 649900, // ₹6,499 in paise
        season: '2025',
        min_guarantee_kg: 25,
        excess_yield_policy: 'All sound surplus yield produced by the adopted tree belongs to the adopter.',
        shipping_policy_text: 'Courier delivery charges are billed separately prior to dispatch based on actual harvest weight and destination PIN code.',
        description: 'Complete seasonal adoption of one numbered Gir Kesar tree with 25 kg minimum guarantee, weekly video dispatches, and priority farm visit.',
        is_active: true,
      },
      orders: INITIAL_ORDERS,
      visits: INITIAL_VISITS,
      articles: MOCK_JOURNAL_ARTICLES,
      packaging: INITIAL_PACKAGING,
      inventoryLogs: [],
      activityLogs: [
        {
          id: 'act-init',
          action: 'System Initialized',
          target_type: 'product',
          target_id: 'SYSTEM',
          description: 'Orchard management system initialized with active season catalog.',
          admin_user: 'System',
          created_at: new Date().toISOString(),
        },
      ],

      // ─── Products ───
      updateProduct: (id, updates) => {
        const prev = get().products.find((p) => p.id === id);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
          ),
        }));

        get().logActivity({
          action: 'Product Updated',
          target_type: 'product',
          target_id: id,
          description: `Updated details for ${prev?.name || id}`,
          previous_value: JSON.stringify(prev),
          new_value: JSON.stringify(updates),
          admin_user: 'Admin',
        });
      },

      addProduct: (newProd) => {
        const id = `prod-${Date.now()}`;
        const product: Product = {
          ...newProd,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, product] }));
        get().logActivity({
          action: 'Product Added',
          target_type: 'product',
          target_id: id,
          description: `Added new product collection: ${product.name}`,
          admin_user: 'Admin',
        });
      },

      toggleProductStock: (id) => {
        const prod = get().products.find((p) => p.id === id);
        if (!prod) return;
        const newStatus = !prod.is_available;
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, is_available: newStatus, updated_at: new Date().toISOString() } : p
          ),
        }));
        get().logActivity({
          action: 'Product Availability Toggled',
          target_type: 'product',
          target_id: id,
          description: `Marked ${prod.name} as ${newStatus ? 'In Stock' : 'Out of Stock'}`,
          previous_value: String(!newStatus),
          new_value: String(newStatus),
          admin_user: 'Admin',
        });
      },

      adjustProductStock: (id, newStock, reason) => {
        const prod = get().products.find((p) => p.id === id);
        if (!prod) return;
        const prevStock = prod.stock_quantity;
        const adjustment = newStock - prevStock;

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock_quantity: newStock, updated_at: new Date().toISOString() } : p
          ),
          inventoryLogs: [
            {
              id: `log-${Date.now()}`,
              item_type: 'product',
              item_id: id,
              item_name: prod.name,
              previous_quantity: prevStock,
              new_quantity: newStock,
              adjustment,
              reason,
              admin_user: 'Admin',
              created_at: new Date().toISOString(),
            },
            ...state.inventoryLogs,
          ],
        }));

        get().logActivity({
          action: 'Product Stock Adjusted',
          target_type: 'inventory',
          target_id: id,
          description: `${prod.name} stock changed from ${prevStock} to ${newStock} (${reason})`,
          previous_value: String(prevStock),
          new_value: String(newStock),
          admin_user: 'Admin',
        });
      },

      // ─── Trees ───
      updateTree: (treeId, updates) => {
        const prev = get().trees.find((t) => t.tree_id === treeId);
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
          ),
        }));
        get().logActivity({
          action: 'Tree Updated',
          target_type: 'tree',
          target_id: treeId,
          description: `Tree ${treeId} details updated`,
          previous_value: JSON.stringify(prev),
          new_value: JSON.stringify(updates),
          admin_user: 'Admin',
        });
      },

      setTreeStatus: (treeId, status) => {
        const tree = get().trees.find((t) => t.tree_id === treeId);
        if (!tree) return;
        const prevStatus = tree.status;
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, status, updated_at: new Date().toISOString() } : t
          ),
        }));
        get().logActivity({
          action: 'Tree Status Changed',
          target_type: 'tree',
          target_id: treeId,
          description: `Tree ${treeId} status changed from ${prevStatus} to ${status}`,
          previous_value: prevStatus,
          new_value: status,
          admin_user: 'Admin',
        });
      },

      updateTreePhoto: (treeId, photoUrl) => {
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, photo_url: photoUrl, updated_at: new Date().toISOString() } : t
          ),
        }));
        get().logActivity({
          action: 'Tree Photo Uploaded',
          target_type: 'tree',
          target_id: treeId,
          description: `Updated mobile photo for Tree ${treeId}`,
          admin_user: 'Admin',
        });
      },

      setTreePrice: (treeId, feeInPaise) => {
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, adoption_fee: feeInPaise, updated_at: new Date().toISOString() } : t
          ),
        }));
      },

      reserveTree: (treeId, adopter) => {
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId
              ? {
                  ...t,
                  status: 'reserved',
                  adopter_name: adopter.name,
                  adopter_phone: adopter.phone,
                  adopter_email: adopter.email || null,
                  updated_at: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      adoptTree: (treeId, adopter) => {
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId
              ? {
                  ...t,
                  status: 'adopted',
                  adopter_name: adopter.name,
                  adopter_phone: adopter.phone,
                  adopter_email: adopter.email || null,
                  updated_at: new Date().toISOString(),
                }
              : t
          ),
        }));
        get().logActivity({
          action: 'Tree Adopted',
          target_type: 'tree',
          target_id: treeId,
          description: `Tree ${treeId} adopted by ${adopter.name} (${adopter.phone})`,
          admin_user: 'System / Customer',
        });
      },

      // ─── Adoption Pricing ───
      updateAdoptionPricing: (updates) => {
        const prev = get().pricingConfig;
        set((state) => ({
          pricingConfig: { ...state.pricingConfig, ...updates },
          // If price changed, update all available trees fee
          trees: updates.price
            ? state.trees.map((t) => (t.status === 'available' ? { ...t, adoption_fee: updates.price! } : t))
            : state.trees,
        }));
        get().logActivity({
          action: 'Adoption Pricing Settings Updated',
          target_type: 'pricing',
          target_id: 'SEASON-CONFIG',
          description: `Updated seasonal adoption terms and pricing`,
          previous_value: JSON.stringify(prev),
          new_value: JSON.stringify(updates),
          admin_user: 'Admin',
        });
      },

      // ─── Orders ───
      addOrder: (orderData) => {
        const id = `ord-${Date.now()}`;
        const newOrder: HarvestOrderItem = { ...orderData, id };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        get().logActivity({
          action: 'Order Placed',
          target_type: 'order',
          target_id: newOrder.order_number,
          description: `New harvest order received for ${newOrder.customer_name}`,
          admin_user: 'Customer',
        });
      },

      updateOrderStatus: (orderId, status, note) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        const prevStatus = order.status;
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status, notes: note ? `${o.notes || ''}\n${note}` : o.notes } : o
          ),
        }));
        get().logActivity({
          action: 'Order Status Updated',
          target_type: 'order',
          target_id: order.order_number,
          description: `Order ${order.order_number} status changed from ${prevStatus} to ${status}`,
          previous_value: prevStatus,
          new_value: status,
          admin_user: 'Admin',
        });
      },

      updateOrderTracking: (orderId, courier, trackingNumber, dispatchDate) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  courier_name: courier,
                  tracking_number: trackingNumber,
                  dispatch_date: dispatchDate || new Date().toISOString().split('T')[0],
                  status: 'dispatched',
                }
              : o
          ),
        }));
        get().logActivity({
          action: 'Order Tracking Added',
          target_type: 'order',
          target_id: order.order_number,
          description: `Dispatched via ${courier} (Tracking: ${trackingNumber})`,
          admin_user: 'Admin',
        });
      },

      updateOrderNotes: (orderId, notes) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, notes } : o)),
        }));
      },

      // ─── Visits ───
      addVisitRequest: (reqData) => {
        const id = `vis-${Date.now()}`;
        const randomNum = Math.floor(100 + Math.random() * 900);
        const requestNumber = `VISIT-${randomNum}`;
        const newVisit: OrchardVisitItem = {
          ...reqData,
          id,
          request_number: requestNumber,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        set((state) => ({ visits: [newVisit, ...state.visits] }));
        get().logActivity({
          action: 'Visit Requested',
          target_type: 'visit',
          target_id: requestNumber,
          description: `Visit request received from ${newVisit.name} for ${newVisit.preferred_date}`,
          admin_user: 'Public Visitor',
        });
        return requestNumber;
      },

      updateVisitStatus: (id, status, adminNotes) => {
        const visit = get().visits.find((v) => v.id === id);
        if (!visit) return;
        const prevStatus = visit.status;
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id ? { ...v, status, admin_notes: adminNotes || v.admin_notes } : v
          ),
        }));
        get().logActivity({
          action: 'Visit Status Updated',
          target_type: 'visit',
          target_id: visit.request_number,
          description: `Visit ${visit.request_number} changed from ${prevStatus} to ${status}`,
          previous_value: prevStatus,
          new_value: status,
          admin_user: 'Admin',
        });
      },

      cancelVisit: (id, reason) => {
        const visit = get().visits.find((v) => v.id === id);
        if (!visit) return;
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id
              ? {
                  ...v,
                  previous_status: v.status,
                  status: 'cancelled',
                  cancelled_reason: reason || 'Cancelled by admin',
                }
              : v
          ),
        }));
        get().logActivity({
          action: 'Visit Cancelled',
          target_type: 'visit',
          target_id: visit.request_number,
          description: `Visit ${visit.request_number} was cancelled. Reason: ${reason || 'Not specified'}`,
          admin_user: 'Admin',
        });
      },

      // Cancellation Undo / Restore
      restoreVisit: (id) => {
        const visit = get().visits.find((v) => v.id === id);
        if (!visit) return;
        const targetStatus = (visit.previous_status as OrchardVisitItem['status']) || 'pending';
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: targetStatus,
                  restored_at: new Date().toISOString(),
                  cancelled_reason: undefined,
                }
              : v
          ),
        }));
        get().logActivity({
          action: 'Visit Restored (Undo)',
          target_type: 'visit',
          target_id: visit.request_number,
          description: `Cancelled visit ${visit.request_number} was restored back to ${targetStatus}`,
          admin_user: 'Admin',
        });
      },

      // ─── Journal ───
      addArticle: (newArticle) => {
        const id = `art-${Date.now()}`;
        const article: JournalArticle = {
          ...newArticle,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ articles: [article, ...state.articles] }));
        get().logActivity({
          action: 'Journal Article Created',
          target_type: 'journal',
          target_id: article.slug,
          description: `Published/Drafted journal story: "${article.title}"`,
          admin_user: 'Admin',
        });
      },

      updateArticle: (id, updates) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
          ),
        }));
        get().logActivity({
          action: 'Journal Article Edited',
          target_type: 'journal',
          target_id: id,
          description: `Updated content/status for article ${id}`,
          admin_user: 'Admin',
        });
      },

      deleteArticle: (id) => {
        const art = get().articles.find((a) => a.id === id);
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        }));
        get().logActivity({
          action: 'Journal Article Deleted',
          target_type: 'journal',
          target_id: id,
          description: `Deleted article: "${art?.title || id}"`,
          admin_user: 'Admin',
        });
      },

      // ─── Packaging Inventory ───
      adjustPackagingStock: (id, newStock, reason) => {
        const item = get().packaging.find((p) => p.id === id);
        if (!item) return;
        const prevStock = item.current_stock;
        const adjustment = newStock - prevStock;

        set((state) => ({
          packaging: state.packaging.map((p) =>
            p.id === id ? { ...p, current_stock: newStock, last_restocked: new Date().toISOString().split('T')[0] } : p
          ),
          inventoryLogs: [
            {
              id: `log-${Date.now()}`,
              item_type: 'packaging',
              item_id: id,
              item_name: item.name,
              previous_quantity: prevStock,
              new_quantity: newStock,
              adjustment,
              reason,
              admin_user: 'Admin',
              created_at: new Date().toISOString(),
            },
            ...state.inventoryLogs,
          ],
        }));

        get().logActivity({
          action: 'Packaging Inventory Adjusted',
          target_type: 'inventory',
          target_id: item.sku,
          description: `${item.name} stock adjusted from ${prevStock} to ${newStock} (${reason})`,
          admin_user: 'Admin',
        });
      },

      // ─── Activity Log ───
      logActivity: (logData) => {
        const log: ActivityLog = {
          ...logData,
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ activityLogs: [log, ...state.activityLogs.slice(0, 99)] }));
      },
    }),
    {
      name: 'kesari-van-orchard-state-v4',
      partialize: (state) => ({
        products: state.products,
        trees: state.trees,
        pricingConfig: state.pricingConfig,
        orders: state.orders,
        visits: state.visits,
        articles: state.articles,
        packaging: state.packaging,
        inventoryLogs: state.inventoryLogs,
        activityLogs: state.activityLogs,
      }),
    }
  )
);

