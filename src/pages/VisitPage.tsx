import React, { useState } from 'react';
import { Hero, Section, SectionHeading, Button, Input, Textarea, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { BRAND, BRAND_PHRASES } from '../lib/constants';
import { isValidMobile } from '../lib/utils';
import { useOrchardStore } from '../stores/orchardStore';
import { supabase } from '../lib/supabase';
import { isRealSupabaseConfigured } from '../lib/supabaseService';
import { MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function VisitPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    visitors: '2',
    message: '',
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const addVisitRequest = useOrchardStore((s) => s.addVisitRequest);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!isValidMobile(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.date) {
      setErrorMsg('Please select a preferred visit date.');
      return;
    }

    const refNum = addVisitRequest({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      preferred_date: formData.date,
      number_of_visitors: parseInt(formData.visitors, 10) || 2,
      message: formData.message || null,
    });

    // Sync to Supabase Cloud
    if (isRealSupabaseConfigured()) {
      (supabase.from('visit_requests') as any).insert({
        request_number: refNum,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        preferred_date: formData.date,
        number_of_visitors: parseInt(formData.visitors, 10) || 2,
        message: formData.message || null,
        status: 'pending',
      }).then(({ error }: any) => {
        if (error) console.warn('Supabase visit request error:', error);
      });
    }

    setSubmittedRef(refNum);
  }

  return (
    <>
      <SEO
        title="Visit Kesari Van — An Authentic Working Orchard"
        description="Experience Kesari Van in person. Schedule a visit to walk our mango grove in Umbhel, Kamrej, Surat. Advance confirmation required."
      />

      {/* Hero */}
      <Hero
        eyebrow="COME A LITTLE CLOSER"
        headline="Some things are better experienced in person."
        copy="Walk beneath the trees. See where your mangoes grow. Experience the orchard beyond the box that reaches your home."
        primaryCTA={{ label: 'Plan Your Visit', href: '#visit-form' }}
        secondaryCTA={{ label: 'Our Story', href: '/our-story' }}
        size="large"
      />

      {/* Philosophy */}
      <Section background="white" padding="default">
        <div className="max-w-reading mx-auto text-center space-y-6">
          <Badge variant="earth">Real Farm Atmosphere</Badge>
          <h2 className="font-display text-section text-charcoal">
            “It's not a tourist attraction. It's our orchard.”
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed text-pretty">
            Kesari Van is a real working farm. There are no amusement rides, concrete promenades, or synthetic attractions here. You will find dirt paths between 900+ trees, active drip lines, birds nesting in the foliage, and the scent of warm earth.
          </p>
        </div>
      </Section>

      {/* Highlights */}
      <Section background="cream" padding="default">
        <SectionHeading
          eyebrow="What You'll Experience"
          title="Moments in the Grove"
          subtitle="Every season reveals a different facet of the orchard's life."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-content mx-auto">
          <div className="p-6 bg-white rounded-softer shadow-card border border-charcoal/5 space-y-3">
            <span className="text-3xl">🚶</span>
            <h4 className="font-display text-xl text-charcoal">Walk the Canopy</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Stroll down shaded rows under the morning sun and observe the growth architecture of mature grafts.
            </p>
          </div>
          <div className="p-6 bg-white rounded-softer shadow-card border border-charcoal/5 space-y-3">
            <span className="text-3xl">🥭</span>
            <h4 className="font-display text-xl text-charcoal">Discover Varieties</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Compare Gir Kesar with Sonpari, Totapuri, and experimental trials planted across our blocks.
            </p>
          </div>
          <div className="p-6 bg-white rounded-softer shadow-card border border-charcoal/5 space-y-3">
            <span className="text-3xl">💧</span>
            <h4 className="font-display text-xl text-charcoal">See Soil & Water Care</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Examine our subsurface drip emitters, compost amendments, and protective paper fruit bagging firsthand.
            </p>
          </div>
          <div className="p-6 bg-white rounded-softer shadow-card border border-charcoal/5 space-y-3">
            <span className="text-3xl">☕</span>
            <h4 className="font-display text-xl text-charcoal">Honest Conversations</h4>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Sit in the shaded farm gazebo and discuss soil biology and clean agriculture with Yash and our crew.
            </p>
          </div>
        </div>
      </Section>

      {/* Visit Request Form & Guidelines */}
      <Section id="visit-form" background="white" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-content mx-auto items-start">
          {/* Form Left */}
          <div className="lg:col-span-7 bg-mango-cream/40 p-8 md:p-10 rounded-softer border border-charcoal/10">
            <h3 className="font-display text-3xl text-charcoal mb-2">
              Plan Your Visit
            </h3>
            <p className="font-body text-xs text-charcoal/60 mb-6">
              Because Kesari Van is a functioning farm, visits are arranged exclusively by prior confirmation.
            </p>

            {submittedRef ? (
              <div className="bg-white p-8 rounded-soft text-center space-y-4 border border-charcoal/10 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-orchard-green mx-auto" />
                <Badge variant="gold">Request Logged: {submittedRef}</Badge>
                <h4 className="font-display text-2xl text-charcoal">Visit Request Received</h4>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
                  Thank you, {formData.name}. We have logged your request for {formData.date}.
                </p>
                <div className="p-4 bg-mango-cream/60 rounded-soft text-xs font-body text-charcoal/80 text-left border-l-4 border-dawn-gold space-y-1">
                  <strong>Important Notice:</strong> This is a request submission, not an instant booking. Our orchard team will check seasonal farming activities and contact you via WhatsApp to confirm an available slot.
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setSubmittedRef(null);
                      setFormData({ name: '', phone: '', email: '', date: '', visitors: '2', message: '' });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                  />
                  <Input
                    label="Mobile Number (WhatsApp)"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <Input
                    label="Number of Visitors"
                    type="number"
                    min="1"
                    max="15"
                    required
                    value={formData.visitors}
                    onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                  />
                </div>

                <Input
                  label="Email (Optional)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                />

                <Textarea
                  label="Notes or Questions for Us (Optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Let us know if you've adopted a tree or have specific interests..."
                />

                {errorMsg && (
                  <p className="text-sm text-red-600 font-body">{errorMsg}</p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Submit Visit Request
                </Button>
              </form>
            )}
          </div>

          {/* Guidelines Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-4">
              <div className="flex items-center gap-2 text-orchard-green">
                <ShieldAlert className="w-5 h-5" />
                <h4 className="font-display text-xl text-charcoal">Orchard Guidelines</h4>
              </div>
              <ul className="space-y-3 font-body text-xs text-charcoal/70 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span><strong>Prior confirmation required:</strong> Unannounced walk-ins cannot be accommodated due to irrigation and spraying schedules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span><strong>Footwear:</strong> Wear comfortable walking shoes or boots suitable for uneven, natural orchard soil.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span><strong>Children:</strong> Children must be supervised at all times around water lines and farm equipment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">✓</span>
                  <span><strong>Do not pick fruit:</strong> Fruit is counted, protected, and monitored. Plucking damages next season's wood.</span>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div className="bg-soft-sage/40 p-6 md:p-8 rounded-softer border border-charcoal/10 space-y-3 font-body text-xs text-charcoal/80">
              <div className="flex items-center gap-2 text-orchard-green">
                <MapPin className="w-5 h-5" />
                <h4 className="font-display text-lg text-charcoal">Location Coordinates</h4>
              </div>
              <p><strong>Kesari Van Mango Orchard</strong></p>
              <p>Village Umbhel, Taluka Kamrej, District Surat, Gujarat 394325</p>
              <p className="text-charcoal/60">Approx. 25 minutes from Surat Central via NH48.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section background="green" padding="large">
        <div className="text-center text-white space-y-4 max-w-lg mx-auto">
          <h2 className="font-display text-section text-white">
            “We’ll leave the gate open for you.”
          </h2>
          <p className="font-body text-sm text-white/80">
            {BRAND_PHRASES.connectWithSoil}
          </p>
        </div>
      </Section>
    </>
  );
}
