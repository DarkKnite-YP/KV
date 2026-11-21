import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero, Section, SectionHeading, Button, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { formatPrice } from '../../lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  CheckCircle2,
  TreeDeciduous,
  ShieldCheck,
  Scale,
  Sparkles,
  Camera,
} from 'lucide-react';
import type { Tree } from '../../types/database';

export default function AdoptPage() {
  const navigate = useNavigate();
  const { trees, pricingConfig } = useOrchardStore();

  const [filter, setFilter] = useState<'all' | 'available' | 'adopted' | 'reserved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Filter & search trees
  const filteredTrees = trees.filter((tree) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = tree.tree_id.toLowerCase().includes(q);
      const matchLoc = tree.location_description?.toLowerCase().includes(q) ?? false;
      if (!matchId && !matchLoc) return false;
    }

    if (filter === 'available') return tree.status === 'available';
    if (filter === 'adopted') return tree.status === 'adopted';
    if (filter === 'reserved') return tree.status === 'reserved';
    return true;
  });

  const totalCount = trees.length;
  const availableCount = trees.filter((t) => t.status === 'available').length;
  const adoptedCount = trees.filter((t) => t.status === 'adopted').length;
  const reservedCount = trees.filter((t) => t.status === 'reserved').length;

  // Track scroll position for carousel controls
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const totalScrollable = scrollWidth - clientWidth;
    if (totalScrollable > 0) {
      const progress = scrollLeft / totalScrollable;
      setActiveSlideIndex(Math.min(5, Math.floor(progress * 6)));
    }
  };

  useEffect(() => {
    handleScroll();
  }, [filteredTrees]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const clientWidth = carouselRef.current.clientWidth;
    // Scroll roughly 80% of visible container width per click
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Adopt a Tree — A Season with Your Own Mango Tree"
        description="Adopt a specific Gir Kesar mango tree at Kesari Van in Surat for ₹6,499. Includes 25 kg minimum harvest guarantee, surplus yield, and weekly orchard updates."
      />

      {/* Hero */}
      <Hero
        eyebrow="A SEASON WITH YOUR OWN TREE"
        headline="What if this season, you had a tree of your own?"
        copy="Know the tree your mangoes grow on. Follow its journey through the season, see how it’s cared for, and experience the trust of knowing where your mangoes come from."
        primaryCTA={{ label: 'Choose Your Tree', href: '#tree-carousel' }}
        secondaryCTA={{ label: 'How It Works', href: '/adopt-a-tree/how-it-works' }}
        size="large"
      />

      {/* Value Proposition */}
      <Section background="white" padding="default">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-content mx-auto text-center">
          <div className="p-6 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-3">
            <span className="text-4xl block">🌳</span>
            <h3 className="font-display text-2xl text-charcoal">Your Specific Tree</h3>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Choose from 100 actual numbered trees (KV-001 to KV-100) in our Surat grove. Your name is physically tagged to its row and trunk.
            </p>
          </div>

          <div className="p-6 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-3">
            <span className="text-4xl block">⚖️</span>
            <h3 className="font-display text-2xl text-charcoal">{pricingConfig.min_guarantee_kg} kg Harvest Guarantee</h3>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              No agricultural gambling. You are guaranteed a minimum of {pricingConfig.min_guarantee_kg} kg of fresh Gir Kesar mangoes, plus any eligible surplus your tree yields!
            </p>
          </div>

          <div className="p-6 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-3">
            <span className="text-4xl block">📹</span>
            <h3 className="font-display text-2xl text-charcoal">Weekly Orchard Updates</h3>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Follow along with real orchard video dispatches via WhatsApp and email as blossoms become fruit, and fruit ripens toward harvest.
            </p>
          </div>
        </div>
      </Section>

      {/* Tree Carousel Section (Section 12: ~6 on desktop / ~3 on mobile) */}
      <Section id="tree-carousel" background="cream" padding="default">
        <div className="max-w-wide mx-auto">
          {/* Section Header & Summary */}
          <div className="max-w-reading mx-auto text-center mb-8">
            <Badge variant="gold">100 Trees · {pricingConfig.season}</Badge>
            <h2 className="font-display text-section text-charcoal mt-2">
              Select Your Mango Tree
            </h2>
            <p className="font-body text-sm text-charcoal/70 mt-2">
              Out of 900+ trees at Kesari Van, only 100 are opened for seasonal adoption.{' '}
              <span className="font-bold text-orchard-green">{availableCount} trees currently available</span> for {formatPrice(pricingConfig.price)}.
            </p>

            {/* Search Input & Status Filter Tabs */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Search by Tree ID */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Tree ID (e.g. KV-018)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs font-body rounded-full bg-white border border-charcoal/15 focus:outline-none focus:border-orchard-green transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap justify-center gap-1.5 bg-charcoal/5 p-1 rounded-full">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                    filter === 'all'
                      ? 'bg-orchard-green text-white shadow-sm'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setFilter('available')}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                    filter === 'available'
                      ? 'bg-orchard-green text-white shadow-sm'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  Available ({availableCount})
                </button>
                <button
                  onClick={() => setFilter('adopted')}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                    filter === 'adopted'
                      ? 'bg-orchard-green text-white shadow-sm'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  Adopted ({adoptedCount})
                </button>
                {reservedCount > 0 && (
                  <button
                    onClick={() => setFilter('reserved')}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                      filter === 'reserved'
                        ? 'bg-orchard-green text-white shadow-sm'
                        : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    Reserved ({reservedCount})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Carousel Navigation Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="font-body text-xs text-charcoal/60">
              Showing {filteredTrees.length} trees · Swipe or use arrows to explore grove
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-full bg-white border border-charcoal/15 text-charcoal flex items-center justify-center hover:bg-soft-sage/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Previous trees"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-full bg-white border border-charcoal/15 text-charcoal flex items-center justify-center hover:bg-soft-sage/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Next trees"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Horizontal Carousel (~6 trees desktop, ~3 trees mobile) */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredTrees.map((tree) => {
              const isAvailable = tree.status === 'available';
              const isReserved = tree.status === 'reserved';

              return (
                <div
                  key={tree.id}
                  onClick={() => setSelectedTree(tree)}
                  className={`flex-shrink-0 snap-start cursor-pointer rounded-soft p-3 bg-white border transition-all duration-200 hover:shadow-card-hover select-none ${
                    // Sizing: ~3 per view on mobile/tablet (min-w 30-33%), ~6 per view on desktop (min-w 15.5%)
                    'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.85rem)]'
                  } ${
                    isAvailable
                      ? 'border-charcoal/10 hover:border-orchard-green hover:-translate-y-0.5'
                      : 'border-charcoal/5 opacity-75 bg-charcoal/5'
                  }`}
                >
                  {/* Tree Thumbnail / Photo */}
                  <div className="aspect-square rounded-soft bg-soft-sage/20 border border-charcoal/5 flex items-center justify-center relative overflow-hidden mb-2.5">
                    {tree.photo_url ? (
                      <img
                        src={tree.photo_url}
                        alt={`Tree ${tree.tree_id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-charcoal/70">
                        <span className="text-3xl">🌳</span>
                      </div>
                    )}

                    {/* Status Badge top right */}
                    <div className="absolute top-1.5 right-1.5">
                      <Badge
                        variant={isAvailable ? 'green' : isReserved ? 'gold' : 'neutral'}
                        size="sm"
                      >
                        {isAvailable ? 'Available' : isReserved ? 'Reserved' : 'Adopted'}
                      </Badge>
                    </div>

                    {/* Tree photo indicator icon if photo exists */}
                    {tree.photo_url && (
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 rounded-full p-1 text-white">
                        <Camera className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Card Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-display text-base font-bold text-charcoal">{tree.tree_id}</h4>
                      <span className="font-body text-[10px] text-charcoal/50">Row {tree.tree_id.slice(-2)}</span>
                    </div>
                    <p className="font-body text-[11px] text-charcoal/60 truncate" title={tree.location_description || undefined}>
                      {tree.location_description || 'Surat Orchard Row'}
                    </p>
                    <div className="pt-1 border-t border-charcoal/5 flex items-center justify-between">
                      <span className="font-body text-xs font-bold text-orchard-green">
                        {formatPrice(tree.adoption_fee || pricingConfig.price)}
                      </span>
                      <span className="font-body text-[10px] text-charcoal/40 font-medium">
                        {pricingConfig.min_guarantee_kg}kg min
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Progress Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeSlideIndex === idx ? 'w-6 bg-orchard-green' : 'w-1.5 bg-charcoal/20'
                }`}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Tree Detail Modal */}
      {selectedTree && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedTree(null)}
        >
          <div
            className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-lg w-full p-6 md:p-8 relative space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTree(null)}
              className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal p-1.5 rounded-full hover:bg-charcoal/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tree Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-soft bg-soft-sage/40 border border-charcoal/10 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                {selectedTree.photo_url ? (
                  <img
                    src={selectedTree.photo_url}
                    alt={`Tree ${selectedTree.tree_id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">🌳</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedTree.status === 'available'
                        ? 'green'
                        : selectedTree.status === 'reserved'
                        ? 'gold'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {selectedTree.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-body text-charcoal/50 font-medium">
                    {pricingConfig.season}
                  </span>
                </div>
                <h3 className="font-display text-3xl text-charcoal">Tree {selectedTree.tree_id}</h3>
                <p className="font-body text-xs text-charcoal/70">{selectedTree.location_description}</p>
                <p className="font-body text-xs text-charcoal/50">Variety: {selectedTree.variety} · Surat Grove</p>
              </div>
            </div>

            {/* Inclusions & Guarantees */}
            <div className="space-y-3 border-y border-charcoal/10 py-4 font-body text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-charcoal/70 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-orchard-green" /> Minimum Harvest Guarantee
                </span>
                <span className="font-bold text-orchard-green">{pricingConfig.min_guarantee_kg} kg Minimum</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal/70 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-dawn-gold" /> Surplus Harvest Policy
                </span>
                <span className="font-medium text-charcoal">Eligible surplus goes to adopter</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal/70 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orchard-green" /> Plaque Tagging
                </span>
                <span className="font-medium text-charcoal">Custom brass plaque on tree</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-charcoal/5">
                <span className="text-charcoal/70 font-semibold">Seasonal Adoption Fee</span>
                <span className="font-bold text-xl text-orchard-green">
                  {formatPrice(selectedTree.adoption_fee || pricingConfig.price)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {selectedTree.status === 'available' ? (
                <Button
                  onClick={() => navigate(`/adopt-a-tree/checkout?tree=${selectedTree.tree_id}`)}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Adopt Tree {selectedTree.tree_id} for {formatPrice(selectedTree.adoption_fee || pricingConfig.price)}
                </Button>
              ) : (
                <div className="p-3 bg-charcoal/5 rounded-soft text-center text-xs font-body text-charcoal/60">
                  This tree has already been adopted or reserved for {pricingConfig.season}. Please choose an available tree from the grove.
                </div>
              )}
              <Button
                onClick={() => setSelectedTree(null)}
                variant="ghost"
                size="sm"
                fullWidth
              >
                Close & Browse More Trees
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inclusions Panel */}
      <Section background="white" padding="default">
        <SectionHeading
          eyebrow="What's Included"
          title="The Full Adoption Experience"
          subtitle="A complete seasonal relationship with an authentic orchard tree."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-content mx-auto">
          <div className="p-6 bg-mango-cream/40 rounded-soft border border-charcoal/5 space-y-2">
            <span className="text-3xl">🏷️</span>
            <h4 className="font-display text-xl text-charcoal">Physical Tree Plaque</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Your name and Tree ID permanently hung on the tree's branch for the duration of the {pricingConfig.season}.
            </p>
          </div>
          <div className="p-6 bg-mango-cream/40 rounded-soft border border-charcoal/5 space-y-2">
            <span className="text-3xl">📦</span>
            <h4 className="font-display text-xl text-charcoal">{pricingConfig.min_guarantee_kg} kg Guarantee</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Receive at least {pricingConfig.min_guarantee_kg} kg of fresh Gir Kesar mangoes packed in cushioned boxes and delivered to your doorstep.
            </p>
          </div>
          <div className="p-6 bg-mango-cream/40 rounded-soft border border-charcoal/5 space-y-2">
            <span className="text-3xl">📱</span>
            <h4 className="font-display text-xl text-charcoal">Weekly Video Dispatch</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Collective WhatsApp updates showing flowering progress, fruit bagging, canopy pruning, and harvest readiness.
            </p>
          </div>
          <div className="p-6 bg-mango-cream/40 rounded-soft border border-charcoal/5 space-y-2">
            <span className="text-3xl">🌿</span>
            <h4 className="font-display text-xl text-charcoal">Orchard Visit Priority</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Complimentary arranged farm visits to see and touch your adopted tree in Surat with your family.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
