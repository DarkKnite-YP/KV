-- =========================================================================
-- Migration: Contact Enquiries Table, RLS Policies, & Clean Reset
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zpievxxzwexmtcarzjzf/sql/new
-- =========================================================================

-- 1. Create contact_enquiries table
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  category text NOT NULL DEFAULT 'General Questions',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'archived')),
  is_read boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_user_id ON public.contact_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON public.contact_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON public.contact_enquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any to prevent conflicts, then re-create
DROP POLICY IF EXISTS "Anyone can create contact enquiries" ON public.contact_enquiries;
DROP POLICY IF EXISTS "Anyone can select contact enquiries" ON public.contact_enquiries;
DROP POLICY IF EXISTS "Anyone can update contact enquiries" ON public.contact_enquiries;
DROP POLICY IF EXISTS "Anyone can delete contact enquiries" ON public.contact_enquiries;

CREATE POLICY "Anyone can create contact enquiries" ON public.contact_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can select contact enquiries" ON public.contact_enquiries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update contact enquiries" ON public.contact_enquiries
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete contact enquiries" ON public.contact_enquiries
  FOR DELETE USING (true);

-- 3. Comprehensive RLS for orders, order_items, visits, trees & logs
-- Orders
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can update order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can delete order_items" ON public.order_items;

CREATE POLICY "Anyone can read order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update order_items" ON public.order_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete order_items" ON public.order_items FOR DELETE USING (true);

-- Visit Requests
DROP POLICY IF EXISTS "Anyone can read visit_requests" ON public.visit_requests;
DROP POLICY IF EXISTS "Anyone can update visit_requests" ON public.visit_requests;
DROP POLICY IF EXISTS "Anyone can delete visit_requests" ON public.visit_requests;

CREATE POLICY "Anyone can read visit_requests" ON public.visit_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can update visit_requests" ON public.visit_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete visit_requests" ON public.visit_requests FOR DELETE USING (true);

-- Trees
DROP POLICY IF EXISTS "Anyone can update trees" ON public.trees;
CREATE POLICY "Anyone can update trees" ON public.trees FOR UPDATE USING (true) WITH CHECK (true);

-- Packaging Inventory
DROP POLICY IF EXISTS "Anyone can read packaging_inventory" ON public.packaging_inventory;
DROP POLICY IF EXISTS "Anyone can update packaging_inventory" ON public.packaging_inventory;
DROP POLICY IF EXISTS "Anyone can insert packaging_inventory" ON public.packaging_inventory;

CREATE POLICY "Anyone can read packaging_inventory" ON public.packaging_inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can update packaging_inventory" ON public.packaging_inventory FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert packaging_inventory" ON public.packaging_inventory FOR INSERT WITH CHECK (true);

-- Inventory & Admin Activity Logs
DROP POLICY IF EXISTS "Anyone can read inventory_logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "Anyone can insert inventory_logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "Anyone can read admin_activity_logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Anyone can insert admin_activity_logs" ON public.admin_activity_logs;

CREATE POLICY "Anyone can read inventory_logs" ON public.inventory_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert inventory_logs" ON public.inventory_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read admin_activity_logs" ON public.admin_activity_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert admin_activity_logs" ON public.admin_activity_logs FOR INSERT WITH CHECK (true);

-- 4. Clean Slate: Wipe all test orders, visits, logs, and enquiries
TRUNCATE TABLE 
  public.order_items, 
  public.orders, 
  public.adoptions,
  public.visit_requests, 
  public.inventory_logs, 
  public.admin_activity_logs,
  public.contact_enquiries
CASCADE;

-- 5. Reset all trees to fresh available state
UPDATE public.trees 
SET 
  status = 'available', 
  adopter_name = NULL, 
  adopter_phone = NULL, 
  adopter_email = NULL,
  updated_at = timezone('utc'::text, now());
