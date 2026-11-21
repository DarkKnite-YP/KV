import React, { useState } from 'react';
import { Hero, Section, SectionHeading, Button, Accordion } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { MOCK_FAQ_ITEMS } from '../lib/mockData';
import { FAQ_CATEGORIES, BRAND_PHRASES } from '../lib/constants';
import { Search } from 'lucide-react';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MOCK_FAQ_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const accordionItems = filteredItems.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="leading-relaxed">{item.answer}</p>,
  }));

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQ) — Kesari Van"
        description="Find answers to common questions about Gir Kesar mangoes, shipping regions, tree adoption guarantee, payments, and visiting Kesari Van in Surat."
      />

      {/* Hero */}
      <Hero
        eyebrow="HELP & CLARITY"
        headline="Frequently Asked Questions"
        copy="Everything you need to know about our mango varieties, seasonal deliveries, tree adoption terms, and orchard visits."
        primaryCTA={{ label: 'Ask a Question', href: '/contact' }}
        size="default"
      />

      {/* FAQ Main Content */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search by topic (e.g. organic, guarantee, shipping)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mango-cream/40 border border-charcoal/20 rounded-soft pl-12 pr-4 py-3 text-sm font-body text-charcoal focus:outline-none focus:border-orchard-green"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-body font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orchard-green text-white'
                    : 'bg-mango-cream/50 text-charcoal/70 hover:bg-soft-sage/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          {accordionItems.length === 0 ? (
            <div className="text-center py-12 font-body text-sm text-charcoal/60">
              No matching questions found for "{searchQuery}". Have a specific query?{' '}
              <a href="/contact" className="text-orchard-green underline">
                Send us a message
              </a>
              .
            </div>
          ) : (
            <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10">
              <Accordion items={accordionItems} />
            </div>
          )}

          {/* Need More Assistance Card */}
          <div className="bg-soft-sage/40 p-8 rounded-softer border border-charcoal/10 text-center space-y-3">
            <h3 className="font-display text-2xl text-charcoal">Have a question not listed here?</h3>
            <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto">
              Our orchard team is always happy to explain our farming practices, tree selection, or order status.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary">
                Contact the Orchard
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Closing Brand Sentiment */}
      <Section background="cream" padding="small">
        <div className="text-center font-display text-xl text-orchard-green italic">
          “{BRAND_PHRASES.connectWithSoil}”
        </div>
      </Section>
    </>
  );
}

