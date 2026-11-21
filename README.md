# Kesari Van — Authentic Gir Kesar Mango Orchard Platform

> Handcrafted digital home, e-commerce, and 100-Tree Adoption Registry for **Kesari Van**, located in Umbhel, Kamrej, Surat, Gujarat.

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌿 Overview

Kesari Van is an artisanal mango farm producing authentic Gir Kesar mangoes in the fertile alluvial soil of the Tapi river basin in Surat. This application powers:
1. **Seasonal Mango Box Commerce**: Direct-to-consumer pre-orders for the 3 signature harvest collections:
   - *Premium Kesar* (10 kg, 200 g+ minimum)
   - *Golden Kesar* (10 kg, 250 g+, individually bagged on tree)
   - *Signature Harvest* (12 oversized connoisseur mangoes, 300 g+)
2. **100-Tree Adoption Registry**: Interactive grove map & registry enabling customers to adopt individual trees with a guaranteed 25 kg minimum harvest and weekly WhatsApp updates.
3. **Farm Visit Scheduling**: Prior-appointment visit booking engine to walk the grove and inspect soil care.
4. **Journal & Orchard Stories**: Farm updates, flowering reports, and agricultural insights.
5. **Central Operations Admin Panel**: Real-time management of orders, trees, products, packaging inventory, pricing tiers, and activity logs.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom Kesari Van brand design system:
  - *Orchard Green* (`#344B36`), *Deep Forest* (`#243629`), *Dawn Gold* (`#D6A64B`), *Mango Cream* (`#F7F2E8`), *Soil Bark* (`#806247`), *Soft Sage* (`#DCE4D6`), *Deep Charcoal* (`#292A25`)
  - *Cormorant Garamond* (editorial headings) & *Manrope* (functional body)
- **State Management**: Zustand with persistent storage and hydration
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Storage)
- **Icons**: Lucide React
- **Payments**: Razorpay gateway checkout integration ready

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/DarkKnite-YP/KV.git
cd KV
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Razorpay (public key only)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 4. Database Setup (Supabase)
Run the SQL migration files located in `supabase/migrations/` in your Supabase SQL Editor in numerical order:
1. `20250101_initial_schema.sql` — Tables, relationships, RLS, and indexes
2. `20250102_seed_data.sql` — Active product catalog, 100-tree registry, packaging stock, and RLS policies
3. `20250103_auth_trigger.sql` — Auto-creates profile records in `public.profiles` on user signup

### 5. Running Locally
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```
kesari-van/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication modal & forms
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── shop/           # Product cards, cart drawer
│   │   └── ui/             # Buttons, Cards, Inputs, Badges, SEO
│   ├── lib/                # Supabase client, utils, constants, mock fallback
│   ├── pages/              # Routed pages
│   │   ├── account/        # Customer account, orders, tree tracking
│   │   ├── admin/          # Comprehensive Admin Control Center
│   │   ├── adopt/          # 100-Tree selection & checkout
│   │   ├── journal/        # Journal articles & stories
│   │   └── shop/           # Catalog, detail pages, checkout
│   ├── stores/             # Zustand stores (orchardStore, authStore, cartStore)
│   └── types/              # TypeScript database models
├── supabase/
│   └── migrations/         # Supabase SQL schemas and migration scripts
└── package.json
```

---

## 🔒 Security & Privacy

- Environment variables containing sensitive credentials (`.env`) are excluded from git tracking.
- Row-level security (RLS) policies restrict database operations while permitting public reading of products and available trees.
- Admin views and management operations are secured.

---

## 📜 License

Private repository for Kesari Van. All rights reserved.
