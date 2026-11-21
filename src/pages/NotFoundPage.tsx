import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <h1 className="font-display text-6xl md:text-8xl text-orchard-green mb-4">
          404
        </h1>
        <p className="font-display text-2xl md:text-3xl text-charcoal mb-3">
          This path doesn't lead to the orchard.
        </p>
        <p className="font-body text-base text-charcoal/60 max-w-md mb-8">
          The page you're looking for may have been moved or doesn't exist. Let's find your way back.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/shop" variant="outline">
            Shop Mangoes
          </Button>
        </div>
      </div>
    </>
  );
}

