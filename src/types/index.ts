import type { Product } from './database';
export * from './database';

// ─── Frontend-specific types ───

export interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    weight_kg: number | null;
    mango_count: number | null;
    min_weight_g: number;
    is_bagged: boolean;
    stock_quantity: number;
    is_available: boolean;
    image_url: string | null;
    short_description: string | null;
  };
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  copy?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  className?: string;
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'cream' | 'sage' | 'white' | 'forest' | 'green';
  padding?: 'default' | 'small' | 'large' | 'none';
}

export interface ProductCardProps {
  product: Product;
  primaryImage?: string;
}

