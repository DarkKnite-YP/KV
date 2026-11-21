import React from 'react';
import { Hero, Section, Container } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy — Kesari Van"
        description="Learn how Kesari Van collects, protects, and handles your personal information under applicable Indian data privacy regulations."
      />

      <Hero
        eyebrow="PRIVACY & INTEGRITY"
        headline="Your information deserves the same care as our trees."
        copy="We respect your privacy. Here is how your personal information is collected, processed, and secured."
        size="small"
      />

      <Section background="white" padding="default">
        <Container narrow>
          <div className="space-y-8 font-body text-charcoal/80 text-sm leading-relaxed">
            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">1. Overview</h3>
              <p>
                Kesari Van operates the website <code>kesarivan.in</code> to offer fresh Gir Kesar mangoes, seasonal tree adoptions, and orchard visit requests. This Privacy Policy outlines our data practices in compliance with applicable Indian data protection laws, including the Digital Personal Data Protection Act (DPDPA).
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">2. Information We Collect</h3>
              <p>We collect only the details necessary to fulfill your orders and adoptions:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Contact Identifiers:</strong> Name, mobile phone number, email address.</li>
                <li><strong>Delivery Addresses:</strong> Street address, city, state, postal PIN code.</li>
                <li><strong>Commerce Data:</strong> Ordered mango boxes, tree adoption records, transaction reference IDs.</li>
                <li><strong>Account Credentials:</strong> Secure session tokens managed by Supabase Auth.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">3. Payment Information Security</h3>
              <p>
                All online payments are securely processed through Razorpay. Kesari Van <strong>never collects, stores, or sees your full credit/debit card numbers, UPI PINs, or banking credentials</strong>. Razorpay complies with PCI-DSS standards.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">4. How We Use Your Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>To pack and deliver your harvest crates to the correct postal address.</li>
                <li>To send operational order updates and WhatsApp courier tracking alerts.</li>
                <li>To send weekly video dispatches to registered tree adopters.</li>
                <li>To coordinate orchard visit access and confirm appointment schedules.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">5. Third-Party Service Providers</h3>
              <p>
                We do not sell, rent, or trade your personal data. We share necessary details exclusively with trusted operational partners:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Logistics Partners:</strong> Courier partners receive your name, address, and mobile number solely for parcel delivery.</li>
                <li><strong>Supabase:</strong> Cloud database, authentication, and encrypted data storage.</li>
                <li><strong>Razorpay:</strong> Payment processing gateway.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">6. Communications & Opt-Out</h3>
              <p>
                We send service-critical communications regarding your order or adoption via email and WhatsApp. You may opt out of non-essential updates at any time by replying "STOP" on WhatsApp or clicking unsubscribe in our emails.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">7. Data Retention & Your Rights</h3>
              <p>
                You have the right to request access, correction, or deletion of your profile data. Reach out to our privacy officer at <strong>care@kesarivan.in</strong> for assistance.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

