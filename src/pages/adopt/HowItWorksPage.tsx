import React from 'react';
import { Hero, Section, SectionHeading, Button, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Tree',
      desc: 'Browse our launch collection of 100 real numbered trees. Review each tree’s location in the grove and select the exact Tree ID you want.',
    },
    {
      num: '02',
      title: 'Secure Reservation & Checkout',
      desc: 'Lock in your tree with a 15-minute temporary reservation. Complete payment of ₹6,499 securely through Razorpay.',
    },
    {
      num: '03',
      title: 'Tree Tagging & Certificate',
      desc: 'We physically engrave and hang your personalized name plaque on the tree in Surat, and issue your official digital Adoption Certificate.',
    },
    {
      num: '04',
      title: 'Orchard-Wide Updates',
      desc: 'Receive weekly video and photographic dispatches via WhatsApp and email as your tree travels through flowering and fruit growth.',
    },
    {
      num: '05',
      title: 'Visit Opportunity',
      desc: 'Schedule a visit to walk beneath the canopy, touch your tree, and see how our conscious farming practices work in person.',
    },
    {
      num: '06',
      title: 'Harvest Fulfillment',
      desc: 'At peak summer maturity, your tree’s fruit is hand-harvested. You receive a guaranteed minimum of 25 kg plus any eligible surplus yield!',
    },
  ];

  return (
    <>
      <SEO
        title="How Tree Adoption Works — 100 Trees, One Season"
        description="Step-by-step guide to adopting a mango tree at Kesari Van. Learn about the 25 kg guarantee, tree selection, updates, and harvest fulfillment."
      />

      {/* Hero */}
      <Hero
        eyebrow="100 TREES · ONE SEASON"
        headline="What if you could choose the tree your mangoes come from?"
        copy="Out of more than 900 trees at Kesari Van, we’re opening just 100 trees for adoption this season. Choose the one you like. Follow its growth, see how it is cared for, and know the tree behind the mangoes that reach your home."
        primaryCTA={{ label: 'Choose Your Tree', href: '/adopt-a-tree' }}
        secondaryCTA={{ label: 'View Adoption Terms', href: '/adoption-terms' }}
        size="large"
      />

      {/* Step by Step */}
      <Section background="white" padding="default">
        <SectionHeading
          eyebrow="The 6-Step Journey"
          title="From Selection to Doorstep Harvest"
          subtitle="A transparent, honest process designed to bring you closer to the land."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-content mx-auto">
          {steps.map((step) => (
            <div key={step.num} className="p-8 rounded-softer bg-mango-cream/40 border border-charcoal/10 flex flex-col justify-between space-y-4">
              <div>
                <span className="font-display text-4xl font-bold text-dawn-gold">{step.num}</span>
                <h3 className="font-display text-2xl text-charcoal mt-3 mb-2">{step.title}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">{step.desc}</p>
              </div>
              <div className="text-xs font-body font-semibold text-orchard-green uppercase tracking-wider pt-2">
                Phase {step.num}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/adopt-a-tree" variant="primary" size="lg">
            Browse Available Trees <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Section>

      {/* Guarantee & Terms Summary */}
      <Section background="sage" padding="default">
        <div className="max-w-reading mx-auto space-y-6 text-center">
          <Badge variant="earth">Harvest Confidence</Badge>
          <h2 className="font-display text-section text-charcoal">
            The 25 kg Harvest Guarantee
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed">
            Nature has unpredictable weather, but your adoption should not feel like a gamble. We guarantee a minimum delivery of 25 kg of prime Gir Kesar mangoes from the orchard. If your tree exceeds 25 kg, all eligible surplus fruit is yours. Shipping is billed separately at harvest.
          </p>
          <div className="pt-2">
            <Button href="/adoption-terms" variant="outline">
              Read Complete Adoption Terms
            </Button>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section background="green" padding="default">
        <div className="text-center text-white space-y-4 max-w-lg mx-auto">
          <p className="font-display text-2xl italic text-dawn-gold">
            “You know the mango. Now know the tree.”
          </p>
          <div className="pt-2">
            <Button href="/adopt-a-tree" variant="gold">
              Select Your 2025 Tree
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

