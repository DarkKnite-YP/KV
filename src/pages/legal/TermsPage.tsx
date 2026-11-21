import React from 'react';
import { Hero, Section, Container } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms & Conditions — Kesari Van"
        description="General terms and conditions governing the use of Kesari Van website, mango orders, and orchard visit services."
      />

      <Hero
        eyebrow="WEBSITE & COMMERCE AGREEMENT"
        headline="A little clarity goes a long way."
        copy="These terms explain how Kesari Van's website, mango collections, orders, and services work."
        size="small"
      />

      <Section background="white" padding="default">
        <Container narrow>
          <div className="space-y-8 font-body text-charcoal/80 text-sm leading-relaxed">
            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">1. About Kesari Van</h3>
              <p>
                Kesari Van operates a mango orchard located in Village Umbhel, Taluka Kamrej, District Surat, Gujarat, India. Our website provides access to agricultural produce, seasonal fruit tree adoptions, educational content, and visit requests.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">2. Agreement to Terms</h3>
              <p>
                By accessing this website, placing an order for mangoes, or submitting a tree adoption reservation, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">3. Products & Seasonal Availability</h3>
              <p>
                All products offered on Kesari Van are seasonal agricultural items. Photographs and harvest estimates represent authentic grove conditions but may exhibit natural agricultural variations in fruit shape, color blush, and ripening tempo.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">4. Orders, Pricing, and Payments</h3>
              <p>
                All prices are stated in Indian Rupees (INR). Shipping charges are disclosed separately before payment. Orders are confirmed upon successful authorization by Razorpay.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">5. Natural Fruit Variation</h3>
              <p>
                Gir Kesar mangoes are grown without chemical dips or artificial ethylene gases. Minor skin variations and freckles are normal markers of authentic orchard fruit and do not constitute defective goods.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">6. Tree Adoption Scope</h3>
              <p>
                Tree adoption is governed specifically by our <a href="/adoption-terms" className="text-orchard-green underline">Tree Adoption Terms</a>. Adoption constitutes a seasonal harvest commitment and confers no property, land, or perpetual equity in the orchard.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">7. Orchard Visit Safety</h3>
              <p>
                All farm visits require advance confirmation. Guests must follow farm instructions, wear proper footwear, supervise accompanying minors, and avoid restricted farm operations.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">8. Intellectual Property</h3>
              <p>
                All texts, orchard photographs, videos, brand phrases, and graphics displayed on this website are the intellectual property of Kesari Van. Unauthorized commercial reproduction is prohibited.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-charcoal mb-2">9. Governing Law & Dispute Resolution</h3>
              <p>
                These terms are governed by the laws of India. Any legal disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Surat, Gujarat.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

