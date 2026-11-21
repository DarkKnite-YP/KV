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
  const fullTitle = title === 'Kesari Van' ? title : `${title} — Kesari Van`;

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

