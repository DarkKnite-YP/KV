import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  let fullTitle: string;

  if (
    !title ||
    title === 'Kesari Van Mangoes' ||
    title === 'Kesari Van' ||
    title.toLowerCase().includes('gir kesar mangoes grown in surat')
  ) {
    fullTitle = 'Kesari Van Mangoes';
  } else {
    let clean = title
      .replace(/^Kesari Van\s*[|—–-]\s*/i, '')
      .replace(/\s*[|—–-]\s*Kesari Van.*$/i, '')
      .trim();

    if (clean.includes(' — ')) {
      clean = clean.split(' — ')[0].trim();
    }
    if (clean.startsWith('Contact Kesari Van')) {
      clean = 'Contact';
    }
    if (clean.startsWith('Visit Kesari Van')) {
      clean = 'Visit Orchard';
    }
    if (clean.includes('Frequently Asked Questions')) {
      clean = 'FAQ';
    }
    if (clean.includes('Cancellation & Refund Policy')) {
      clean = 'Refund Policy';
    }
    if (clean.includes('Shipping & Delivery Policy')) {
      clean = 'Shipping Policy';
    }
    if (clean.includes('Admin Portal')) {
      clean = 'Admin Portal';
    }

    fullTitle = `Kesari Van | ${clean}`;
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* No Index */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

