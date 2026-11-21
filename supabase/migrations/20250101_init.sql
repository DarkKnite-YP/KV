-- Kesari Van Supabase Database Schema & Storage Setup
-- Consolidated Migration

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES ───
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 2. PRODUCTS ───
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  tagline text,
  description text not null,
  short_description text,
  price integer not null, -- in paise
  compare_price integer, -- in paise
  weight_kg numeric,
  mango_count integer,
  min_weight_g integer not null default 200,
  is_bagged boolean default false,
  stock_quantity integer not null default 0,
  is_available boolean default true,
  sort_order integer default 0,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 3. 100-TREE REGISTRY ───
create table if not exists public.trees (
  id uuid default uuid_generate_v4() primary key,
  tree_id text unique not null, -- KV-001 ... KV-100
  variety text not null default 'Gir Kesar',
  location_description text,
  photo_url text,
  status text not null default 'available' check (status in ('available', 'reserved', 'adopted', 'unavailable', 'maintenance')),
  season text not null default '2025',
  adoption_fee integer not null default 649900, -- in paise
  min_guarantee_kg integer not null default 25,
  adopter_name text,
  adopter_phone text,
  adopter_email text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 4. ADOPTIONS ───
create table if not exists public.adoptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  tree_id text references public.trees(tree_id) on delete restrict,
  adoption_number text unique not null,
  season text not null default '2025',
  status text not null default 'confirmed' check (status in ('pending_payment', 'confirmed', 'active', 'harvest_ready', 'fulfilled', 'cancelled')),
  payment_status text not null default 'captured' check (payment_status in ('pending', 'authorized', 'captured', 'failed', 'refund_initiated', 'refunded')),
  amount_paid integer not null,
  shipping_amount integer default 0,
  razorpay_order_id text,
  razorpay_payment_id text,
  plaque_name text,
  adopter_name text not null,
  contact_phone text not null,
  contact_email text,
  delivery_address jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 5. HARVEST ORDERS ───
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'preparing', 'dispatched', 'delivered', 'cancelled', 'refund_initiated', 'refunded')),
  payment_status text not null default 'captured' check (payment_status in ('pending', 'authorized', 'captured', 'failed', 'refund_initiated', 'refunded')),
  subtotal integer not null,
  shipping_amount integer not null default 0,
  total_amount integer not null,
  delivery_address jsonb not null,
  courier_name text,
  tracking_number text,
  dispatch_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 6. ORDER ITEMS ───
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price integer not null,
  total_price integer not null
);

-- ─── 7. ORCHARD VISIT REQUESTS ───
create table if not exists public.visit_requests (
  id uuid default uuid_generate_v4() primary key,
  request_number text unique not null,
  name text not null,
  phone text not null,
  email text,
  preferred_date date not null,
  number_of_visitors integer not null default 2,
  message text,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'confirmed', 'reschedule_requested', 'rescheduled', 'declined', 'cancelled', 'completed')),
  admin_notes text,
  cancelled_reason text,
  restored_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 8. JOURNAL CMS ───
create table if not exists public.journal_articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  subtitle text,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text not null,
  tags text[] default array[]::text[],
  season text,
  author_name text default 'Kesari Van Team',
  reading_time_min integer default 4,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 9. PACKAGING & INVENTORY ───
create table if not exists public.packaging_inventory (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sku text unique not null,
  category text not null, -- 'boxes', 'bags', 'cushioning', 'labels'
  current_stock integer not null default 0,
  min_threshold integer not null default 50,
  unit text not null default 'units',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 10. INVENTORY ADJUSTMENT LOGS ───
create table if not exists public.inventory_logs (
  id uuid default uuid_generate_v4() primary key,
  item_type text not null, -- 'product' or 'packaging'
  item_id text not null,
  item_name text not null,
  previous_quantity integer not null,
  new_quantity integer not null,
  adjustment integer not null,
  reason text not null,
  created_by text default 'Admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 11. ADMIN ACTIVITY LOGS ───
create table if not exists public.admin_activity_logs (
  id uuid default uuid_generate_v4() primary key,
  action text not null,
  target_type text not null, -- 'tree', 'product', 'order', 'visit', 'journal', 'inventory'
  target_id text not null,
  description text not null,
  previous_value text,
  new_value text,
  admin_user text default 'Admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── 12. STORAGE BUCKET CONFIGURATION ───
insert into storage.buckets (id, name, public)
values ('tree-adoptions', 'tree-adoptions', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('journal-media', 'journal-media', true)
on conflict (id) do nothing;

-- Storage RLS: Public read, authenticated upload
create policy "Public Access Tree Photos" on storage.objects
  for select using (bucket_id = 'tree-adoptions');

create policy "Admin Upload Tree Photos" on storage.objects
  for insert with check (bucket_id = 'tree-adoptions');

create policy "Public Access Journal Photos" on storage.objects
  for select using (bucket_id = 'journal-media');

create policy "Admin Upload Journal Photos" on storage.objects
  for insert with check (bucket_id = 'journal-media');

-- ─── 13. ROW LEVEL SECURITY (RLS) ───
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.trees enable row level security;
alter table public.adoptions enable row level security;
alter table public.orders enable row level security;
alter table public.visit_requests enable row level security;
alter table public.journal_articles enable row level security;
alter table public.packaging_inventory enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.admin_activity_logs enable row level security;

-- Public read for products, published journal, and active trees
create policy "Anyone can read available products" on public.products for select using (true);
create policy "Anyone can read trees" on public.trees for select using (true);
create policy "Anyone can read published journal" on public.journal_articles for select using (status = 'published');
create policy "Anyone can create visit requests" on public.visit_requests for insert with check (true);

