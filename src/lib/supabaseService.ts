import { supabase } from './supabase';
import { useOrchardStore } from '../stores/orchardStore';
import { MOCK_PRODUCTS, MOCK_TREES, MOCK_JOURNAL_ARTICLES } from './mockData';
import type { Product, Tree, JournalArticle } from '../types/database';

export const isRealSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder') && url.startsWith('https://'));
};

/**
 * Pulls all live data from Supabase and hydrates the Zustand store
 */
export async function syncFromSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isRealSupabaseConfigured()) {
    return { success: false, message: 'Supabase URL/Anon key not configured in .env' };
  }

  try {
    const store = useOrchardStore.getState();

    // 1. Fetch Products
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!prodErr && dbProducts && dbProducts.length > 0) {
      // Map to store products
      useOrchardStore.setState({ products: dbProducts as Product[] });
    }

    // 2. Fetch Trees
    const { data: dbTrees, error: treeErr } = await supabase
      .from('trees')
      .select('*')
      .order('tree_id', { ascending: true });

    if (!treeErr && dbTrees && dbTrees.length > 0) {
      useOrchardStore.setState({ trees: dbTrees as Tree[] });
    }

    // 3. Fetch Journal Articles
    const { data: dbArticles, error: artErr } = await supabase
      .from('journal_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (!artErr && dbArticles && dbArticles.length > 0) {
      useOrchardStore.setState({ articles: dbArticles as JournalArticle[] });
    }

    // 4. Fetch Packaging Inventory
    const { data: dbPackaging, error: packErr } = await supabase
      .from('packaging_inventory')
      .select('*');

    if (!packErr && dbPackaging && dbPackaging.length > 0) {
      useOrchardStore.setState({ packaging: dbPackaging as any });
    }

    // 5. Fetch Visit Requests
    const { data: dbVisits, error: visitErr } = await supabase
      .from('visit_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!visitErr && dbVisits) {
      const mappedVisits = dbVisits.map((v: any) => ({
        id: v.id,
        request_number: v.request_number || `KV-VISIT-${v.id.slice(0, 6).toUpperCase()}`,
        name: v.name,
        phone: v.phone,
        email: v.email,
        preferred_date: v.preferred_date,
        number_of_visitors: v.number_of_visitors,
        message: v.message || v.notes || null,
        status: v.status,
        admin_notes: v.admin_notes || undefined,
        cancelled_reason: v.cancelled_reason || undefined,
        created_at: v.created_at,
      }));
      useOrchardStore.setState({ visits: mappedVisits as any });
    }

    // 6. Fetch Orders
    const { data: dbOrders, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!orderErr && dbOrders) {
      const mappedOrders = dbOrders
        .filter((o: any) => !o.order_number?.startsWith('TEST-PERM'))
        .map((o: any) => {
          const notes = o.notes || '';
          let itemsSummary = 'Harvest Order';
          if (notes.includes('Items:')) {
            itemsSummary = notes.split('Items:')[1].trim();
          } else if (notes) {
            itemsSummary = notes;
          }

          return {
            id: o.id,
            order_number: o.order_number,
            customer_name: o.customer_name,
            phone: o.phone,
            email: o.email,
            order_date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            items_summary: itemsSummary,
            items_count: 1,
            subtotal: o.subtotal,
            shipping_amount: o.shipping_amount,
            total_amount: o.total_amount,
            status: o.status,
            payment_status: o.payment_status,
            delivery_address: o.delivery_address || {},
            courier_name: o.courier_name,
            tracking_number: o.tracking_number,
            dispatch_date: o.dispatch_date,
            notes: o.notes,
          };
        });
      useOrchardStore.setState({ orders: mappedOrders });
    }

    // 7. Fetch Inventory Logs
    const { data: dbInvLogs } = await supabase
      .from('inventory_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (dbInvLogs && dbInvLogs.length > 0) {
      useOrchardStore.setState({ inventoryLogs: dbInvLogs as any });
    }

    // 8. Fetch Activity Logs
    const { data: dbActLogs } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (dbActLogs && dbActLogs.length > 0) {
      useOrchardStore.setState({ activityLogs: dbActLogs as any });
    }

    return { success: true, message: 'Successfully synced all data from Supabase!' };
  } catch (err: any) {
    console.error('Error syncing from Supabase:', err);
    return { success: false, message: err.message || 'Unknown sync error' };
  }
}

/**
 * Seeds initial products, 100 trees, packaging materials, and journal posts
 * into a newly created Supabase database if tables are currently empty.
 */
export async function seedDatabaseToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isRealSupabaseConfigured()) {
    return { success: false, message: 'Please provide real Supabase credentials in .env first.' };
  }

  try {
    // 1. Seed Products if empty
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (prodCount === 0 || prodCount === null) {
      const productsToInsert = MOCK_PRODUCTS.map((p) => ({
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        short_description: p.short_description,
        price: p.price,
        compare_price: p.compare_price,
        weight_kg: p.weight_kg,
        mango_count: p.mango_count,
        min_weight_g: p.min_weight_g,
        is_bagged: p.is_bagged,
        stock_quantity: p.stock_quantity,
        is_available: p.is_available,
        sort_order: p.sort_order,
        seo_title: p.seo_title,
        seo_description: p.seo_description,
      }));
      await supabase.from('products').insert(productsToInsert as any);
    }

    // 2. Seed 100 Trees if empty
    const { count: treeCount } = await supabase.from('trees').select('*', { count: 'exact', head: true });
    if (treeCount === 0 || treeCount === null) {
      const treesToInsert = MOCK_TREES.map((t) => ({
        tree_id: t.tree_id,
        variety: t.variety,
        location_description: t.location_description,
        photo_url: t.photo_url,
        status: t.status,
        season: t.season,
        adoption_fee: t.adoption_fee,
        min_guarantee_kg: t.min_guarantee_kg,
        sort_order: t.sort_order,
        is_active: t.is_active,
      }));
      // Insert in chunks of 50 to avoid request size limits
      await supabase.from('trees').insert(treesToInsert.slice(0, 50) as any);
      await supabase.from('trees').insert(treesToInsert.slice(50) as any);
    }

    // 3. Seed Journal Articles if empty
    const { count: artCount } = await supabase.from('journal_articles').select('*', { count: 'exact', head: true });
    if (artCount === 0 || artCount === null) {
      const articlesToInsert = MOCK_JOURNAL_ARTICLES.map((a) => ({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        cover_image_url: a.cover_image_url,
        cover_image_alt: a.cover_image_alt,
        category: a.category,
        tags: a.tags,
        season: a.season,
        status: a.status,
        is_featured: a.is_featured,
        author_name: a.author_name,
        reading_time_min: a.reading_time_min,
        seo_title: a.seo_title,
        seo_description: a.seo_description,
        published_at: a.published_at,
      }));
      await supabase.from('journal_articles').insert(articlesToInsert as any);
    }

    // 4. Seed Packaging Inventory if empty
    const { count: packCount } = await supabase.from('packaging_inventory').select('*', { count: 'exact', head: true });
    if (packCount === 0 || packCount === null) {
      const packagingToInsert = [
        { name: '10 kg Heavy-Duty Corrugated Boxes', sku: 'BOX-10KG-STD', category: 'boxes', current_stock: 450, min_threshold: 100, unit: 'boxes' },
        { name: '10 kg Premium Ventilated Boxes (Gold Print)', sku: 'BOX-10KG-PREM', category: 'boxes', current_stock: 320, min_threshold: 80, unit: 'boxes' },
        { name: '12-Mango Luxury Rigid Gift Presentation Box', sku: 'BOX-12M-SIGN', category: 'boxes', current_stock: 180, min_threshold: 50, unit: 'boxes' },
        { name: 'Breathable Fruit Protection Bags (Double-Layer)', sku: 'BAG-FRUIT-PROT', category: 'bags', current_stock: 4500, min_threshold: 1000, unit: 'bags' },
        { name: 'Natural Soft Wood Wool Cushioning Material', sku: 'CUSH-WOOD-WOOL', category: 'cushioning', current_stock: 350, min_threshold: 80, unit: 'kg' },
        { name: 'Orchard Authenticity & Batch Inspection Labels', sku: 'LBL-AUTH-SEAL', category: 'labels', current_stock: 2800, min_threshold: 500, unit: 'labels' },
      ];
      await supabase.from('packaging_inventory').insert(packagingToInsert as any);
    }

    // Sync back
    await syncFromSupabase();

    return { success: true, message: 'Database seeded successfully with all products, 100 trees, articles, and packaging materials!' };
  } catch (err: any) {
    console.error('Error seeding Supabase database:', err);
    return { success: false, message: err.message || 'Seeding failed' };
  }
}
