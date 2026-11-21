import React, { useState, useEffect } from 'react';
import { Hero, Section, Button, Input, Textarea, Select, Badge } from '../components/ui';
import { SEO } from '../components/ui/SEO';
import { CONTACT_CATEGORIES } from '../lib/constants';
import { isValidMobile } from '../lib/utils';
import { MapPin, Mail, CheckCircle2, MessageCircle, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useOrchardStore } from '../stores/orchardStore';
import { AuthModal } from '../components/auth/AuthModal';
import { supabase } from '../lib/supabase';
import { isRealSupabaseConfigured } from '../lib/supabaseService';

export default function ContactPage() {
  const { user, profile } = useAuthStore();
  const { addEnquiry } = useOrchardStore();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'General Questions',
    message: '',
  });

  // Pre-fill profile & account details once logged in
  useEffect(() => {
    if (user) {
      const fullName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        : (user.user_metadata?.full_name || '');

      setFormData((prev) => ({
        ...prev,
        name: prev.name || fullName,
        email: user.email || prev.email || '',
        phone: prev.phone || profile?.phone || user.user_metadata?.phone || '',
      }));
    }
  }, [user, profile]);

  const [refNumber, setRefNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isValidMobile(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your enquiry message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedRef = `KV-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Sync to Supabase cloud if configured
      if (isRealSupabaseConfigured()) {
        const { error: dbErr } = await (supabase.from('contact_enquiries') as any).insert({
          reference_number: generatedRef,
          user_id: user.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: user.email || formData.email.trim(),
          category: formData.category,
          message: formData.message.trim(),
          status: 'new',
          is_read: false,
        });

        if (dbErr) {
          console.warn('Note: Supabase enquiry insert response:', dbErr.message);
        }
      }

      // 2. Add to local/hydrated store for instantaneous admin dashboard visibility
      addEnquiry({
        reference_number: generatedRef,
        user_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: user.email || formData.email.trim(),
        category: formData.category,
        message: formData.message.trim(),
        status: 'new',
        is_read: false,
      });

      setRefNumber(generatedRef);
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="bg-white p-8 rounded-soft text-center space-y-4 border border-charcoal/10 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-orchard-green mx-auto" />
                <h4 className="font-display text-2xl text-charcoal">Enquiry Received</h4>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry reference is <strong>{refNumber}</strong>. We will reply to your WhatsApp / email within 24 hours.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setRefNumber(null);
                      setFormData((prev) => ({ ...prev, message: '' }));
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : !user ? (
              /* Forced Sign-Up / Login Gate */
              <div className="bg-white p-8 md:p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-soft-sage/50 text-orchard-green flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-orchard-green" />
                </div>
                <div className="space-y-2">
                  <Badge variant="gold">Customer Account Required</Badge>
                  <h4 className="font-display text-2xl md:text-3xl text-charcoal">Sign In to Send an Enquiry</h4>
                  <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                    Please log in or create your customer account to connect with our orchard team. Signing in links your enquiry directly to your verified contact coordinates so we can provide prompt updates on WhatsApp and email.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsAuthOpen(true)}
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto shadow-md"
                  >
                    Sign In / Create Account
                  </Button>
                  <Button
                    type="button"
                    href="/faq"
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Read Common FAQs
                  </Button>
                </div>
              </div>
            ) : (
              /* Authenticated Enquiry Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-body text-xs text-orchard-green font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orchard-green" /> Signed in as {user.email}
                  </span>
                  <span className="font-body text-xs text-charcoal/40">* Required fields</span>
                </div>

                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number (for WhatsApp Updates)"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit Indian number"
                  />
                  <div>
                    <Input
                      label="Email Address (Account Verified)"
                      type="email"
                      disabled
                      value={user.email || formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="bg-charcoal/5 cursor-not-allowed"
                    />
                    <span className="block text-[11px] text-charcoal/50 mt-1">
                      Linked to your signed-in account
                    </span>
                  </div>
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
                  placeholder="How can we assist you with our mangoes, tree adoption, or visiting the orchard?"
                />

                {errorMsg && (
                  <p className="text-sm text-red-600 font-body">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  className="shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Enquiry...
                    </>
                  ) : (
                    'Send Message'
                  )}
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

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
