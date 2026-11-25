import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_PRODUCTS, MOCK_TREES, MOCK_JOURNAL_ARTICLES } from '../lib/mockData';
import type { Product, Tree, JournalArticle } from '../types/database';
import { supabase } from '../lib/supabase';

const isRealSupabase = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder') && url.startsWith('https://'));
};

const isUuid = (str?: string | null): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

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

export interface ContactEnquiryItem {
  id: string;
  reference_number: string;
  user_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  category: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded' | 'archived';
  is_read: boolean;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
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
  collection_type?: string;
  quantity?: number;
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
  enquiries: ContactEnquiryItem[];
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
  updateTreePhotos: (treeId: string, photos: string[]) => void;
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

  // Contact Enquiry Actions
  addEnquiry: (enquiry: Omit<ContactEnquiryItem, 'id' | 'created_at' | 'updated_at'>) => string;
  updateEnquiryStatus: (id: string, status: ContactEnquiryItem['status'], adminNotes?: string) => void;
  deleteEnquiry: (id: string) => void;

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

// Initial contact enquiries (starts empty for fresh real start)
const INITIAL_ENQUIRIES: ContactEnquiryItem[] = [];

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
      enquiries: INITIAL_ENQUIRIES,
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
        const prev = get().products.find((p) => p.id === id || p.slug === id);
        const targetId = prev?.id || id;
        const targetSlug = prev?.slug;

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
          ),
        }));

        if (isRealSupabase()) {
          const supabaseUpdates: any = {
            ...updates,
            updated_at: new Date().toISOString(),
          };
          delete supabaseUpdates.id;

          const query = (supabase.from('products') as any).update(supabaseUpdates);
          if (isUuid(targetId)) {
            query.eq('id', targetId).then(({ error }: any) => {
              if (error) console.error('Failed to update product in Supabase by ID:', error);
            });
          } else if (targetSlug) {
            query.eq('slug', targetSlug).then(({ error }: any) => {
              if (error) console.error('Failed to update product in Supabase by slug:', error);
            });
          }
        }

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

        if (isRealSupabase()) {
          (supabase.from('products') as any).insert({
            name: newProd.name,
            slug: newProd.slug,
            tagline: newProd.tagline,
            description: newProd.description,
            short_description: newProd.short_description,
            price: newProd.price,
            compare_price: newProd.compare_price,
            weight_kg: newProd.weight_kg,
            mango_count: newProd.mango_count,
            min_weight_g: newProd.min_weight_g,
            is_bagged: newProd.is_bagged,
            stock_quantity: newProd.stock_quantity,
            is_available: newProd.is_available,
            sort_order: newProd.sort_order,
            seo_title: newProd.seo_title,
            seo_description: newProd.seo_description,
          }).then(({ error }: any) => {
            if (error) console.error('Failed to add product to Supabase:', error);
          });
        }

        get().logActivity({
          action: 'Product Added',
          target_type: 'product',
          target_id: id,
          description: `Added new product collection: ${product.name}`,
          admin_user: 'Admin',
        });
      },

      toggleProductStock: (id) => {
        const prod = get().products.find((p) => p.id === id || p.slug === id);
        if (!prod) return;
        const newStatus = !prod.is_available;
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id ? { ...p, is_available: newStatus, updated_at: new Date().toISOString() } : p
          ),
        }));

        if (isRealSupabase()) {
          const query = (supabase.from('products') as any).update({
            is_available: newStatus,
            updated_at: new Date().toISOString(),
          });
          if (isUuid(prod.id)) {
            query.eq('id', prod.id).then(({ error }: any) => {
              if (error) console.error('Failed to toggle stock in Supabase:', error);
            });
          } else {
            query.eq('slug', prod.slug).then(({ error }: any) => {
              if (error) console.error('Failed to toggle stock in Supabase by slug:', error);
            });
          }
        }

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
        const prod = get().products.find((p) => p.id === id || p.slug === id);
        if (!prod) return;
        const prevStock = prod.stock_quantity;
        const adjustment = newStock - prevStock;

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id ? { ...p, stock_quantity: newStock, updated_at: new Date().toISOString() } : p
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

        if (isRealSupabase()) {
          const query = (supabase.from('products') as any).update({
            stock_quantity: newStock,
            updated_at: new Date().toISOString(),
          });
          if (isUuid(prod.id)) {
            query.eq('id', prod.id).then(({ error }: any) => {
              if (error) console.error('Failed to adjust stock in Supabase:', error);
            });
          } else {
            query.eq('slug', prod.slug).then(({ error }: any) => {
              if (error) console.error('Failed to adjust stock in Supabase by slug:', error);
            });
          }

          (supabase.from('inventory_logs') as any).insert({
            item_type: 'product',
            item_id: prod.id,
            item_name: prod.name,
            previous_quantity: prevStock,
            new_quantity: newStock,
            adjustment,
            reason,
            created_by: 'Admin',
          }).then(({ error }: any) => {
            if (error) console.warn('Supabase inventory log warning:', error.message);
          });
        }

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

        if (isRealSupabase()) {
          const supabaseUpdates: any = { ...updates, updated_at: new Date().toISOString() };
          delete supabaseUpdates.id;
          (supabase.from('trees') as any).update(supabaseUpdates).eq('tree_id', treeId).then(({ error }: any) => {
            if (error) console.error(`Failed to update tree ${treeId} in Supabase:`, error);
          });
        }

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

        if (isRealSupabase()) {
          (supabase.from('trees') as any)
            .update({ status, updated_at: new Date().toISOString() })
            .eq('tree_id', treeId)
            .then(({ error }: any) => {
              if (error) console.error(`Failed to set tree status for ${treeId} in Supabase:`, error);
            });
        }

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
        get().updateTreePhotos(treeId, photoUrl ? [photoUrl] : []);
      },

      updateTreePhotos: (treeId, photos) => {
        const cleanPhotos = photos.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
        const primaryUrl = cleanPhotos[0] || null;
        const encodedFallbackUrl = cleanPhotos.length > 1 ? JSON.stringify(cleanPhotos) : primaryUrl;
        const now = new Date().toISOString();

        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, photo_url: primaryUrl, photos: cleanPhotos, updated_at: now } : t
          ),
        }));

        if (isRealSupabase()) {
          (supabase.from('trees') as any)
            .update({ photo_url: primaryUrl, photos: cleanPhotos, updated_at: now })
            .eq('tree_id', treeId)
            .then(async ({ error }: any) => {
              if (error) {
                // Fallback if `photos` column migration has not been applied yet
                const { error: fallbackErr } = await (supabase.from('trees') as any)
                  .update({ photo_url: encodedFallbackUrl, updated_at: now })
                  .eq('tree_id', treeId);
                if (fallbackErr) {
                  console.error(`Failed to update tree photos for ${treeId} in Supabase:`, fallbackErr);
                }
              }
            });
        }

        get().logActivity({
          action: 'Tree Photos Updated',
          target_type: 'tree',
          target_id: treeId,
          description: `Updated gallery (${cleanPhotos.length} photo${cleanPhotos.length === 1 ? '' : 's'}) for Tree ${treeId}`,
          admin_user: 'Admin',
        });
      },

      setTreePrice: (treeId, feeInPaise) => {
        set((state) => ({
          trees: state.trees.map((t) =>
            t.tree_id === treeId ? { ...t, adoption_fee: feeInPaise, updated_at: new Date().toISOString() } : t
          ),
        }));

        if (isRealSupabase()) {
          (supabase.from('trees') as any)
            .update({ adoption_fee: feeInPaise, updated_at: new Date().toISOString() })
            .eq('tree_id', treeId)
            .then(({ error }: any) => {
              if (error) console.error(`Failed to update tree adoption fee in Supabase:`, error);
            });
        }
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

        if (isRealSupabase()) {
          (supabase.from('trees') as any)
            .update({
              status: 'reserved',
              adopter_name: adopter.name,
              adopter_phone: adopter.phone,
              adopter_email: adopter.email || null,
              updated_at: new Date().toISOString(),
            })
            .eq('tree_id', treeId)
            .then(({ error }: any) => {
              if (error) console.error(`Failed to reserve tree ${treeId} in Supabase:`, error);
            });
        }
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

        if (isRealSupabase()) {
          (supabase.from('trees') as any)
            .update({
              status: 'adopted',
              adopter_name: adopter.name,
              adopter_phone: adopter.phone,
              adopter_email: adopter.email || null,
              updated_at: new Date().toISOString(),
            })
            .eq('tree_id', treeId)
            .then(({ error }: any) => {
              if (error) console.error(`Failed to adopt tree ${treeId} in Supabase:`, error);
            });
        }

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
          trees: updates.price
            ? state.trees.map((t) => (t.status === 'available' ? { ...t, adoption_fee: updates.price! } : t))
            : state.trees,
        }));

        if (isRealSupabase() && updates.price) {
          (supabase.from('trees') as any)
            .update({ adoption_fee: updates.price, updated_at: new Date().toISOString() })
            .eq('status', 'available')
            .then(({ error }: any) => {
              if (error) console.error('Failed to update adoption fee for trees in Supabase:', error);
            });
        }

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
        const order = get().orders.find((o) => o.id === orderId || o.order_number === orderId);
        if (!order) return;
        const prevStatus = order.status;
        const newNotes = note ? `${order.notes || ''}\n${note}`.trim() : order.notes;

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === order.id || o.order_number === order.order_number ? { ...o, status, notes: newNotes } : o
          ),
        }));

        if (isRealSupabase()) {
          const updates: any = {
            status,
            updated_at: new Date().toISOString(),
          };
          if (note) updates.notes = newNotes;

          const query = (supabase.from('orders') as any).update(updates);
          if (isUuid(order.id)) {
            query.eq('id', order.id).then(({ error }: any) => {
              if (error) console.error('Failed to update order status in Supabase by ID:', error);
            });
          } else {
            query.eq('order_number', order.order_number).then(({ error }: any) => {
              if (error) console.error('Failed to update order status in Supabase by order_number:', error);
            });
          }
        }

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
        const order = get().orders.find((o) => o.id === orderId || o.order_number === orderId);
        if (!order) return;
        const dispatchD = dispatchDate || new Date().toISOString().split('T')[0];

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === order.id || o.order_number === order.order_number
              ? {
                  ...o,
                  courier_name: courier,
                  tracking_number: trackingNumber,
                  dispatch_date: dispatchD,
                  status: 'dispatched',
                }
              : o
          ),
        }));

        if (isRealSupabase()) {
          const updates: any = {
            courier_name: courier,
            tracking_number: trackingNumber,
            dispatch_date: dispatchD,
            status: 'dispatched',
            updated_at: new Date().toISOString(),
          };

          const query = (supabase.from('orders') as any).update(updates);
          if (isUuid(order.id)) {
            query.eq('id', order.id).then(({ error }: any) => {
              if (error) console.error('Failed to update order tracking in Supabase by ID:', error);
            });
          } else {
            query.eq('order_number', order.order_number).then(({ error }: any) => {
              if (error) console.error('Failed to update order tracking in Supabase by order_number:', error);
            });
          }
        }

        get().logActivity({
          action: 'Order Tracking Added',
          target_type: 'order',
          target_id: order.order_number,
          description: `Dispatched via ${courier} (Tracking: ${trackingNumber})`,
          admin_user: 'Admin',
        });
      },

      updateOrderNotes: (orderId, notes) => {
        const order = get().orders.find((o) => o.id === orderId || o.order_number === orderId);
        if (!order) return;
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === order.id || o.order_number === order.order_number ? { ...o, notes } : o
          ),
        }));

        if (isRealSupabase()) {
          const query = (supabase.from('orders') as any).update({ notes, updated_at: new Date().toISOString() });
          if (isUuid(order.id)) {
            query.eq('id', order.id).then(({ error }: any) => {
              if (error) console.error('Failed to update order notes in Supabase by ID:', error);
            });
          } else {
            query.eq('order_number', order.order_number).then(({ error }: any) => {
              if (error) console.error('Failed to update order notes in Supabase by order_number:', error);
            });
          }
        }
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

        if (isRealSupabase()) {
          (supabase.from('visit_requests') as any).insert({
            request_number: requestNumber,
            name: reqData.name,
            phone: reqData.phone,
            email: reqData.email || null,
            preferred_date: reqData.preferred_date,
            number_of_visitors: reqData.number_of_visitors,
            message: reqData.message || null,
            status: 'pending',
          }).then(({ error }: any) => {
            if (error) console.error('Failed to insert visit request into Supabase:', error);
          });
        }

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
        const visit = get().visits.find((v) => v.id === id || v.request_number === id);
        if (!visit) return;
        const prevStatus = visit.status;
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visit.id || v.request_number === visit.request_number
              ? {
                  ...v,
                  status,
                  admin_notes: adminNotes !== undefined ? adminNotes : v.admin_notes,
                }
              : v
          ),
        }));

        if (isRealSupabase()) {
          const updates: any = {
            status,
            updated_at: new Date().toISOString(),
          };
          if (adminNotes !== undefined) updates.admin_notes = adminNotes;

          const query = (supabase.from('visit_requests') as any).update(updates);
          if (isUuid(visit.id)) {
            query.eq('id', visit.id).then(({ error }: any) => {
              if (error) console.error('Failed to update visit status in Supabase by ID:', error);
            });
          } else {
            query.eq('request_number', visit.request_number).then(({ error }: any) => {
              if (error) console.error('Failed to update visit status in Supabase by request_number:', error);
            });
          }
        }

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
        const visit = get().visits.find((v) => v.id === id || v.request_number === id);
        if (!visit) return;
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visit.id || v.request_number === visit.request_number
              ? {
                  ...v,
                  previous_status: v.status,
                  status: 'cancelled',
                  cancelled_reason: reason || 'Cancelled by admin',
                }
              : v
          ),
        }));

        if (isRealSupabase()) {
          const query = (supabase.from('visit_requests') as any).update({
            status: 'cancelled',
            cancelled_reason: reason || 'Cancelled by admin',
            updated_at: new Date().toISOString(),
          });
          if (isUuid(visit.id)) {
            query.eq('id', visit.id).then(({ error }: any) => {
              if (error) console.error('Failed to cancel visit in Supabase by ID:', error);
            });
          } else {
            query.eq('request_number', visit.request_number).then(({ error }: any) => {
              if (error) console.error('Failed to cancel visit in Supabase by request_number:', error);
            });
          }
        }

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
        const visit = get().visits.find((v) => v.id === id || v.request_number === id);
        if (!visit) return;
        const targetStatus = (visit.previous_status as OrchardVisitItem['status']) || 'pending';
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visit.id || v.request_number === visit.request_number
              ? {
                  ...v,
                  status: targetStatus,
                  restored_at: new Date().toISOString(),
                  cancelled_reason: undefined,
                }
              : v
          ),
        }));

        if (isRealSupabase()) {
          const query = (supabase.from('visit_requests') as any).update({
            status: targetStatus,
            cancelled_reason: null,
            restored_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          if (isUuid(visit.id)) {
            query.eq('id', visit.id).then(({ error }: any) => {
              if (error) console.error('Failed to restore visit in Supabase by ID:', error);
            });
          } else {
            query.eq('request_number', visit.request_number).then(({ error }: any) => {
              if (error) console.error('Failed to restore visit in Supabase by request_number:', error);
            });
          }
        }

        get().logActivity({
          action: 'Visit Restored (Undo)',
          target_type: 'visit',
          target_id: visit.request_number,
          description: `Cancelled visit ${visit.request_number} was restored back to ${targetStatus}`,
          admin_user: 'Admin',
        });
      },

      // ─── Enquiries ───
      addEnquiry: (newEnquiry) => {
        const id = `enq-${Date.now()}`;
        const enquiry: ContactEnquiryItem = {
          ...newEnquiry,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ enquiries: [enquiry, ...state.enquiries] }));

        if (isRealSupabase()) {
          (supabase.from('contact_enquiries') as any).insert({
            reference_number: newEnquiry.reference_number,
            user_id: newEnquiry.user_id || null,
            name: newEnquiry.name,
            phone: newEnquiry.phone,
            email: newEnquiry.email || null,
            category: newEnquiry.category,
            message: newEnquiry.message,
            status: newEnquiry.status || 'new',
            is_read: newEnquiry.is_read || false,
            admin_notes: newEnquiry.admin_notes || null,
          }).then(({ error }: any) => {
            if (error) console.error('Failed to insert contact enquiry in Supabase:', error);
          });
        }

        get().logActivity({
          action: 'Contact Enquiry Submitted',
          target_type: 'visit',
          target_id: newEnquiry.reference_number,
          description: `New customer enquiry ${newEnquiry.reference_number} submitted by ${newEnquiry.name} (${newEnquiry.category})`,
          admin_user: newEnquiry.name,
        });

        return id;
      },

      updateEnquiryStatus: (id, status, adminNotes) => {
        const enquiry = get().enquiries.find((e) => e.id === id || e.reference_number === id);
        if (!enquiry) return;
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === enquiry.id || e.reference_number === enquiry.reference_number
              ? {
                  ...e,
                  status,
                  is_read: status === 'responded' || status === 'archived' ? true : e.is_read,
                  admin_notes: adminNotes !== undefined ? adminNotes : e.admin_notes,
                  updated_at: new Date().toISOString(),
                }
              : e
          ),
        }));

        if (isRealSupabase()) {
          const payload: any = {
            status,
            updated_at: new Date().toISOString(),
          };
          if (adminNotes !== undefined) payload.admin_notes = adminNotes;
          if (status === 'responded' || status === 'archived') payload.is_read = true;

          const query = (supabase.from('contact_enquiries') as any).update(payload);
          if (isUuid(enquiry.id)) {
            query.eq('id', enquiry.id).then(({ error }: any) => {
              if (error) console.error('Failed to update enquiry in Supabase by ID:', error);
            });
          } else {
            query.eq('reference_number', enquiry.reference_number).then(({ error }: any) => {
              if (error) console.error('Failed to update enquiry in Supabase by ref:', error);
            });
          }
        }

        get().logActivity({
          action: 'Enquiry Status Updated',
          target_type: 'visit',
          target_id: enquiry.reference_number,
          description: `Enquiry ${enquiry.reference_number} status changed to ${status}`,
          admin_user: 'Admin',
        });
      },

      deleteEnquiry: (id) => {
        const enquiry = get().enquiries.find((e) => e.id === id || e.reference_number === id);
        if (!enquiry) return;
        set((state) => ({
          enquiries: state.enquiries.filter((e) => e.id !== enquiry.id && e.reference_number !== enquiry.reference_number),
        }));

        if (isRealSupabase()) {
          const query = (supabase.from('contact_enquiries') as any).delete();
          if (isUuid(enquiry.id)) {
            query.eq('id', enquiry.id).then(({ error }: any) => {
              if (error) console.error('Failed to delete enquiry in Supabase by ID:', error);
            });
          } else {
            query.eq('reference_number', enquiry.reference_number).then(({ error }: any) => {
              if (error) console.error('Failed to delete enquiry in Supabase by ref:', error);
            });
          }
        }

        get().logActivity({
          action: 'Enquiry Deleted',
          target_type: 'visit',
          target_id: enquiry.reference_number,
          description: `Enquiry ${enquiry.reference_number} was deleted by Admin`,
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

        if (isRealSupabase()) {
          (supabase.from('journal_articles') as any).insert({
            title: newArticle.title,
            slug: newArticle.slug,
            excerpt: newArticle.excerpt,
            content: newArticle.content,
            cover_image_url: newArticle.cover_image_url,
            cover_image_alt: newArticle.cover_image_alt,
            category: newArticle.category,
            tags: newArticle.tags,
            season: newArticle.season,
            status: newArticle.status,
            is_featured: newArticle.is_featured,
            author_name: newArticle.author_name,
            reading_time_min: newArticle.reading_time_min,
            seo_title: newArticle.seo_title,
            seo_description: newArticle.seo_description,
            published_at: newArticle.published_at,
          }).then(({ error }: any) => {
            if (error) console.error('Failed to insert article in Supabase:', error);
          });
        }

        get().logActivity({
          action: 'Journal Article Created',
          target_type: 'journal',
          target_id: article.slug,
          description: `Published/Drafted journal story: "${article.title}"`,
          admin_user: 'Admin',
        });
      },

      updateArticle: (id, updates) => {
        const art = get().articles.find((a) => a.id === id || a.slug === id);
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id || a.slug === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
          ),
        }));

        if (isRealSupabase() && art) {
          const supabaseUpdates: any = { ...updates, updated_at: new Date().toISOString() };
          delete supabaseUpdates.id;

          const query = (supabase.from('journal_articles') as any).update(supabaseUpdates);
          if (isUuid(art.id)) {
            query.eq('id', art.id).then(({ error }: any) => {
              if (error) console.error('Failed to update article in Supabase by ID:', error);
            });
          } else {
            query.eq('slug', art.slug).then(({ error }: any) => {
              if (error) console.error('Failed to update article in Supabase by slug:', error);
            });
          }
        }

        get().logActivity({
          action: 'Journal Article Edited',
          target_type: 'journal',
          target_id: id,
          description: `Updated content/status for article ${id}`,
          admin_user: 'Admin',
        });
      },

      deleteArticle: (id) => {
        const art = get().articles.find((a) => a.id === id || a.slug === id);
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id && a.slug !== id),
        }));

        if (isRealSupabase() && art) {
          const query = (supabase.from('journal_articles') as any).delete();
          if (isUuid(art.id)) {
            query.eq('id', art.id).then(({ error }: any) => {
              if (error) console.error('Failed to delete article in Supabase by ID:', error);
            });
          } else {
            query.eq('slug', art.slug).then(({ error }: any) => {
              if (error) console.error('Failed to delete article in Supabase by slug:', error);
            });
          }
        }

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
        const item = get().packaging.find((p) => p.id === id || p.sku === id);
        if (!item) return;
        const prevStock = item.current_stock;
        const adjustment = newStock - prevStock;

        set((state) => ({
          packaging: state.packaging.map((p) =>
            p.id === item.id || p.sku === item.sku ? { ...p, current_stock: newStock, last_restocked: new Date().toISOString().split('T')[0] } : p
          ),
          inventoryLogs: [
            {
              id: `log-${Date.now()}`,
              item_type: 'packaging',
              item_id: item.id,
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

        if (isRealSupabase()) {
          const query = (supabase.from('packaging_inventory') as any).update({
            current_stock: newStock,
            updated_at: new Date().toISOString(),
          });
          if (isUuid(item.id)) {
            query.eq('id', item.id).then(({ error }: any) => {
              if (error) console.error('Failed to update packaging stock in Supabase by ID:', error);
            });
          } else {
            query.eq('sku', item.sku).then(({ error }: any) => {
              if (error) console.error('Failed to update packaging stock in Supabase by SKU:', error);
            });
          }

          (supabase.from('inventory_logs') as any).insert({
            item_type: 'packaging',
            item_id: item.id,
            item_name: item.name,
            previous_quantity: prevStock,
            new_quantity: newStock,
            adjustment,
            reason,
            created_by: 'Admin',
          }).then(({ error }: any) => {
            if (error) console.warn('Supabase packaging inventory log warning:', error.message);
          });
        }

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

        if (isRealSupabase()) {
          (supabase.from('admin_activity_logs') as any).insert({
            action: logData.action,
            target_type: logData.target_type,
            target_id: logData.target_id,
            description: logData.description,
            previous_value: logData.previous_value || null,
            new_value: logData.new_value || null,
            admin_user: logData.admin_user || 'Admin',
          }).then(({ error }: any) => {
            if (error) console.warn('Supabase activity log warning:', error.message);
          });
        }
      },
    }),
    {
      name: 'kesari-van-orchard-state-v6',
      partialize: (state) => ({
        products: state.products,
        trees: state.trees,
        pricingConfig: state.pricingConfig,
        orders: state.orders,
        visits: state.visits,
        enquiries: state.enquiries,
        articles: state.articles,
        packaging: state.packaging,
        inventoryLogs: state.inventoryLogs,
        activityLogs: state.activityLogs,
      }),
    }
  )
);

