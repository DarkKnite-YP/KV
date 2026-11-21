import type { Product, Tree, JournalArticle, FAQItem } from '../types/database';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Premium Kesar',
    slug: 'premium-kesar',
    tagline: 'Classic Gir Kesar, uncompromised orchard quality.',
    short_description: '10 kg collection of authentic Gir Kesar mangoes (200 g onwards). Naturally ripened, sweet and aromatic.',
    description: `Gir Kesar is revered as the Queen of Mangoes for its vivid saffron flesh, delicate fibrous balance, and intense tropical perfume. Grown in our Surat orchard from carefully nurtured trees, every mango is harvested only when maturity markers indicate natural readiness.

Our 10 kg Premium Kesar box is hand-graded to ensure individual mangoes meet or exceed the 200 g threshold. Shipped in cushioned ventilation packs to reach you in pristine ripening stage.`,
    price: 240000, // ₹2,400 in paise
    compare_price: 280000,
    weight_kg: 10,
    mango_count: null,
    min_weight_g: 200,
    is_bagged: false,
    stock_quantity: 45,
    is_available: true,
    sort_order: 1,
    seo_title: 'Premium Kesar Mango 10kg Box | Kesari Van',
    seo_description: 'Order 10 kg Premium Gir Kesar mangoes directly from Kesari Van orchard in Surat. 200g+ grade, naturally harvested.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Golden Kesar',
    slug: 'golden-kesar',
    tagline: 'Individually protected on the tree for flawless skin and supreme sweetness.',
    short_description: '10 kg box of selected Gir Kesar mangoes (250 g onwards). Each fruit individually bagged on the branch for supreme quality.',
    description: `Golden Kesar represents the finest care our orchard provides. While still young on the branch, each selected mango is enclosed in a protective paper bag to shield it from harsh sunlight, pest strikes, and wind scuffs. 

The result is immaculate golden skin, concentrated natural sugars, and velvety texture. Hand-sorted at a minimum of 250 g per fruit, this 10 kg box is the pride of our harvest.`,
    price: 320000, // ₹3,200 in paise
    compare_price: 360000,
    weight_kg: 10,
    mango_count: null,
    min_weight_g: 250,
    is_bagged: true,
    stock_quantity: 30,
    is_available: true,
    sort_order: 2,
    seo_title: 'Golden Kesar Mango 10kg Individually Bagged | Kesari Van',
    seo_description: 'Golden Kesar 10 kg box with individual tree protection bags. 250g+ minimum size, pristine quality from Surat orchard.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Signature Harvest',
    slug: 'signature-harvest',
    tagline: '12 oversized gems reserved for true mango connoisseurs.',
    short_description: 'A curated gift box of 12 majestic Gir Kesar mangoes (300 g onwards). Handpicked from our most mature trees.',
    description: `Crafted for the true mango lover and connoisseur, the Signature Harvest is our most exclusive collection. Fewer than 5% of all orchard mangoes reach this extraordinary weight class while retaining optimal sugar balance and firmness.

Each presentation box cradles 12 handpicked mangoes (300 g+ minimum each), nestled in sustainable molded pulp cradles. An unforgettable seasonal gift or family celebration centerpiece.`,
    price: 180000, // ₹1,800 in paise
    compare_price: 210000,
    weight_kg: null,
    mango_count: 12,
    min_weight_g: 300,
    is_bagged: true,
    stock_quantity: 20,
    is_available: true,
    sort_order: 3,
    seo_title: 'Signature Harvest 12 Mangoes Box (300g+) | Kesari Van',
    seo_description: 'Exclusive 12-mango box of giant Gir Kesar mangoes (300g+ each). The ultimate seasonal luxury from Kesari Van.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate 100 authentic sample trees for the adoption program (all 100 initially available)
export const MOCK_TREES: Tree[] = Array.from({ length: 100 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  const treeId = `KV-${num}`;
  const block = ['Block A (North Canal)', 'Block B (East Ridge)', 'Block C (Central Orchard)', 'Block D (South Grove)'][i % 4];

  return {
    id: `tree-uuid-${num}`,
    tree_id: treeId,
    variety: 'Gir Kesar',
    location_description: `${block} · Row ${Math.floor(i / 10) + 1}`,
    photo_url: `/images/trees/tree-${(i % 8) + 1}.jpg`,
    status: 'available' as const,
    season: '2025',
    adoption_fee: 649900, // ₹6,499
    min_guarantee_kg: 25,
    sort_order: i + 1,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
  };
});

export const MOCK_JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-01',
    title: 'The First Blossom: When Summer Begins in the Canopy',
    slug: 'the-first-blossom',
    excerpt: 'In late January, subtle pale green panicles emerge across the grove. Here is what flowering teaches us about the season ahead.',
    content: `Every mango you will ever taste starts as an impossibly tiny flower panicle. Walking through the grove in late winter mornings, the fragrance is subtle—slightly resinous, sweet, and cool with dew.

Each flower cluster may hold two to three thousand blossoms, but only a minute fraction will set fruit. This is not nature failing; it is nature self-regulating. The tree knows how much weight its branches can support.

Our role during flowering is quiet observation and restraint. We keep the drip lines steady, nurture the soil biology, and let the pollinating insects do what they have perfected over millennia.`,
    cover_image_url: '/images/journal/blossom.jpg',
    cover_image_alt: 'Mango blossoms in morning light at Kesari Van',
    category: 'Orchard Updates',
    tags: ['Flowering', 'Canopy', 'Seasonal Cycle'],
    season: 'Late Winter / Spring',
    status: 'published',
    is_featured: true,
    author_name: 'Yash Patel',
    reading_time_min: 4,
    seo_title: 'The First Blossom — Notes from Kesari Van',
    seo_description: 'Discover the flowering season at Kesari Van mango orchard in Surat, and how blossoms transform into Gir Kesar mangoes.',
    published_at: '2025-02-05T08:00:00Z',
    created_at: '2025-02-05T08:00:00Z',
    updated_at: '2025-02-05T08:00:00Z',
  },
  {
    id: 'journal-02',
    title: 'From Sugarcane to Canopy: The 2023 Transformation',
    slug: 'from-sugarcane-to-canopy',
    excerpt: 'Turning depleted industrial sugarcane land into a thriving, biodiverse mango orchard in Umbhel, Surat.',
    content: `For decades, this land in Umbhel had been planted with sugarcane—a monoculture with heavy water demands and chemical dependencies that left the soil hard and compacted.

In October 2023, we made a decisive pivot. We broke the plow pan, incorporated tons of organic carbon and compost, laid precision subsurface drip lines, and planted over 900 young grafted Gir Kesar saplings.

Today, the soil underfoot feels spongy, rich with earthworms, and capable of holding moisture effortlessly. An orchard is a promise made to the next decade.`,
    cover_image_url: '/images/journal/planting.jpg',
    cover_image_alt: 'Young mango trees planted in Surat soil',
    category: 'Behind the Scenes',
    tags: ['Origin', 'Soil Care', 'Vision'],
    season: 'Autumn 2023',
    status: 'published',
    is_featured: false,
    author_name: 'Yash Patel',
    reading_time_min: 5,
    seo_title: 'From Sugarcane to Canopy — Kesari Van Story',
    seo_description: 'How Kesari Van converted former sugarcane fields in Kamrej, Surat into a living mango orchard in October 2023.',
    published_at: '2025-01-20T10:00:00Z',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'journal-03',
    title: 'Why We Wrap Each Fruit in Individual Bags',
    slug: 'why-we-bag-fruit',
    excerpt: 'The patient art of bagging fruit on the branch. Why physical protection surpasses spraying every single time.',
    content: `When fruit reaches marble size, we climb ladders with bundles of specialized breathable paper bags. Each promising mango is individually enclosed and tied to the branch.

It is labor-intensive, slow work. But it accomplishes three remarkable things:
1. Complete barrier against fruit flies without chemical sprays.
2. Protection against searing afternoon ultraviolet sun-scald.
3. Natural, even microclimate that develops that immaculate golden-apricot blush Gir Kesar is famed for.`,
    cover_image_url: '/images/journal/bagging.jpg',
    cover_image_alt: 'Worker bagging individual mangoes on the branch',
    category: 'Farming Practices',
    tags: ['Protection', 'Farming', 'Quality'],
    season: 'Mid Spring',
    status: 'published',
    is_featured: false,
    author_name: 'Kesari Van Team',
    reading_time_min: 3,
    seo_title: 'Why Individual Fruit Bagging Makes Better Mangoes | Kesari Van',
    seo_description: 'Learn how protective fruit bags elevate the sweetness, aroma, and purity of Kesari Van Golden Kesar mangoes.',
    published_at: '2025-01-10T09:00:00Z',
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-10T09:00:00Z',
  },
  {
    id: 'journal-04',
    title: 'The Geometry of Pruning: Teaching Trees How to Breathe',
    slug: 'the-geometry-of-pruning',
    excerpt: 'Cutting away healthy wood feels counter-intuitive, until you realize sunlight needs an open hallway right down to the trunk.',
    content: `Unchecked, a mango tree becomes a dense dome of leaves. While green and lush, the interior turns into a shaded, humid cavern where sunlight cannot penetrate and fungal diseases thrive.

Post-harvest pruning creates an open-center canopy. Sunlight filters down like dappled lace, airflow dries morning moisture quickly, and incoming energy is channeled into fewer, far larger fruits.`,
    cover_image_url: '/images/journal/pruning.jpg',
    cover_image_alt: 'Sunlight filtering through pruned mango canopy',
    category: 'Farming Practices',
    tags: ['Pruning', 'Tree Health'],
    season: 'Post Harvest',
    status: 'published',
    is_featured: false,
    author_name: 'Kesari Van Team',
    reading_time_min: 4,
    seo_title: 'The Art of Mango Tree Pruning — Kesari Van',
    seo_description: 'Understanding canopy pruning for airflow, solar interception, and premium Gir Kesar fruit size.',
    published_at: '2024-12-15T11:00:00Z',
    created_at: '2024-12-15T11:00:00Z',
    updated_at: '2024-12-15T11:00:00Z',
  },
  {
    id: 'journal-05',
    title: 'Gir Kesar in South Gujarat: What Makes Our Soil Special',
    slug: 'gir-kesar-in-south-gujarat',
    excerpt: 'Clarifying why Gir Kesar thrives so magnificently in the black alluvial soil of the Tapi basin in Kamrej, Surat.',
    content: `Gir Kesar originates from the Saurashtra foothills of Junagadh and Gir. But the deep, fertile clay-loam soils of Kamrej, nourished by the historic Tapi river delta, provide a unique terroir.

Here, abundant subsoil moisture combined with intense maritime sunshine yields a fruit of exceptional density and a lingering saffron aroma. We never disguise our location—we are proudly growing Gir Kesar right here in Surat.`,
    cover_image_url: '/images/journal/soil.jpg',
    cover_image_alt: 'Dark rich soil at Kesari Van orchard',
    category: 'Growing Mangoes',
    tags: ['Terroir', 'Surat', 'Gir Kesar'],
    season: 'Winter',
    status: 'published',
    is_featured: false,
    author_name: 'Yash Patel',
    reading_time_min: 4,
    seo_title: 'Growing Gir Kesar in Surat Soil — Kesari Van',
    seo_description: 'Why the Kamrej, Surat terroir creates exceptionally aromatic, luscious Gir Kesar mangoes.',
    published_at: '2024-11-28T09:30:00Z',
    created_at: '2024-11-28T09:30:00Z',
    updated_at: '2024-11-28T09:30:00Z',
  },
  {
    id: 'journal-06',
    title: 'Welcoming Guests: When the Orchard Gates Open',
    slug: 'welcoming-guests-to-the-orchard',
    excerpt: 'Why we open our gates for confirmed visits and what people discover when walking between real working rows.',
    content: `When guests step out of their vehicles and step onto the orchard soil, the first thing they notice is the quiet. No highway hum, no artificial tourist gimmicks.

We don't offer manicured theme parks or tourist rides. We offer a walk beneath real living trees, soil under your boots, and honest conversations about where summer flavor actually comes from.`,
    cover_image_url: '/images/journal/visit.jpg',
    cover_image_alt: 'Visitors walking quietly through mango orchard rows',
    category: 'Life at Kesari Van',
    tags: ['Visits', 'Community', 'Experience'],
    season: 'Spring',
    status: 'published',
    is_featured: false,
    author_name: 'Kesari Van Team',
    reading_time_min: 3,
    seo_title: 'Orchard Visits at Kesari Van Surat — Real Farm Experience',
    seo_description: 'Experience Kesari Van in person. Prior appointment farm visits in Kamrej, Surat.',
    published_at: '2024-11-10T14:00:00Z',
    created_at: '2024-11-10T14:00:00Z',
    updated_at: '2024-11-10T14:00:00Z',
  },
];

export const MOCK_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Are your mangoes certified organic?',
    answer: 'No, we do not claim to be certified organic. We practice conscious, responsible soil-care, drip irrigation, balanced pruning, and physical fruit protection bags. We prioritize soil biology and transparent growing practices over marketing labels.',
    category: 'Mangoes',
    sort_order: 1,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-2',
    question: 'Where is the orchard located? Is it in Gir?',
    answer: 'Kesari Van is located in Umbhel, Kamrej, Surat, Gujarat. We cultivate authentic Gir Kesar saplings in the fertile black loam of South Gujarat. We do not claim the orchard is located in Gir.',
    category: 'Mangoes',
    sort_order: 2,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-3',
    question: 'Which states and regions do you deliver to?',
    answer: 'We currently deliver fresh harvest boxes across Gujarat, Maharashtra, Rajasthan, and Madhya Pradesh, subject to local courier PIN serviceability. Shipping is calculated separately based on destination PIN.',
    category: 'Orders & Delivery',
    sort_order: 3,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-4',
    question: 'How does the Tree Adoption guarantee work?',
    answer: 'When you adopt a tree for ₹6,499 for the season, you are guaranteed a minimum harvest of 25 kg of fresh Gir Kesar mangoes. Any eligible surplus yield beyond the 25 kg guarantee produced by your tree also belongs to you. Courier shipping charges are billed separately prior to dispatch.',
    category: 'Tree Adoption',
    sort_order: 4,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-5',
    question: 'Can I visit my adopted tree in person?',
    answer: 'Yes! All tree adopters and guests are welcome to visit by prior request and schedule confirmation. Because this is an active working orchard with seasonal farming activities, visits must be arranged in advance.',
    category: 'Orchard Visits',
    sort_order: 5,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-6',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major secure payment methods via Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards, Net Banking, and verified digital wallets. We do not store your financial payment credentials.',
    category: 'Payments',
    sort_order: 6,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-7',
    question: 'How do I ripen my Gir Kesar mangoes when they arrive?',
    answer: 'Our mangoes are harvested at mature raw stage and sent cushioned in natural ventilation boxes. Keep them at room temperature in a dry, ventilated corner away from direct sunlight. Do not refrigerate until fully ripe and fragrant.',
    category: 'Mangoes',
    sort_order: 7,
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: 'faq-8',
    question: 'What happens if a box arrives damaged during transit?',
    answer: 'Perishable fruit demands utmost courier care, but disruptions can occasionally occur. If your shipment arrives damaged, notify us within 24 hours of delivery with photos of the package and fruit. We review promptly and provide a fair refund or replacement under our policy.',
    category: 'Orders & Delivery',
    sort_order: 8,
    is_active: true,
    created_at: '2025-01-01',
  },
];

