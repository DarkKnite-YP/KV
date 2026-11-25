-- =========================================================================
-- Migration: Add multiple photos support (photos jsonb array) to trees table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zpievxxzwexmtcarzjzf/sql/new
-- =========================================================================

ALTER TABLE public.trees
ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.trees.photos IS 'Ordered array of tree image URLs / compressed data URIs';

-- Backfill existing single photo_url into photos array if empty
UPDATE public.trees
SET photos = CASE
  WHEN photo_url IS NOT NULL AND photo_url LIKE '[%' THEN photo_url::jsonb
  WHEN photo_url IS NOT NULL AND photo_url <> '' THEN jsonb_build_array(photo_url)
  ELSE '[]'::jsonb
END
WHERE photos IS NULL OR jsonb_array_length(photos) = 0;
