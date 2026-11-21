// Supabase Database Types — will be generated from Supabase CLI once DB is set up
// For now, manual type definitions matching the spec

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      product_media: {
        Row: ProductMedia;
        Insert: Omit<ProductMedia, 'id' | 'created_at'>;
        Update: Partial<Omit<ProductMedia, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'>;
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
      trees: {
        Row: Tree;
        Insert: Omit<Tree, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tree, 'id'>>;
      };
      adoptions: {
        Row: Adoption;
        Insert: Omit<Adoption, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Adoption, 'id'>>;
      };
      tree_reservations: {
        Row: TreeReservation;
        Insert: Omit<TreeReservation, 'id' | 'created_at'>;
        Update: Partial<Omit<TreeReservation, 'id'>>;
      };
      addresses: {
        Row: Address;
        Insert: Omit<Address, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Address, 'id'>>;
      };
      journal_articles: {
        Row: JournalArticle;
        Insert: Omit<JournalArticle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<JournalArticle, 'id'>>;
      };
      visit_requests: {
        Row: VisitRequest;
        Insert: Omit<VisitRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VisitRequest, 'id'>>;
      };
      contact_enquiries: {
        Row: ContactEnquiry;
        Insert: Omit<ContactEnquiry, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactEnquiry, 'id'>>;
      };
      faq_items: {
        Row: FAQItem;
        Insert: Omit<FAQItem, 'id' | 'created_at'>;
        Update: Partial<Omit<FAQItem, 'id'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CartItem, 'id'>>;
      };
      shipping_zones: {
        Row: ShippingZone;
        Insert: Omit<ShippingZone, 'id' | 'created_at'>;
        Update: Partial<Omit<ShippingZone, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      tree_status: TreeStatus;
      adoption_status: AdoptionStatus;
      visit_status: VisitStatus;
      article_status: ArticleStatus;
    };
  };
}

// ─── Enums ───

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'refund_initiated'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refund_initiated'
  | 'refunded';

export type TreeStatus = 'available' | 'reserved' | 'adopted' | 'maintenance' | 'temporarily_unavailable';

export type AdoptionStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'active'
  | 'harvest_ready'
  | 'fulfilled'
  | 'cancelled';

export type VisitStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'declined'
  | 'completed'
  | 'cancelled';

export type ArticleStatus = 'draft' | 'published' | 'archived';

// ─── Row Types ───

export interface Profile {
  id: string; // references auth.users
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  short_description: string | null;
  price: number; // in paise
  compare_price: number | null;
  weight_kg: number | null;
  box_weight_kg?: number | null;
  mango_count: number | null;
  piece_count?: number | null;
  min_weight_g: number;
  min_mango_weight_g?: number;
  is_bagged: boolean;
  stock_quantity: number;
  is_available: boolean;
  is_featured?: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  collection_type?: string | null;
  quantity?: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  shipping_address: Record<string, unknown>;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  weight_kg: number | null;
  mango_count: number | null;
}

export interface Tree {
  id: string;
  tree_id: string; // KV-001, KV-002...
  variety: string;
  location_description: string | null;
  photo_url: string | null;
  status: TreeStatus;
  season: string; // e.g. "2024"
  adoption_fee: number; // in paise
  min_guarantee_kg: number;
  sort_order: number;
  is_active: boolean;
  adopter_info?: {
    name: string;
    phone: string;
    email?: string;
  } | null;
  adopter_name?: string | null;
  adopter_phone?: string | null;
  adopter_email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TreeReservation {
  id: string;
  tree_id: string;
  user_id: string;
  session_id: string | null;
  expires_at: string;
  status: 'active' | 'expired' | 'converted' | 'released';
  created_at: string;
}

export interface Adoption {
  id: string;
  user_id: string;
  tree_id: string;
  adoption_number: string;
  season: string;
  status: AdoptionStatus;
  payment_status: PaymentStatus;
  amount_paid: number;
  shipping_amount: number | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  terms_accepted_at: string | null;
  terms_version: string | null;
  harvest_kg: number | null;
  shipping_address: Record<string, unknown> | null;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // rich text / markdown
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string;
  tags: string[];
  season: string | null;
  status: ArticleStatus;
  is_featured: boolean;
  author_name: string | null;
  reading_time_min: number | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitRequest {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  number_of_visitors: number;
  message: string | null;
  status: VisitStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactEnquiry {
  id: string;
  reference_number: string;
  user_id?: string | null;
  name: string;
  phone: string;
  email: string | null;
  category: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded' | 'archived';
  is_read: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingZone {
  id: string;
  state: string;
  pincodes: string[] | null; // null = all pincodes in state
  base_rate: number;
  per_kg_rate: number;
  is_serviceable: boolean;
  estimated_days_min: number;
  estimated_days_max: number;
  created_at: string;
}

