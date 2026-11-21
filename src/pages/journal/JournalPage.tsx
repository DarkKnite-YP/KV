import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero, Section, SectionHeading, Button, Card, Badge, EmptyState } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { JOURNAL_CATEGORIES } from '../../lib/constants';
import { formatDateShort } from '../../lib/utils';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';

export default function JournalPage() {
  const { articles } = useOrchardStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Stories');

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const filteredArticles = publishedArticles.filter((article) => {
    if (selectedCategory === 'All Stories') return true;
    return article.category === selectedCategory;
  });

  const featured = publishedArticles.find((a) => a.is_featured) || publishedArticles[0];

  return (
    <>
      <SEO
        title="Journal — Notes from the Orchard"
        description="Authentic stories, pruning observations, and seasonal updates from Kesari Van mango orchard in Surat. No marketing fluff, only real farm life."
      />

      {/* Hero */}
      <Hero
        eyebrow="NOTES FROM THE ORCHARD"
        headline="There is always something growing."
        copy="Some stories are about mangoes. Some are about the trees, the people, the weather, the mistakes, and the little things we learn along the way. At Kesari Van, the orchard is always changing."
        primaryCTA={{ label: 'Explore the Orchard', href: '/orchard' }}
        secondaryCTA={{ label: 'Shop Mangoes', href: '/shop' }}
        size="large"
      />

      {/* Featured Story */}
      {featured && (
        <Section background="white" padding="default">
          <div className="max-w-content mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-mango-cream/40 rounded-softer border border-charcoal/10 overflow-hidden">
              <div className="lg:col-span-6 aspect-[16/10] bg-soft-sage/50 flex items-center justify-center text-7xl p-8">
                🌸
              </div>
              <div className="lg:col-span-6 p-8 md:p-12 space-y-4">
                <Badge variant="gold">Featured Story · {featured.category}</Badge>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal">
                  <Link to={`/journal/${featured.slug}`} className="hover:text-orchard-green transition-colors">
                    {featured.title}
                  </Link>
                </h2>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-body text-charcoal/50 pt-2">
                  <span>{formatDateShort(featured.published_at || '')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featured.reading_time_min} min read
                  </span>
                </div>
                <div className="pt-2">
                  <Button href={`/journal/${featured.slug}`} variant="primary" size="sm">
                    Read Story <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Category Tabs & Articles */}
      <Section background="cream" padding="default">
        <div className="max-w-reading mx-auto text-center mb-10">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {JOURNAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-body font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orchard-green text-white'
                    : 'bg-white text-charcoal/70 hover:bg-soft-sage/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredArticles.length === 0 ? (
          <EmptyState
            title="There are stories taking shape."
            description="We're out in the orchard, busy growing a few. Come back when the next story is ready."
            action={{ label: 'Explore the Orchard', href: '/orchard' }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-content mx-auto">
            {filteredArticles.map((article) => (
              <Card key={article.id} hover padding="none" className="flex flex-col h-full bg-white border border-charcoal/10">
                <div className="h-48 bg-soft-sage/30 flex items-center justify-center text-5xl border-b border-charcoal/5">
                  🍃
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <Badge variant="sage" size="sm">{article.category}</Badge>
                    <h3 className="font-display text-2xl text-charcoal">
                      <Link to={`/journal/${article.slug}`} className="hover:text-orchard-green transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="font-body text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-body text-charcoal/50 border-t border-charcoal/5 pt-4">
                    <span>{formatDateShort(article.published_at || '')}</span>
                    <span className="flex items-center gap-1 font-medium text-orchard-green">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
