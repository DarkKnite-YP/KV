import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero, Section, SectionHeading, Button, Card, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { useOrchardStore } from '../stores/orchardStore';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../lib/utils';
import { BRAND, BRAND_PHRASES } from '../lib/constants';
import { Sprout, Droplets, Scissors, ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const products = useOrchardStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <>
      <SEO
        title="Kesari Van Mangoes"
        description="Welcome to Kesari Van, an authentic mango orchard in Umbhel, Kamrej, Surat. Experience real Gir Kesar mangoes, tree adoption, and sustainable orchard care."
      />

      {/* 1. Hero Section (APPROVED & LOCKED) */}
      <Hero
        eyebrow="GIR KESAR · GROWN IN SURAT, GUJARAT"
        headline="Welcome to an orchard that is writing its next season."
        copy="Every tree has a beginning. Every season brings a new story. And somewhere among these leaves, the next summer is taking shape."
        primaryCTA={{ label: 'Taste the Harvest', href: '/shop' }}
        secondaryCTA={{ label: 'Explore the Orchard', href: '/orchard' }}
        size="large"
      />

      {/* 2. Flower/Fruit Moment */}
      <Section background="cream" padding="default">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 14 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-soft-sage text-orchard-green mx-auto mb-2">
            <Sprout className="w-7 h-7" />
          </div>
          <p className="font-body text-xs md:text-sm font-semibold tracking-[0.2em] text-dawn-gold uppercase">
            A Moment in Time
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal leading-tight">
            “Every mango you have ever eaten... once looked like this.”
          </h2>
          <p className="font-body text-base md:text-lg text-charcoal/70 max-w-xl mx-auto italic">
            This flower may become someone’s summer.
          </p>
          <div className="pt-2">
            <Button href="/journal" variant="outline" size="sm">
              Follow the Journey <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* 3. Gir Kesar Introduction */}
      <Section background="white" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, x: -16 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <Badge variant="gold" size="md">Authentic Variety</Badge>
            <h2 className="font-display text-section text-charcoal">
              Gir Kesar, the Queen of Mangoes, grown in Surat.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              Famed for its bright saffron pulp, intense aroma, and tender sweetness, Gir Kesar is a celebration of Indian summer. While traditionally associated with Junagadh, our trees thrive in the deep, mineral-rich alluvial soil of Kamrej, Surat.
            </p>
            <p className="font-display text-2xl text-orchard-green italic">
              “{BRAND_PHRASES.summerWaiting}”
            </p>
            <div className="pt-2">
              <Button href="/shop" variant="gold" className="shadow-md">
                View Seasonal Harvest
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, x: 16 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-softer overflow-hidden shadow-elevated bg-soft-sage/40 aspect-[4/3] flex items-center justify-center p-8 border border-charcoal/10">
              <div className="text-center space-y-4">
                <span className="text-6xl drop-shadow-sm select-none">🥭</span>
                <h3 className="font-display text-2xl text-deep-forest">Pure Saffron Radiance</h3>
                <p className="font-body text-sm text-charcoal/70 max-w-sm">
                  Naturally matured on the tree, gently harvested, and delivered straight from our orchard gate to your family table.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 4. Products Featured (Dynamic from Store) */}
      <Section background="cream" padding="default">
        <SectionHeading
          eyebrow="The Season’s Harvest"
          title="Picked only when nature says they’re ready."
          subtitle="Three distinct selections, each packed with honesty and harvested by hand."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <Card hover padding="none" className="flex flex-col h-full bg-white border border-charcoal/10">
                <div className="h-56 bg-soft-sage/30 relative flex items-center justify-center p-6 border-b border-charcoal/5">
                  <span className="text-6xl drop-shadow-sm select-none">🥭</span>
                  {product.is_bagged && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="green" size="sm">Individually Bagged</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="sage" size="sm">
                      {product.weight_kg ? `${product.weight_kg} kg Box` : `${product.mango_count} Mangoes`}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-display text-2xl text-charcoal">{product.name}</h3>
                      <span className="font-body font-semibold text-lg text-orchard-green">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-dawn-gold font-medium mb-3">
                      Mangoes {product.min_weight_g} g onwards
                    </p>
                    <p className="font-body text-sm text-charcoal/70 line-clamp-3 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between">
                    <span className="font-body text-xs text-charcoal/50">Shipping calculated at checkout</span>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="font-body text-sm font-semibold text-orchard-green hover:text-deep-forest inline-flex items-center gap-1"
                    >
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/shop" variant="secondary" size="lg">
            Explore Collection & Comparison Guide
          </Button>
        </div>
      </Section>

      {/* 5. Origin: From Sugarcane to Mango Trees */}
      <Section background="forest" padding="large">
        <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
          <Badge variant="gold" size="sm">Our Transformation</Badge>
          <h2 className="font-display text-hero text-white">
            From sugarcane fields to a future rooted in mango trees.
          </h2>
          <p className="font-body text-base md:text-lg text-white/85 leading-relaxed">
            In October 2023, we made a conscious choice to heal this land in Umbhel, Kamrej. We turned away from water-depleting sugarcane monoculture to build a permanent, biodiverse sanctuary of over 900 Gir Kesar trees.
          </p>
          <div className="pt-4">
            <Button href="/our-story" variant="outline" className="border-white text-white hover:bg-white hover:text-deep-forest">
              Read Our Story
            </Button>
          </div>
        </div>
      </Section>

      {/* 6. Tree Adoption Experience */}
      <Section background="sage" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="earth" size="md">Seasonal Tree Adoption</Badge>
            <h2 className="font-display text-section text-charcoal">
              What if this season, you had a tree of your own?
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              Out of 900+ trees at Kesari Van, only 100 are opened for seasonal adoption. Choose a specific tree, follow its growth journey through weekly orchard updates, visit during the season, and receive a guaranteed minimum harvest of 25 kg straight to your doorstep.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/80 p-4 rounded-soft border border-charcoal/5">
                <p className="font-display text-2xl text-orchard-green">₹6,499</p>
                <p className="font-body text-xs text-charcoal/60 mt-1">Per Season Fee</p>
              </div>
              <div className="bg-white/80 p-4 rounded-soft border border-charcoal/5">
                <p className="font-display text-2xl text-orchard-green">25 kg Min.</p>
                <p className="font-body text-xs text-charcoal/60 mt-1">Harvest Guarantee</p>
              </div>
              <div className="bg-white/80 p-4 rounded-soft border border-charcoal/5 col-span-2 sm:col-span-1">
                <p className="font-display text-2xl text-orchard-green">100 Trees</p>
                <p className="font-body text-xs text-charcoal/60 mt-1">Limited Intake</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button href="/adopt-a-tree" variant="gold" className="shadow-md">
                Select Your Tree
              </Button>
              <Button href="/adopt-a-tree/how-it-works" variant="ghost">
                How It Works <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-softer shadow-card border border-charcoal/10 space-y-4">
              <div className="flex items-center gap-3 text-orchard-green">
                <HeartHandshake className="w-6 h-6" />
                <h4 className="font-display text-xl text-charcoal">The Adopter Experience</h4>
              </div>
              <ul className="space-y-3 font-body text-sm text-charcoal/70">
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span>Personal Tree ID tag (KV-001 to KV-100) and adoption certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span>Weekly video and photo updates from the orchard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span>All surplus harvest beyond the 25 kg guarantee belongs to you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span>Priority orchard visit invitation during flowering and harvest.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Farming Teaser: Good mangoes begin with good care */}
      <Section background="white" padding="default">
        <SectionHeading
          eyebrow="Farming Philosophy"
          title="Good mangoes begin with good care."
          subtitle="We are not certified organic, but we care deeply about soil life, precision irrigation, and mindful stewardship."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-soft bg-mango-cream/50 border border-charcoal/5 space-y-4">
            <div className="w-12 h-12 rounded-full bg-soft-sage flex items-center justify-center text-orchard-green">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-charcoal">Thoughtful Pruning</h3>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Every cut opens up the canopy to direct sunlight and free airflow, preventing fungal moisture and channeling energy into fewer, larger fruits.
            </p>
          </div>

          <div className="p-6 rounded-soft bg-mango-cream/50 border border-charcoal/5 space-y-4">
            <div className="w-12 h-12 rounded-full bg-soft-sage flex items-center justify-center text-orchard-green">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-charcoal">Water With Purpose</h3>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Precision subsurface drip lines deliver water directly to the root zones without waterlogging or evaporative waste, conserving every drop.
            </p>
          </div>

          <div className="p-6 rounded-soft bg-mango-cream/50 border border-charcoal/5 space-y-4">
            <div className="w-12 h-12 rounded-full bg-soft-sage flex items-center justify-center text-orchard-green">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-charcoal">Protection & Care</h3>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Individual breathable bags wrap each fruit while on the branch, shielding it from pest strikes and harsh sun without chemical sprays.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button href="/farming-practices" variant="outline">
            Discover Our Farming Practices
          </Button>
        </div>
      </Section>

      {/* 8. Visit & Journal Teasers - CTA directly to /visit#visit-form */}
      <Section background="cream" padding="default">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visit Card */}
          <div className="bg-white p-8 md:p-10 rounded-softer shadow-card border border-charcoal/5 flex flex-col justify-between">
            <div className="space-y-4">
              <Badge variant="earth">In-Person Experience</Badge>
              <h3 className="font-display text-3xl text-charcoal">
                Some things are better experienced in person.
              </h3>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                Walk beneath the trees, feel the soil underfoot, and see how your mangoes grow. We welcome guests by prior appointment.
              </p>
            </div>
            <div className="pt-6">
              <Button href="/visit#visit-form" variant="gold" className="shadow-md">
                Plan Your Visit
              </Button>
            </div>
          </div>

          {/* Journal Card */}
          <div className="bg-white p-8 md:p-10 rounded-softer shadow-card border border-charcoal/5 flex flex-col justify-between">
            <div className="space-y-4">
              <Badge variant="gold">Notes from the Orchard</Badge>
              <h3 className="font-display text-3xl text-charcoal">
                There is always something growing.
              </h3>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                Read our reflections on blossoms, pruning lessons, soil building, and the honest rhythm of orchard life in Surat.
              </p>
            </div>
            <div className="pt-6">
              <Button href="/journal" variant="secondary">
                Read the Journal
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 9. Closing Brand Statement */}
      <Section background="green" padding="large">
        <div className="max-w-2xl mx-auto text-center space-y-6 text-white">
          <p className="font-display text-2xl md:text-3xl text-dawn-gold italic">
            “{BRAND_PHRASES.closerToNature}”
          </p>
          <h2 className="font-display text-section text-white">
            Welcome to Kesari Van.
          </h2>
          <p className="font-body text-sm text-white/80 max-w-md mx-auto">
            {BRAND_PHRASES.gatesOpen}
          </p>
          <div className="pt-4">
            <Button href="/shop" variant="gold" size="lg">
              Explore Our Mangoes
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
