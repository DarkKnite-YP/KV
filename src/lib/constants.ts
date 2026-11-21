// ─── Navigation ───
export const NAV_ITEMS = [
  { label: 'Shop Mangoes', href: '/shop' },
  { label: 'Our Orchard', href: '/orchard' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Adopt a Tree', href: '/adopt-a-tree' },
  { label: 'Journal', href: '/journal' },
] as const;

// ─── Footer links ───
export const FOOTER_LINKS = {
  explore: [
    { label: 'Shop Mangoes', href: '/shop' },
    { label: 'Our Orchard', href: '/orchard' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Farming Practices', href: '/farming-practices' },
    { label: 'Adopt a Tree', href: '/adopt-a-tree' },
    { label: 'Journal', href: '/journal' },
  ],
  connect: [
    { label: 'Visit', href: '/visit' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  policies: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Tree Adoption Terms', href: '/adoption-terms' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Cancellation & Refund', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
} as const;

// ─── Brand ───
export const BRAND = {
  name: 'Kesari Van',
  tagline: 'Connect with the Soil.',
  location: 'Umbhel, Kamrej, Surat, Gujarat, India',
  domain: 'kesarivan.in',
  variety: 'Gir Kesar',
  treeCount: '900+',
  adoptionTreeCount: 100,
  adoptionPrice: 649900, // paise
  adoptionGuaranteeKg: 25,
} as const;

// ─── Brand Phrases ───
export const BRAND_PHRASES = {
  connectWithSoil: 'Connect with the Soil.',
  gatesOpen: 'Our gates are as open as our process.',
  summerWaiting: 'A summer worth waiting for.',
  notJustFarm: "It's not just a farm; it's an experience.",
  closerToNature:
    'A little closer to nature. A little closer to where your food comes from.',
} as const;

// ─── Order Status Labels ───
export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Order Confirmed',
  preparing: 'Preparing',
  dispatched: 'On Its Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refund_initiated: 'Refund Initiated',
  refunded: 'Refunded',
} as const;

// ─── Tree Adoption Status Labels ───
export const ADOPTION_STATUS_LABELS = {
  pending_payment: 'Payment Pending',
  confirmed: 'Confirmed',
  active: 'Active',
  harvest_ready: 'Harvest Ready',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
} as const;

// ─── Visit Status Labels ───
export const VISIT_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  declined: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

// ─── Journal Categories ───
export const JOURNAL_CATEGORIES = [
  'All Stories',
  'Orchard Updates',
  'Growing Mangoes',
  'Farming Practices',
  'Life at Kesari Van',
  'Behind the Scenes',
] as const;

// ─── FAQ Categories ───
export const FAQ_CATEGORIES = [
  'All',
  'Mangoes',
  'Orders & Delivery',
  'Tree Adoption',
  'Orchard Visits',
  'Payments',
] as const;

// ─── Contact Categories ───
export const CONTACT_CATEGORIES = [
  'Mango Orders',
  'Tree Adoption',
  'Orchard Visits',
  'General Questions',
  'Other',
] as const;

// ─── Shipping States ───
export const SERVICEABLE_STATES = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Madhya Pradesh',
] as const;

// ─── Mango Varieties ───
export const MANGO_VARIETIES = [
  'Kesar',
  'Sonpari',
  'Totapuri',
  'Alphonso',
  'Rajapuri',
] as const;

