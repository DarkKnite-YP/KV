import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Badge, Card } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { formatDate } from '../../lib/utils';
import { Clock, ArrowLeft, Share2, ArrowRight } from 'lucide-react';

export default function JournalArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useOrchardStore();

  const article = articles.find((a) => a.slug === slug) || articles[0];
  const related = articles.filter((a) => a.id !== article?.id && a.status === 'published').slice(0, 2);

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Article link copied to clipboard!');
  }

  if (!article) {
    return (
      <div className="pt-32 pb-20 bg-mango-cream text-center">
        <Container narrow>
          <h2 className="font-display text-3xl text-charcoal mb-4">Article Not Found</h2>
          <Button href="/journal" variant="primary">Return to Journal</Button>
        </Container>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt || article.title}
      />

      <article className="pt-24 pb-20 bg-mango-cream">
        <Container narrow>
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs font-body text-charcoal/60">
            <Link to="/" className="hover:text-orchard-green">Home</Link>
            <span>/</span>
            <Link to="/journal" className="hover:text-orchard-green">Journal</Link>
            <span>/</span>
            <span className="text-charcoal font-medium truncate">{article.title}</span>
          </div>

          {/* Article Header */}
          <header className="space-y-4 text-center mb-10">
            <Badge variant="gold">{article.category}</Badge>
            <h1 className="font-display text-4xl md:text-5xl text-charcoal leading-tight text-balance">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="font-body text-base text-charcoal/70 leading-relaxed max-w-xl mx-auto italic">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-xs font-body text-charcoal/50 pt-2">
              <span>By {article.author_name || 'Kesari Van Team'}</span>
              <span>•</span>
              <span>{formatDate(article.published_at || '')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.reading_time_min} min read
              </span>
            </div>
          </header>

          {/* Cover Placeholder */}
          <div className="bg-white rounded-softer shadow-card border border-charcoal/10 aspect-[16/9] flex items-center justify-center text-7xl mb-12">
            🌱
          </div>

          {/* Body Content */}
          <div className="bg-white p-8 md:p-12 rounded-softer shadow-card border border-charcoal/10 font-body text-base text-charcoal/85 leading-relaxed space-y-6">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="p-6 bg-mango-cream/50 rounded-soft border-l-4 border-orchard-green my-8 italic font-display text-xl text-deep-forest">
              “Farming is not an industrial process; it is a conversation with soil and season.”
            </div>
          </div>

          {/* Share & Tag Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-charcoal/10 pt-6">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs bg-soft-sage/40 px-2.5 py-1 rounded-full text-charcoal/70 font-body">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 text-xs font-body text-orchard-green hover:text-deep-forest font-semibold"
            >
              <Share2 className="w-4 h-4" /> Share Article
            </button>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-charcoal/10">
              <h3 className="font-display text-2xl text-charcoal mb-6 text-center">
                More Stories from the Orchard
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <Card key={rel.id} hover padding="sm" className="bg-white border border-charcoal/10">
                    <div className="space-y-2">
                      <Badge variant="sage" size="sm">{rel.category}</Badge>
                      <h4 className="font-display text-xl text-charcoal">
                        <Link to={`/journal/${rel.slug}`} className="hover:text-orchard-green">
                          {rel.title}
                        </Link>
                      </h4>
                      <p className="font-body text-xs text-charcoal/70 line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  );
}
