import React from 'react';
import { Hero, Section, SectionHeading, Button, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { BRAND, BRAND_PHRASES } from '../lib/constants';
import { Sprout, Droplets, Scissors, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export default function OurStoryPage() {
  return (
    <>
      <SEO
        title="Our Story — From Sugarcane to Mango Trees"
        description="The story of Kesari Van in Kamrej, Surat. Established in 2023, converting depleted sugarcane fields into a vibrant Gir Kesar mango orchard."
      />

      {/* Hero (APPROVED & LOCKED) */}
      <Hero
        eyebrow="OUR STORY · ROOTED IN SURAT"
        headline="Every orchard begins with a decision."
        copy="Ours began with the thought that this land could grow into something different—not just a crop for a season, but something that would take years to grow, and years to mean something."
        primaryCTA={{ label: 'Explore the Orchard', href: '/orchard' }}
        secondaryCTA={{ label: 'Farming Practices', href: '/farming-practices' }}
        size="large"
      />

      {/* Origin Story */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto space-y-6">
          <Badge variant="gold">Origin & Decision</Badge>
          <h2 className="font-display text-section text-charcoal">
            From sugarcane fields to a future rooted in mango trees.
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed">
            In October 2023, our land in Umbhel, Kamrej was covered in sugarcane—a crop that demanded heavy chemical inputs and relentless irrigation, leaving the ground hardened and lifeless. We saw a different possibility: an ecosystem that restores the land, encourages natural biodiversity, and produces fruit of unmistakable integrity.
          </p>
          <p className="font-body text-base text-charcoal/80 leading-relaxed">
            We broke the compacted plow pan, enriched the soil with organic compost and green cover crops, and planted over 900 young Gir Kesar saplings. We committed to letting nature set the pace.
          </p>
        </div>
      </Section>

      {/* Meet Yash Section */}
      <Section background="cream" padding="default">
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-softer overflow-hidden bg-soft-sage/60 aspect-[4/5] shadow-card flex flex-col items-center justify-center p-8 text-center border border-charcoal/5">
              <span className="text-6xl mb-4">🌱</span>
              <h3 className="font-display text-2xl text-deep-forest">Yash Patel</h3>
              <p className="font-body text-xs text-charcoal/60 uppercase tracking-widest mt-1">Founder & Grower</p>
              <p className="font-body text-sm text-charcoal/70 mt-4 max-w-xs italic">
                “Farming is not an industrial process; it is a conversation with soil and season.”
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="earth">Meet the Founder</Badge>
            <h2 className="font-display text-section text-charcoal">
              Meet Yash. The person growing this dream.
            </h2>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              Yash’s approach is rooted in patient stewardship. Rather than chasing artificial yields through chemical shortcuts, he spends his days walking the rows, examining leaf flushes, monitoring drip drippers, and understanding each tree’s development.
            </p>
            <p className="font-body text-base text-charcoal/80 leading-relaxed">
              “When you plant a mango tree, you don’t harvest tomorrow. You commit to several seasons of quiet work before you taste the first reward. That timescale changes how you think about everything.”
            </p>
          </div>
        </div>
      </Section>

      {/* Farming Philosophy & Principles */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto text-center space-y-4 mb-16">
          <Badge variant="green">Growing Philosophy</Badge>
          <h2 className="font-display text-section text-charcoal">
            We are not just farming. We are curating an ecosystem.
          </h2>
          <p className="font-body text-base text-charcoal/70 leading-relaxed">
            Every leaf tells a story of care. Every fruit carries the work of an entire season. We believe good mangoes begin with a healthy growing environment—built through observation, thoughtful practices, and care for the orchard as a whole.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-content mx-auto">
          <div className="p-8 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-sage text-orchard-green rounded-full">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">Nourish the Soil</h3>
            </div>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Healthy fruit requires healthy microbial life underground. We use natural compost, mulch, and organic amendments to restore fungal-bacterial balance. We do not claim certified organic, but we farm with genuine soil reverence.
            </p>
          </div>

          <div className="p-8 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-sage text-orchard-green rounded-full">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">Water With Purpose</h3>
            </div>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Water is life, not something to flood indiscriminately. Our precision drip system feeds water directly to active feeder roots, preventing evaporation and conserving the precious groundwater of Kamrej.
            </p>
          </div>

          <div className="p-8 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-sage text-orchard-green rounded-full">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">Prune With Precision</h3>
            </div>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              We shape every tree’s canopy to create open internal sunlight channels and continuous airflow. Pruning directs plant vitality into fewer, exceptionally sized, nutrient-dense fruits.
            </p>
          </div>

          <div className="p-8 rounded-soft bg-mango-cream/40 border border-charcoal/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-sage text-orchard-green rounded-full">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">Protect What Grows</h3>
            </div>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Instead of blanket chemical pesticides, our Golden Kesar fruits are enveloped in individual breathable paper bags while on the branch. Nature ripens inside this protective shell with unblemished skin.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="font-display text-xl text-orchard-green italic mb-4">
            “Care is not one action. It is everything we do, throughout the season.”
          </p>
          <Button href="/farming-practices" variant="outline">
            Read Full Farming Practices <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Section>

      {/* Location - CTA to visit form */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-soft-sage text-orchard-green mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="font-display text-section text-charcoal">
            Rooted in Surat. Growing Gir Kesar.
          </h2>
          <p className="font-body text-base text-charcoal/70 leading-relaxed">
            Located in Umbhel, Kamrej, Surat, Gujarat—not Gir. We take pride in cultivating this noble Gujarati cultivar in the microclimate and rich soils of South Gujarat.
          </p>
          <div className="pt-4">
            <Button href="/visit#visit-form" variant="primary">
              Plan an Orchard Visit
            </Button>
          </div>
        </div>
      </Section>

      {/* Close */}
      <Section background="forest" padding="large">
        <div className="max-w-2xl mx-auto text-center space-y-6 text-white">
          <h2 className="font-display text-section text-white">
            “{BRAND_PHRASES.gatesOpen}”
          </h2>
          <p className="font-body text-base text-white/80">
            Whether you choose to taste our harvest or adopt a tree for your family, welcome to our journey.
          </p>
          <div className="pt-4">
            <Button href="/shop" variant="gold" size="lg">
              Explore The Harvest
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
