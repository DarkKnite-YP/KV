/**
 * Client-side image compression & optimization utility for Kesari Van.
 * Supports WebP with JPEG fallback, targeting ~200-300 KB for mobile-friendly uploads.
 */

import { supabase } from './supabase';

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  targetSizeKB?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ blob: Blob; dataUrl: string; sizeKB: number }> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not initialize canvas context.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        const mimeType = canvas.toDataURL('image/webp').startsWith('data:image/webp')
          ? 'image/webp'
          : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Image compression failed.'));
            }
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const sizeKB = Math.round(blob.size / 1024);
            resolve({ blob, dataUrl, sizeKB });
          },
          mimeType,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image either to Supabase Storage bucket 'tree-adoptions'
 * or falls back to an optimized base64 data URL if Supabase credentials are placeholder.
 */
export async function uploadTreePhoto(
  treeId: string,
  file: File
): Promise<string> {
  const { blob, dataUrl } = await compressImage(file, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
  });

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isRealSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isRealSupabase) {
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const filePath = `trees/${treeId}/tree_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('tree-adoptions')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload failed, falling back to local image data:', uploadError);
      return dataUrl;
    }

    const { data } = supabase.storage.from('tree-adoptions').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Local fallback (stored directly into persistent state)
  return dataUrl;
}

