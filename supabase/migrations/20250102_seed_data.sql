-- Kesari Van Complete Database Seed & RLS Permissions
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/zpievxxzwexmtcarzjzf/sql/new

-- --- 1. EXTEND RLS POLICIES FOR OPERATIONAL ACTIONS ---
drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders" on public.orders for insert with check (true);

drop policy if exists "Anyone can insert order_items" on public.order_items;
create policy "Anyone can insert order_items" on public.order_items for insert with check (true);

drop policy if exists "Public can read orders" on public.orders;
create policy "Public can read orders" on public.orders for select using (true);

drop policy if exists "Public can read order_items" on public.order_items;
create policy "Public can read order_items" on public.order_items for select using (true);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update using (true);

drop policy if exists "Anyone can insert visit_requests" on public.visit_requests;
create policy "Anyone can insert visit_requests" on public.visit_requests for insert with check (true);

drop policy if exists "Public can read visit_requests" on public.visit_requests;
create policy "Public can read visit_requests" on public.visit_requests for select using (true);

drop policy if exists "Admins can update visit_requests" on public.visit_requests;
create policy "Admins can update visit_requests" on public.visit_requests for update using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert with check (true);

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update using (true);

drop policy if exists "Admins can insert trees" on public.trees;
create policy "Admins can insert trees" on public.trees for insert with check (true);

drop policy if exists "Admins can update trees" on public.trees;
create policy "Admins can update trees" on public.trees for update using (true);

drop policy if exists "Public can read packaging" on public.packaging_inventory;
create policy "Public can read packaging" on public.packaging_inventory for select using (true);

drop policy if exists "Admins can insert packaging" on public.packaging_inventory;
create policy "Admins can insert packaging" on public.packaging_inventory for insert with check (true);

drop policy if exists "Admins can update packaging" on public.packaging_inventory;
create policy "Admins can update packaging" on public.packaging_inventory for update using (true);

drop policy if exists "Public can read inventory_logs" on public.inventory_logs;
create policy "Public can read inventory_logs" on public.inventory_logs for select using (true);

drop policy if exists "Admins can insert inventory_logs" on public.inventory_logs;
create policy "Admins can insert inventory_logs" on public.inventory_logs for insert with check (true);

drop policy if exists "Public can read activity_logs" on public.admin_activity_logs;
create policy "Public can read activity_logs" on public.admin_activity_logs for select using (true);

drop policy if exists "Admins can insert activity_logs" on public.admin_activity_logs;
create policy "Admins can insert activity_logs" on public.admin_activity_logs for insert with check (true);

drop policy if exists "Admins can insert journal" on public.journal_articles;
create policy "Admins can insert journal" on public.journal_articles for insert with check (true);

drop policy if exists "Admins can update journal" on public.journal_articles;
create policy "Admins can update journal" on public.journal_articles for update using (true);

drop policy if exists "Admins can delete journal" on public.journal_articles;
create policy "Admins can delete journal" on public.journal_articles for delete using (true);

-- --- 2. SEED THE 3 MANGO BOX COLLECTIONS ---
insert into public.products (name, slug, tagline, description, short_description, price, compare_price, weight_kg, min_weight_g, is_bagged, stock_quantity, is_available, sort_order, seo_title, seo_description)
values
  ('Premium Kesar', 'premium-kesar', 'Classic Gir Kesar, uncompromised orchard quality.', 'Gir Kesar is revered as the Queen of Mangoes for its vivid saffron flesh, delicate fibrous balance, and intense tropical perfume. Grown in our Surat orchard from carefully nurtured trees, every mango is harvested only when maturity markers indicate natural readiness.

Our 10 kg Premium Kesar box is hand-graded to ensure individual mangoes meet or exceed the 200 g threshold. Shipped in cushioned ventilation packs to reach you in pristine ripening stage.', '10 kg collection of authentic Gir Kesar mangoes (200 g onwards). Naturally ripened, sweet and aromatic.', 265000, 300000, 10, 200, false, 45, true, 1, 'Premium Kesar Mango 10kg Box | Kesari Van', 'Order 10 kg Premium Gir Kesar mangoes directly from Kesari Van orchard in Surat.'),
  ('Golden Kesar', 'golden-kesar', 'Individually protected on the tree for flawless skin and supreme sweetness.', 'Golden Kesar represents the finest care our orchard provides. While still young on the branch, each selected mango is enclosed in a protective paper bag to shield it from harsh sunlight, pest strikes, and wind scuffs.

The result is immaculate golden skin, concentrated natural sugars, and velvety texture. Hand-sorted at a minimum of 250 g per fruit, this 10 kg box is the pride of our harvest.', '10 kg box of selected Gir Kesar mangoes (250 g onwards). Each fruit individually bagged on the branch for supreme quality.', 345000, 380000, 10, 250, true, 30, true, 2, 'Golden Kesar Mango 10kg Individually Bagged | Kesari Van', 'Golden Kesar 10 kg box with individual tree protection bags. 250g+ minimum size, pristine quality from Surat orchard.'),
  ('Signature Harvest', 'signature-harvest', '12 oversized gems reserved for true mango connoisseurs.', 'Crafted for the true mango lover and connoisseur, the Signature Harvest is our most exclusive collection. Fewer than 5% of all orchard mangoes reach this extraordinary weight class while retaining optimal sugar balance and firmness.

Each presentation box cradles 12 handpicked mangoes (300 g+ minimum each), nestled in sustainable molded pulp cradles. An unforgettable seasonal gift or family celebration centerpiece.', 'A curated gift box of 12 majestic Gir Kesar mangoes (300 g onwards). Handpicked from our most mature trees.', 205000, 240000, null, 300, true, 20, true, 3, 'Signature Harvest 12 Mangoes Box (300g+) | Kesari Van', 'Exclusive 12-mango box of giant Gir Kesar mangoes (300g+ each). The ultimate seasonal luxury from Kesari Van.')
on conflict (slug) do update set price = excluded.price, stock_quantity = excluded.stock_quantity, is_available = excluded.is_available;

-- --- 3. SEED PACKAGING & CRATE INVENTORY ---
insert into public.packaging_inventory (name, sku, category, current_stock, min_threshold, unit)
values
  ('10 kg Heavy-Duty Corrugated Boxes', 'BOX-10KG-STD', 'boxes', 450, 100, 'boxes'),
  ('10 kg Premium Ventilated Boxes (Gold Print)', 'BOX-10KG-PREM', 'boxes', 320, 80, 'boxes'),
  ('12-Mango Luxury Rigid Gift Presentation Box', 'BOX-12M-SIGN', 'boxes', 180, 50, 'boxes'),
  ('Breathable Fruit Protection Bags (Double-Layer)', 'BAG-FRUIT-PROT', 'bags', 4500, 1000, 'bags'),
  ('Natural Soft Wood Wool Cushioning Material', 'CUSH-WOOD-WOOL', 'cushioning', 350, 80, 'kg'),
  ('Orchard Authenticity & Batch Inspection Labels', 'LBL-AUTH-SEAL', 'labels', 2800, 500, 'labels')
on conflict (sku) do update set current_stock = excluded.current_stock;

-- --- 4. SEED 100-TREE REGISTRY (KV-001 to KV-100) ---
insert into public.trees (tree_id, variety, location_description, status, season, adoption_fee, min_guarantee_kg, sort_order, is_active)
values
  ('KV-001', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 1', 'available', 'Season 2025', 649900, 25, 1, true),
  ('KV-002', 'Gir Kesar', 'Central Canopy Grove � Row 1', 'available', 'Season 2025', 649900, 25, 2, true),
  ('KV-003', 'Gir Kesar', 'South Orchard Row � Row 1', 'available', 'Season 2025', 649900, 25, 3, true),
  ('KV-004', 'Gir Kesar', 'East Grove (North Canal) � Row 1', 'available', 'Season 2025', 649900, 25, 4, true),
  ('KV-005', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 1', 'adopted', 'Season 2025', 649900, 25, 5, true),
  ('KV-006', 'Gir Kesar', 'Central Canopy Grove � Row 1', 'available', 'Season 2025', 649900, 25, 6, true),
  ('KV-007', 'Gir Kesar', 'South Orchard Row � Row 1', 'reserved', 'Season 2025', 649900, 25, 7, true),
  ('KV-008', 'Gir Kesar', 'East Grove (North Canal) � Row 1', 'available', 'Season 2025', 649900, 25, 8, true),
  ('KV-009', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 1', 'adopted', 'Season 2025', 649900, 25, 9, true),
  ('KV-010', 'Gir Kesar', 'Central Canopy Grove � Row 1', 'available', 'Season 2025', 649900, 25, 10, true),
  ('KV-011', 'Gir Kesar', 'South Orchard Row � Row 2', 'available', 'Season 2025', 649900, 25, 11, true),
  ('KV-012', 'Gir Kesar', 'East Grove (North Canal) � Row 2', 'available', 'Season 2025', 649900, 25, 12, true),
  ('KV-013', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 2', 'available', 'Season 2025', 649900, 25, 13, true),
  ('KV-014', 'Gir Kesar', 'Central Canopy Grove � Row 2', 'available', 'Season 2025', 649900, 25, 14, true),
  ('KV-015', 'Gir Kesar', 'South Orchard Row � Row 2', 'adopted', 'Season 2025', 649900, 25, 15, true),
  ('KV-016', 'Gir Kesar', 'East Grove (North Canal) � Row 2', 'available', 'Season 2025', 649900, 25, 16, true),
  ('KV-017', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 2', 'reserved', 'Season 2025', 649900, 25, 17, true),
  ('KV-018', 'Gir Kesar', 'Central Canopy Grove � Row 2', 'available', 'Season 2025', 649900, 25, 18, true),
  ('KV-019', 'Gir Kesar', 'South Orchard Row � Row 2', 'adopted', 'Season 2025', 649900, 25, 19, true),
  ('KV-020', 'Gir Kesar', 'East Grove (North Canal) � Row 2', 'available', 'Season 2025', 649900, 25, 20, true),
  ('KV-021', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 3', 'available', 'Season 2025', 649900, 25, 21, true),
  ('KV-022', 'Gir Kesar', 'Central Canopy Grove � Row 3', 'available', 'Season 2025', 649900, 25, 22, true),
  ('KV-023', 'Gir Kesar', 'South Orchard Row � Row 3', 'available', 'Season 2025', 649900, 25, 23, true),
  ('KV-024', 'Gir Kesar', 'East Grove (North Canal) � Row 3', 'available', 'Season 2025', 649900, 25, 24, true),
  ('KV-025', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 3', 'adopted', 'Season 2025', 649900, 25, 25, true),
  ('KV-026', 'Gir Kesar', 'Central Canopy Grove � Row 3', 'available', 'Season 2025', 649900, 25, 26, true),
  ('KV-027', 'Gir Kesar', 'South Orchard Row � Row 3', 'reserved', 'Season 2025', 649900, 25, 27, true),
  ('KV-028', 'Gir Kesar', 'East Grove (North Canal) � Row 3', 'available', 'Season 2025', 649900, 25, 28, true),
  ('KV-029', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 3', 'adopted', 'Season 2025', 649900, 25, 29, true),
  ('KV-030', 'Gir Kesar', 'Central Canopy Grove � Row 3', 'available', 'Season 2025', 649900, 25, 30, true),
  ('KV-031', 'Gir Kesar', 'South Orchard Row � Row 4', 'available', 'Season 2025', 649900, 25, 31, true),
  ('KV-032', 'Gir Kesar', 'East Grove (North Canal) � Row 4', 'available', 'Season 2025', 649900, 25, 32, true),
  ('KV-033', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 4', 'available', 'Season 2025', 649900, 25, 33, true),
  ('KV-034', 'Gir Kesar', 'Central Canopy Grove � Row 4', 'available', 'Season 2025', 649900, 25, 34, true),
  ('KV-035', 'Gir Kesar', 'South Orchard Row � Row 4', 'adopted', 'Season 2025', 649900, 25, 35, true),
  ('KV-036', 'Gir Kesar', 'East Grove (North Canal) � Row 4', 'available', 'Season 2025', 649900, 25, 36, true),
  ('KV-037', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 4', 'reserved', 'Season 2025', 649900, 25, 37, true),
  ('KV-038', 'Gir Kesar', 'Central Canopy Grove � Row 4', 'available', 'Season 2025', 649900, 25, 38, true),
  ('KV-039', 'Gir Kesar', 'South Orchard Row � Row 4', 'adopted', 'Season 2025', 649900, 25, 39, true),
  ('KV-040', 'Gir Kesar', 'East Grove (North Canal) � Row 4', 'available', 'Season 2025', 649900, 25, 40, true),
  ('KV-041', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 5', 'available', 'Season 2025', 649900, 25, 41, true),
  ('KV-042', 'Gir Kesar', 'Central Canopy Grove � Row 5', 'available', 'Season 2025', 649900, 25, 42, true),
  ('KV-043', 'Gir Kesar', 'South Orchard Row � Row 5', 'available', 'Season 2025', 649900, 25, 43, true),
  ('KV-044', 'Gir Kesar', 'East Grove (North Canal) � Row 5', 'available', 'Season 2025', 649900, 25, 44, true),
  ('KV-045', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 5', 'adopted', 'Season 2025', 649900, 25, 45, true),
  ('KV-046', 'Gir Kesar', 'Central Canopy Grove � Row 5', 'available', 'Season 2025', 649900, 25, 46, true),
  ('KV-047', 'Gir Kesar', 'South Orchard Row � Row 5', 'reserved', 'Season 2025', 649900, 25, 47, true),
  ('KV-048', 'Gir Kesar', 'East Grove (North Canal) � Row 5', 'available', 'Season 2025', 649900, 25, 48, true),
  ('KV-049', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 5', 'adopted', 'Season 2025', 649900, 25, 49, true),
  ('KV-050', 'Gir Kesar', 'Central Canopy Grove � Row 5', 'available', 'Season 2025', 649900, 25, 50, true),
  ('KV-051', 'Gir Kesar', 'South Orchard Row � Row 6', 'available', 'Season 2025', 649900, 25, 51, true),
  ('KV-052', 'Gir Kesar', 'East Grove (North Canal) � Row 6', 'available', 'Season 2025', 649900, 25, 52, true),
  ('KV-053', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 6', 'available', 'Season 2025', 649900, 25, 53, true),
  ('KV-054', 'Gir Kesar', 'Central Canopy Grove � Row 6', 'available', 'Season 2025', 649900, 25, 54, true),
  ('KV-055', 'Gir Kesar', 'South Orchard Row � Row 6', 'adopted', 'Season 2025', 649900, 25, 55, true),
  ('KV-056', 'Gir Kesar', 'East Grove (North Canal) � Row 6', 'available', 'Season 2025', 649900, 25, 56, true),
  ('KV-057', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 6', 'reserved', 'Season 2025', 649900, 25, 57, true),
  ('KV-058', 'Gir Kesar', 'Central Canopy Grove � Row 6', 'available', 'Season 2025', 649900, 25, 58, true),
  ('KV-059', 'Gir Kesar', 'South Orchard Row � Row 6', 'adopted', 'Season 2025', 649900, 25, 59, true),
  ('KV-060', 'Gir Kesar', 'East Grove (North Canal) � Row 6', 'available', 'Season 2025', 649900, 25, 60, true),
  ('KV-061', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 7', 'available', 'Season 2025', 649900, 25, 61, true),
  ('KV-062', 'Gir Kesar', 'Central Canopy Grove � Row 7', 'available', 'Season 2025', 649900, 25, 62, true),
  ('KV-063', 'Gir Kesar', 'South Orchard Row � Row 7', 'available', 'Season 2025', 649900, 25, 63, true),
  ('KV-064', 'Gir Kesar', 'East Grove (North Canal) � Row 7', 'available', 'Season 2025', 649900, 25, 64, true),
  ('KV-065', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 7', 'adopted', 'Season 2025', 649900, 25, 65, true),
  ('KV-066', 'Gir Kesar', 'Central Canopy Grove � Row 7', 'available', 'Season 2025', 649900, 25, 66, true),
  ('KV-067', 'Gir Kesar', 'South Orchard Row � Row 7', 'reserved', 'Season 2025', 649900, 25, 67, true),
  ('KV-068', 'Gir Kesar', 'East Grove (North Canal) � Row 7', 'available', 'Season 2025', 649900, 25, 68, true),
  ('KV-069', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 7', 'adopted', 'Season 2025', 649900, 25, 69, true),
  ('KV-070', 'Gir Kesar', 'Central Canopy Grove � Row 7', 'available', 'Season 2025', 649900, 25, 70, true),
  ('KV-071', 'Gir Kesar', 'South Orchard Row � Row 8', 'available', 'Season 2025', 649900, 25, 71, true),
  ('KV-072', 'Gir Kesar', 'East Grove (North Canal) � Row 8', 'available', 'Season 2025', 649900, 25, 72, true),
  ('KV-073', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 8', 'available', 'Season 2025', 649900, 25, 73, true),
  ('KV-074', 'Gir Kesar', 'Central Canopy Grove � Row 8', 'available', 'Season 2025', 649900, 25, 74, true),
  ('KV-075', 'Gir Kesar', 'South Orchard Row � Row 8', 'adopted', 'Season 2025', 649900, 25, 75, true),
  ('KV-076', 'Gir Kesar', 'East Grove (North Canal) � Row 8', 'available', 'Season 2025', 649900, 25, 76, true),
  ('KV-077', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 8', 'reserved', 'Season 2025', 649900, 25, 77, true),
  ('KV-078', 'Gir Kesar', 'Central Canopy Grove � Row 8', 'available', 'Season 2025', 649900, 25, 78, true),
  ('KV-079', 'Gir Kesar', 'South Orchard Row � Row 8', 'adopted', 'Season 2025', 649900, 25, 79, true),
  ('KV-080', 'Gir Kesar', 'East Grove (North Canal) � Row 8', 'available', 'Season 2025', 649900, 25, 80, true),
  ('KV-081', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 9', 'available', 'Season 2025', 649900, 25, 81, true),
  ('KV-082', 'Gir Kesar', 'Central Canopy Grove � Row 9', 'available', 'Season 2025', 649900, 25, 82, true),
  ('KV-083', 'Gir Kesar', 'South Orchard Row � Row 9', 'available', 'Season 2025', 649900, 25, 83, true),
  ('KV-084', 'Gir Kesar', 'East Grove (North Canal) � Row 9', 'available', 'Season 2025', 649900, 25, 84, true),
  ('KV-085', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 9', 'adopted', 'Season 2025', 649900, 25, 85, true),
  ('KV-086', 'Gir Kesar', 'Central Canopy Grove � Row 9', 'available', 'Season 2025', 649900, 25, 86, true),
  ('KV-087', 'Gir Kesar', 'South Orchard Row � Row 9', 'reserved', 'Season 2025', 649900, 25, 87, true),
  ('KV-088', 'Gir Kesar', 'East Grove (North Canal) � Row 9', 'available', 'Season 2025', 649900, 25, 88, true),
  ('KV-089', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 9', 'adopted', 'Season 2025', 649900, 25, 89, true),
  ('KV-090', 'Gir Kesar', 'Central Canopy Grove � Row 9', 'available', 'Season 2025', 649900, 25, 90, true),
  ('KV-091', 'Gir Kesar', 'South Orchard Row � Row 10', 'available', 'Season 2025', 649900, 25, 91, true),
  ('KV-092', 'Gir Kesar', 'East Grove (North Canal) � Row 10', 'available', 'Season 2025', 649900, 25, 92, true),
  ('KV-093', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 10', 'available', 'Season 2025', 649900, 25, 93, true),
  ('KV-094', 'Gir Kesar', 'Central Canopy Grove � Row 10', 'available', 'Season 2025', 649900, 25, 94, true),
  ('KV-095', 'Gir Kesar', 'South Orchard Row � Row 10', 'adopted', 'Season 2025', 649900, 25, 95, true),
  ('KV-096', 'Gir Kesar', 'East Grove (North Canal) � Row 10', 'available', 'Season 2025', 649900, 25, 96, true),
  ('KV-097', 'Gir Kesar', 'West Grove (Ridge Walk) � Row 10', 'reserved', 'Season 2025', 649900, 25, 97, true),
  ('KV-098', 'Gir Kesar', 'Central Canopy Grove � Row 10', 'available', 'Season 2025', 649900, 25, 98, true),
  ('KV-099', 'Gir Kesar', 'South Orchard Row � Row 10', 'adopted', 'Season 2025', 649900, 25, 99, true),
  ('KV-100', 'Gir Kesar', 'East Grove (North Canal) � Row 10', 'available', 'Season 2025', 649900, 25, 100, true)
on conflict (tree_id) do update set status = excluded.status, location_description = excluded.location_description;

-- --- 5. SEED JOURNAL ARTICLES ---
insert into public.journal_articles (title, slug, excerpt, content, category, tags, season, status, is_featured, author_name, reading_time_min, published_at)
values
  ('The First Blossom: When Summer Begins in the Canopy', 'the-first-blossom', 'In late January, subtle pale green panicles emerge across the grove. Here is what flowering teaches us about the season ahead.', 'Every mango you will ever taste starts as an impossibly tiny flower panicle. Walking through the grove in late winter mornings, the fragrance is subtle�slightly resinous, sweet, and cool with dew.\n\nEach flower cluster may hold two to three thousand blossoms, but only a minute fraction will set fruit. This is not nature failing; it is nature self-regulating. The tree knows how much weight its branches can support.\n\nOur role during flowering is quiet observation and restraint. We keep the drip lines steady, nurture the soil biology, and let the pollinating insects do what they have perfected over millennia.', 'Orchard Updates', array['Flowering', 'Canopy', 'Seasonal Cycle'], 'Late Winter / Spring', 'published', true, 'Yash Patel', 4, '2025-02-05T08:00:00Z'),
  ('From Sugarcane to Canopy: The 2023 Transformation', 'from-sugarcane-to-canopy', 'Turning depleted industrial sugarcane land into a thriving, biodiverse mango orchard in Umbhel, Surat.', 'For decades, this land in Umbhel had been planted with sugarcane�a monoculture with heavy water demands and chemical dependencies that left the soil hard and compacted.\n\nIn October 2023, we made a decisive pivot. We broke the plow pan, incorporated tons of organic carbon and compost, laid precision subsurface drip lines, and planted over 900 young grafted Gir Kesar saplings.\n\nToday, the soil underfoot feels spongy, rich with earthworms, and capable of holding moisture effortlessly. An orchard is a promise made to the next decade.', 'Behind the Scenes', array['Origin', 'Soil Care', 'Vision'], 'Autumn 2023', 'published', false, 'Yash Patel', 5, '2025-01-20T10:00:00Z')
on conflict (slug) do nothing;
