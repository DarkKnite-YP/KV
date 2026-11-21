import React, { useState } from 'react';
import { Hero, Section, SectionHeading, Button, Input, Textarea, Select, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { BRAND, BRAND_PHRASES, CONTACT_CATEGORIES } from '../lib/constants';
import { isValidMobile } from '../lib/utils';
import { MapPin, Phone, Mail, CheckCircle2, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'General Questions',
    message: '',
  });

  const [refNumber, setRefNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your enquiry message.');
      return;
    }

    const random = Math.floor(1000 + Math.random() * 9000);
    setRefNumber(`KV-REQ-${random}`);
  }

  return (
    <>
      <SEO
        title="Contact Kesari Van — Connect with the Soil"
        description="Get in touch with Kesari Van orchard in Surat. Questions regarding mango orders, tree adoption, or scheduling visits."
      />

      {/* Hero */}
      <Hero
        eyebrow="GET IN TOUCH"
        headline="Connect with the Soil."
        copy="Whether you have a question about our mangoes, want to adopt a tree, plan a visit, or simply want to know more about Kesari Van—we’re here."
        primaryCTA={{ label: 'Send an Enquiry', href: '#contact-form' }}
        secondaryCTA={{ label: 'Explore FAQ', href: '/faq' }}
        size="large"
      />

      {/* Form & Info Section */}
      <Section id="contact-form" background="white" padding="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-content mx-auto items-start">
          {/* Form Left */}
          <div className="lg:col-span-7 bg-mango-cream/40 p-8 md:p-10 rounded-softer border border-charcoal/10">
            <h3 className="font-display text-3xl text-charcoal mb-2">Send an Enquiry</h3>
            <p className="font-body text-xs text-charcoal/60 mb-6">
              Fill out this form and our orchard team will respond promptly.
            </p>

            {refNumber ? (
              <div className="bg-white p-8 rounded-soft text-center space-y-4 border border-charcoal/10">
                <CheckCircle2 className="w-12 h-12 text-orchard-green mx-auto" />
                <h4 className="font-display text-2xl text-charcoal">Enquiry Received</h4>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
                  Thank you, {formData.name}. Your enquiry reference is <strong>{refNumber}</strong>. We will reply to your WhatsApp / email within 24 hours.
                </p>
                <Button onClick={() => setRefNumber(null)} variant="outline" size="sm">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>

                <Select
                  label="Topic / Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={CONTACT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                />

                <Textarea
                  label="Your Message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our mangoes or orchard?"
                />

                {errorMsg && (
                  <p className="text-sm text-red-600 font-body">{errorMsg}</p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-4">
              <h4 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-3">
                Orchard Coordinates
              </h4>

              <div className="space-y-4 font-body text-sm text-charcoal/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orchard-green flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-charcoal">Orchard Location</strong>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      Kesari Van, Village Umbhel, Kamrej, Surat, Gujarat 394325, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-orchard-green flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-charcoal">Official WhatsApp Support</strong>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      Dedicated assistance for tree adopters and seasonal harvest dispatches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orchard-green flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-charcoal">Email Communication</strong>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      care@kesarivan.in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="bg-soft-sage/40 p-6 rounded-softer border border-charcoal/10 space-y-3">
              <h4 className="font-display text-xl text-charcoal">Looking for Immediate Answers?</h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Check our Frequently Asked Questions for detailed answers about Gir Kesar sizing, our 25 kg adoption guarantee, and courier transit.
              </p>
              <Button href="/faq" variant="outline" size="sm">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

