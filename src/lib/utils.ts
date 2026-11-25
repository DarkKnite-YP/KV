import { type ClassValue, clsx } from 'clsx';

// Simple clsx implementation (no need for tailwind-merge for this project size)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format price from paise to ₹ display */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/** Format date for display */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

/** Format date short */
export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

/** Generate a simple slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Estimate reading time */
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/** Generate order number */
export function generateOrderNumber(): string {
  const date = new Date();
  const prefix = 'KV';
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${random}`;
}

/** Validate Indian PIN code */
export function isValidPincode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin);
}

/** Validate Indian mobile number */
export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ''));
}

/**
 * Normalize tree photos from either `photos` array or `photo_url` (including JSON-encoded arrays).
 */
export function getTreePhotos(tree?: { photo_url?: string | null; photos?: string[] | null } | null): string[] {
  if (!tree) return [];
  if (Array.isArray(tree.photos) && tree.photos.length > 0) {
    return tree.photos.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
  }
  const raw = tree.photo_url?.trim();
  if (!raw) return [];
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
      }
    } catch {
      // fall through to single URL
    }
  }
  return [raw];
}

