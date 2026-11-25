import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion';
import { Hero, Section, SectionHeading, Button, Badge, Tooltip } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { formatPrice, getTreePhotos } from '../../lib/utils';
import { TreeImageSlider } from '../../components/adopt/TreeImageSlider';
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
} from 'lucide-react';
import type { Tree } from '../../types/database';

const TREES_PER_SCROLLER = 10;

export default function AdoptPage() {
  const navigate = useNavigate();
  const { trees, pricingConfig } = useOrchardStore();

  const [filter, setFilter] = useState<'all' | 'available' | 'adopted' | 'reserved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchDirection, setBatchDirection] = useState(1);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollerPullX = useMotionValue(0);
  const pullStartX = useRef<number | null>(null);
  const pullLastX = useRef<number>(0);
  const pullLastTime = useRef<number>(0);
  const pullVelocity = useRef<number>(0);
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

  const totalBatches = Math.max(1, Math.ceil(filteredTrees.length / TREES_PER_SCROLLER));
  const safeBatchIndex = Math.min(batchIndex, totalBatches - 1);
  const visibleBatchTrees = filteredTrees.slice(
    safeBatchIndex * TREES_PER_SCROLLER,
    (safeBatchIndex + 1) * TREES_PER_SCROLLER
  );

  // Reset batch to first set when filters/search change
  useEffect(() => {
    setBatchIndex(0);
    setActiveSlideIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0 });
    }
  }, [filter, searchQuery]);

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
    const dotCount = Math.max(1, visibleBatchTrees.length);
    if (totalScrollable > 0) {
      const progress = scrollLeft / totalScrollable;
      setActiveSlideIndex(Math.min(dotCount - 1, Math.round(progress * (dotCount - 1))));
    } else {
      setActiveSlideIndex(0);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [filteredTrees.length, safeBatchIndex]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const clientWidth = carouselRef.current.clientWidth;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleSelectBatch = (idx: number) => {
    setBatchDirection(idx >= batchIndex ? 1 : -1);
    setBatchIndex(idx);
    setActiveSlideIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Carousel end-edge resistance + velocity-preserving spring back
  const handleScrollerPointerDown = (e: React.PointerEvent) => {
    pullStartX.current = e.clientX;
    pullLastX.current = e.clientX;
    pullLastTime.current = performance.now();
    pullVelocity.current = 0;
  };

  const handleScrollerPointerMove = (e: React.PointerEvent) => {
    if (pullStartX.current === null || !carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const delta = e.clientX - pullStartX.current;
    const now = performance.now();
    const dt = Math.max(1, now - pullLastTime.current);
    pullVelocity.current = ((e.clientX - pullLastX.current) / dt) * 1000;
    pullLastX.current = e.clientX;
    pullLastTime.current = now;

    const atLeftEnd = scrollLeft <= 1 && delta > 0;
    const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 1 && delta < 0;
    if (atLeftEnd || atRightEnd) {
      const sign = delta >= 0 ? 1 : -1;
      const abs = Math.abs(delta);
      scrollerPullX.set(sign * (abs / (1 + abs * 0.014)));
    } else if (scrollerPullX.get() !== 0) {
      scrollerPullX.set(0);
    }
  };

  const handleScrollerPointerEnd = () => {
    pullStartX.current = null;
    if (scrollerPullX.get() !== 0) {
      animate(scrollerPullX, 0, {
        type: 'spring',
        duration: 0.5,
        bounce: 0,
        velocity: pullVelocity.current,
      });
    }
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

          {/* 10-Tree Batch Switcher */}
          {totalBatches > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
              {Array.from({ length: totalBatches }).map((_, idx) => {
                const startNum = idx * TREES_PER_SCROLLER + 1;
                const endNum = Math.min((idx + 1) * TREES_PER_SCROLLER, filteredTrees.length);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectBatch(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                      safeBatchIndex === idx
                        ? 'bg-orchard-green text-white shadow-sm'
                        : 'bg-white border border-charcoal/15 text-charcoal/70 hover:border-orchard-green hover:text-orchard-green'
                    }`}
                  >
                    {startNum}–{endNum}
                  </button>
                );
              })}
            </div>
          )}

          {/* Carousel Navigation Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="font-body text-xs text-charcoal/60">
              {filteredTrees.length > 0
                ? `Showing ${safeBatchIndex * TREES_PER_SCROLLER + 1}–${
                    safeBatchIndex * TREES_PER_SCROLLER + visibleBatchTrees.length
                  } of ${filteredTrees.length} trees · Swipe to browse`
                : 'No trees match your filter'}
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

          {/* 10-Tree Card Horizontal Scroller with directional stepper transitions & elastic boundary spring */}
          <AnimatePresence mode="wait" custom={batchDirection}>
            <motion.div
              key={`batch-${safeBatchIndex}-${filter}-${searchQuery}`}
              custom={batchDirection}
              initial={{ opacity: 0, scale: 0.97, x: batchDirection * 36 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.97, x: -batchDirection * 36 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                ref={carouselRef}
                onScroll={handleScroll}
                style={{ x: scrollerPullX, scrollbarWidth: 'thin' }}
                onPointerDown={handleScrollerPointerDown}
                onPointerMove={handleScrollerPointerMove}
                onPointerUp={handleScrollerPointerEnd}
                onPointerCancel={handleScrollerPointerEnd}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 scroll-smooth"
              >
                {visibleBatchTrees.map((tree) => {
              const isAvailable = tree.status === 'available';
              const isReserved = tree.status === 'reserved';
              const treePhotos = getTreePhotos(tree);

              return (
                <div
                  key={tree.id}
                  onClick={() => setSelectedTree(tree)}
                  className={`flex-shrink-0 snap-start cursor-pointer rounded-softer p-4 bg-white border flex flex-col justify-between transition-all duration-200 hover:shadow-card-hover select-none ${
                    // Readable card width on medium phones (~82% width) up to desktop (~295px)
                    'w-[82%] max-w-[330px] sm:w-[300px] md:w-[308px] lg:w-[295px]'
                  } ${
                    isAvailable
                      ? 'border-charcoal/12 hover:border-orchard-green hover:-translate-y-0.5'
                      : 'border-charcoal/10 opacity-85 bg-charcoal/[0.02]'
                  }`}
                >
                  <div>
                    {/* Larger Sliding Tree Photo Gallery */}
                    <div className="aspect-[4/3] rounded-soft bg-soft-sage/20 border border-charcoal/5 relative overflow-hidden mb-3.5">
                      <TreeImageSlider
                        photos={treePhotos}
                        alt={`Tree ${tree.tree_id}`}
                      />

                      {/* Status Badge top right */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <Badge
                          variant={isAvailable ? 'green' : isReserved ? 'gold' : 'neutral'}
                          size="sm"
                        >
                          {isAvailable ? 'Available' : isReserved ? 'Reserved' : 'Adopted'}
                        </Badge>
                      </div>
                    </div>

                    {/* Clear Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-2xl font-bold text-charcoal leading-none">
                          {tree.tree_id}
                        </h4>
                        <span className="font-body text-xs font-medium text-charcoal/60 bg-mango-cream px-2 py-0.5 rounded-full">
                          {tree.variety}
                        </span>
                      </div>

                      <p
                        className="font-body text-xs text-charcoal/70 line-clamp-2 min-h-[2rem] leading-relaxed"
                        title={tree.location_description || undefined}
                      >
                        {tree.location_description || `Surat Orchard · Row ${tree.tree_id.slice(-2)}`}
                      </p>

                      <div className="pt-2 border-t border-charcoal/10 flex items-baseline justify-between">
                        <div>
                          <span className="font-body text-lg font-bold text-orchard-green">
                            {formatPrice(tree.adoption_fee || pricingConfig.price)}
                          </span>
                          <span className="font-body text-[11px] text-charcoal/50 ml-1">/ season</span>
                        </div>
                        <Tooltip content="Minimum guaranteed harvest; eligible surplus also belongs to you">
                          <span className="font-body text-xs text-charcoal/65 font-semibold underline decoration-dotted decoration-charcoal/30 underline-offset-2">
                            {tree.min_guarantee_kg || pricingConfig.min_guarantee_kg} kg min.
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Single Adopt Button */}
                  <Button
                    type="button"
                    variant={isAvailable ? 'gold' : 'outline'}
                    size="md"
                    fullWidth
                    disabled={!isAvailable}
                    className={isAvailable ? 'shadow-sm font-semibold' : 'opacity-60 cursor-not-allowed'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvailable) {
                        navigate(`/adopt-a-tree/checkout?tree=${tree.tree_id}`);
                      }
                    }}
                  >
                    {isAvailable ? `Adopt ${tree.tree_id}` : isReserved ? 'Reserved' : 'Already Adopted'}
                  </Button>
                </div>
              );
            })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* 10-Card Carousel Progress Dots */}
          {visibleBatchTrees.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-3">
              {visibleBatchTrees.map((t, idx) => (
                <span
                  key={t.id}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    activeSlideIndex === idx ? 'w-6 bg-orchard-green' : 'w-1.5 bg-charcoal/20'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Batch Next/Prev Footer Controls for easy hopping between 10-card sets */}
          {totalBatches > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeBatchIndex === 0}
                onClick={() => handleSelectBatch(safeBatchIndex - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous 10 Trees
              </Button>
              <span className="font-body text-xs text-charcoal/60 font-medium">
                Set {safeBatchIndex + 1} of {totalBatches}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeBatchIndex >= totalBatches - 1}
                onClick={() => handleSelectBatch(safeBatchIndex + 1)}
              >
                Next 10 Trees <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* Tree Detail Modal */}
      {selectedTree && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedTree(null)}
        >
          <div
            className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-lg w-full p-6 md:p-8 relative space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTree(null)}
              className="absolute top-4 right-4 z-20 text-charcoal/60 hover:text-charcoal p-1.5 rounded-full bg-white/80 hover:bg-charcoal/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Larger Sliding Gallery in Modal */}
            <div className="aspect-[4/3] w-full rounded-soft bg-soft-sage/30 border border-charcoal/10 overflow-hidden">
              <TreeImageSlider
                photos={getTreePhotos(selectedTree)}
                alt={`Tree ${selectedTree.tree_id}`}
                autoSlideIntervalMs={4000}
              />
            </div>

            {/* Tree Modal Header */}
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
                  variant="gold"
                  size="lg"
                  fullWidth
                  className="shadow-md"
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
