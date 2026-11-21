-- =========================================================================
-- Migration: Add collection_type and quantity to orders table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zpievxxzwexmtcarzjzf/sql/new
-- =========================================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS collection_type TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

COMMENT ON COLUMN public.orders.collection_type IS 'Type of mango collection purchased (e.g. Golden Kesar, Signature Harvest, Premium Kesar)';
COMMENT ON COLUMN public.orders.quantity IS 'Total quantity of boxes ordered';

-- Backfill existing orders with collection details
UPDATE public.orders
SET 
  collection_type = COALESCE(
    (SELECT string_agg(product_name, ', ') FROM public.order_items WHERE order_items.order_id = orders.id),
    CASE 
      WHEN notes ILIKE '%Signature Harvest%' THEN 'Signature Harvest'
      WHEN notes ILIKE '%Golden Kesar%' THEN 'Golden Kesar'
      WHEN notes ILIKE '%Premium Kesar%' THEN 'Premium Kesar'
      ELSE 'Gir Kesar Mangoes'
    END
  ),
  quantity = COALESCE(
    (SELECT sum(order_items.quantity)::integer FROM public.order_items WHERE order_items.order_id = orders.id),
    CASE 
      WHEN notes ILIKE '%2x%' THEN 2
      WHEN notes ILIKE '%3x%' THEN 3
      ELSE 1
    END
  )
WHERE collection_type IS NULL;
