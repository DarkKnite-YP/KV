import React from 'react';
import { Hero, Section, SectionHeading, Button, Card, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { BRAND, BRAND_PHRASES, MANGO_VARIETIES } from '../lib/constants';
import { MapPin } from 'lucide-react';

export default function OrchardPage() {
  const seasonalCycle = [
    {
      phase: '1. New Growth',
      timing: 'July – October',
      desc: 'Following monsoon rains, copper-tinted young leaves unfurl across the canopy, gathering energy for the dormant winter.',
    },
    {
      phase: '2. Flowering',
      timing: 'December – February',
      desc: 'Delicate cream panicles burst into bloom. Bees and native pollinators fill the morning air as fruit set begins.',
    },
    {
      phase: '3. Fruit Development',
      timing: 'February – April',
      desc: 'Marble-sized fruits swell. We selectively thin fruit, fit protective bags, and regulate micro-irrigation.',
    },
    {
      phase: '4. Harvest',
      timing: 'May – June',
      desc: 'Summer brings peak sweetness. Mangoes are hand-harvested at mature unripened stage with gentle shears.',
    },
  ];

  return (
    <>
      <SEO
        title="Our Orchard — A Little World Beneath the Canopy"
        description="Explore the 900+ tree mango orchard at Kesari Van in Umbhel, Kamrej, Surat. Discover our seasonal cycles, varieties, and living ecosystem."
      />

      {/* Hero */}
      <Hero
        eyebrow="OUR ORCHARD · SURAT, GUJARAT"
        headline="A little world beneath the canopy."
        copy="Nearly a thousand trees. Countless leaves. One orchard growing, season by season."
        primaryCTA={{ label: 'Plan a Visit', href: '/visit#visit-form' }}
        secondaryCTA={{ label: 'Adopt a Tree', href: '/adopt-a-tree' }}
        size="large"
      />

      {/* Living Orchard */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto space-y-6 text-center">
          <Badge variant="green">Living Farm</Badge>
          <h2 className="font-display text-section text-charcoal">
            Not an estate frozen in time. A living orchard in progress.
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed text-pretty">
            Planted in October 2023 across former sugarcane fields, Kesari Van is young, vibrant, and evolving with every passing monsoon. You will not find manicured lawns or concrete pathways here—only the quiet rhythm of 900+ trees sinking their roots deep into Surat soil.
          </p>
        </div>
      </Section>

      {/* Varieties */}
      <Section background="cream" padding="default">
        <SectionHeading
          eyebrow="Varieties in the Grove"
          title="One orchard. Many varieties. A season of discovery."
          subtitle="While Gir Kesar is our principal queen, our grove includes diverse regional varieties being nurtured for future seasons."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MANGO_VARIETIES.map((variety) => (
            <Card key={variety} padding="md" className="text-center bg-white border border-charcoal/5">
              <span className="text-3xl mb-2 block">🍃</span>
              <h4 className="font-display text-xl text-charcoal">{variety}</h4>
              <p className="font-body text-xs text-charcoal/60 mt-1">
                {variety === 'Kesar' ? 'Primary harvest' : 'Orchard trial row'}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Seasonal Cycle */}
      <Section background="white" padding="default">
        <SectionHeading
          eyebrow="The Rhythm of the Year"
          title="The Four Seasons of Kesari Van"
          subtitle="An orchard is never idle. Each month brings distinct tasks, patience, and transformation."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalCycle.map((cycle, idx) => (
            <div key={idx} className="p-6 rounded-softer bg-mango-cream/40 border border-charcoal/5 flex flex-col justify-between space-y-4">
              <div>
                <Badge variant="gold" size="sm">{cycle.timing}</Badge>
                <h3 className="font-display text-2xl text-charcoal mt-3 mb-2">{cycle.phase}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  {cycle.desc}
                </p>
              </div>
              <div className="text-xs font-body font-semibold text-orchard-green uppercase tracking-wider">
                Stage 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Location Section - CTA to visit form */}
      <Section background="cream" padding="default">
        <div className="max-w-reading mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-soft-sage text-orchard-green mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="font-display text-section text-charcoal">
            Find us in Kamrej, Surat.
          </h2>
          <p className="font-body text-base text-charcoal/70 leading-relaxed">
            Village Umbhel, Taluka Kamrej, District Surat, Gujarat 394325. Conveniently accessible from the NH48 corridor, yet tucked away in quiet rural fields. Visits are arranged by prior schedule.
          </p>
          <div className="pt-2">
            <Button href="/visit#visit-form" variant="primary">
              Schedule a Visit
            </Button>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section background="green" padding="default">
        <div className="text-center text-white space-y-4">
          <p className="font-display text-2xl italic text-dawn-gold">
            “{BRAND_PHRASES.gatesOpen}”
          </p>
          <div className="pt-2">
            <Button href="/shop" variant="gold">
              Taste This Year's Fruit
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
