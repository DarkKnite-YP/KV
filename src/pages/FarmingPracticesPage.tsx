import React from 'react';
import { Hero, Section, SectionHeading, Button, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { BRAND_PHRASES } from '../lib/constants';
import { Sprout, Droplets, Scissors, ShieldCheck, Eye, RefreshCw, ArrowRight } from 'lucide-react';

export default function FarmingPracticesPage() {
  return (
    <>
      <SEO
        title="Farming Practices — Conscious Mango Cultivation"
        description="Learn how Kesari Van cares for soil biology, precision drip irrigation, selective canopy pruning, and individual fruit protection bags in Surat."
      />

      {/* Hero */}
      <Hero
        eyebrow="FARMING PRACTICES · ROOTED IN OBSERVATION"
        headline="Good mangoes begin long before the harvest."
        copy="Great flavor is not manufactured in the packing shed. It is earned through patient soil stewardship, precise hydration, and meticulous fruit care throughout the entire twelve-month cycle."
        primaryCTA={{ label: 'Explore the Orchard', href: '/orchard' }}
        secondaryCTA={{ label: 'Taste the Harvest', href: '/shop' }}
        size="large"
      />

      {/* Philosophy */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto space-y-6 text-center">
          <Badge variant="green">Our Credo</Badge>
          <h2 className="font-display text-section text-charcoal">
            We don’t just grow mangoes. We care for the environment they grow in.
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed text-pretty">
            Observe before acting. Care through the season. Grow with intention. We resist chemical shortcuts and focus on building natural tree resilience from the roots up.
          </p>
        </div>
      </Section>

      {/* Soil Care */}
      <Section background="cream" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-content mx-auto">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-orchard-green">
              <Sprout className="w-5 h-5" />
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-earth-brown">Soil Health</span>
            </div>
            <h2 className="font-display text-section text-charcoal">
              Everything begins beneath our feet.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              When we took over this sugarcane parcel in 2023, the ground was compacted and depleted. We immediately began intensive soil restoration: incorporating tons of decomposed organic farmyard manure, encouraging earthworm populations, and applying natural bio-ferments.
            </p>
            <div className="p-4 bg-white rounded-soft border-l-4 border-dawn-gold text-xs text-charcoal/70 leading-relaxed">
              <strong>Honesty note:</strong> Kesari Van is not certified organic. We prioritize verifiable soil vitality and sustainable methods over marketing certifications.
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-soft-sage/40 rounded-softer p-8 border border-charcoal/10 aspect-[4/3] flex flex-col justify-center items-center text-center">
              <span className="text-5xl mb-4">🪱</span>
              <h4 className="font-display text-2xl text-deep-forest">Living Soil Biology</h4>
              <p className="font-body text-sm text-charcoal/70 max-w-sm mt-2">
                A rich web of mycorrhizae and beneficial microbes unlocks micro-minerals that give Gir Kesar its famous saffron depth.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Drip Irrigation */}
      <Section background="white" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-content mx-auto">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-soft-sage/40 rounded-softer p-8 border border-charcoal/10 aspect-[4/3] flex flex-col justify-center items-center text-center">
              <span className="text-5xl mb-4">💧</span>
              <h4 className="font-display text-2xl text-deep-forest">Precision Hydration</h4>
              <p className="font-body text-sm text-charcoal/70 max-w-sm mt-2">
                Subsurface pressure-compensating emitters deliver exact amounts of moisture without wetting the trunk.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-orchard-green">
              <Droplets className="w-5 h-5" />
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-earth-brown">Water Care</span>
            </div>
            <h2 className="font-display text-section text-charcoal">
              Every drop has a purpose.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              Flooding an orchard wastes water and encourages root rot. We use an automated drip system that meters water directly to the root spread. During winter flowering, we intentionally withhold irrigation to encourage dense blossom panicles, resuming carefully as fruit swells.
            </p>
          </div>
        </div>
      </Section>

      {/* Pruning */}
      <Section background="cream" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-content mx-auto">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-orchard-green">
              <Scissors className="w-5 h-5" />
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-earth-brown">Canopy Architecture</span>
            </div>
            <h2 className="font-display text-section text-charcoal">
              Sometimes, growth needs direction.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              An unpruned mango tree produces many small, shaded fruits prone to disease. Through meticulous post-harvest canopy pruning, we create an open goblet structure. Sunlight bathes every interior branch, morning humidity evaporates rapidly, and the tree directs its resources into larger, sweeter mangoes.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white rounded-softer p-8 shadow-card border border-charcoal/10 aspect-[4/3] flex flex-col justify-center items-center text-center">
              <span className="text-5xl mb-4">✂️</span>
              <h4 className="font-display text-2xl text-charcoal">Airflow & Solar Interception</h4>
              <p className="font-body text-sm text-charcoal/70 max-w-sm mt-2">
                Proper light penetration translates directly into higher Brix sugar content and uniform fruit maturation.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Individual Fruit Protection Bags */}
      <Section background="white" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-content mx-auto">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-soft-sage/40 rounded-softer p-8 border border-charcoal/10 aspect-[4/3] flex flex-col justify-center items-center text-center">
              <span className="text-5xl mb-4">🛡️</span>
              <h4 className="font-display text-2xl text-deep-forest">Zero-Pesticide Barrier</h4>
              <p className="font-body text-sm text-charcoal/70 max-w-sm mt-2">
                Specialized breathable double-layer paper bags create a chemical-free haven for our Golden Kesar crop.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-orchard-green">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-earth-brown">Fruit Protection</span>
            </div>
            <h2 className="font-display text-section text-charcoal">
              Every fruit deserves a little protection.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              When mangoes reach the size of a walnut, our orchard crew individually covers each developing fruit on the branch. This labor of patience protects against egg-laying fruit flies, prevents searing solar scorch, and produces immaculate golden skin without chemical residue.
            </p>
          </div>
        </div>
      </Section>

      {/* Between Seasons & Transparency */}
      <Section background="sage" padding="default">
        <div className="max-w-reading mx-auto space-y-6 text-center">
          <Badge variant="earth">Transparency</Badge>
          <h2 className="font-display text-section text-charcoal">
            The orchard is always teaching us something.
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed">
            Farming is an ongoing practice of observation and humility. We share real updates, candid photos of our trials, and regular glimpses into our grove through our journal.
          </p>
          <div className="pt-2">
            <Button href="/journal" variant="primary">
              Read Notes from the Orchard
            </Button>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section background="green" padding="large">
        <div className="max-w-2xl mx-auto text-center space-y-6 text-white">
          <p className="font-display text-2xl italic text-dawn-gold">
            “Care is not one action. It is everything we do, throughout the season.”
          </p>
          <div className="pt-4">
            <Button href="/shop" variant="gold" size="lg">
              Taste the Result of This Care
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

