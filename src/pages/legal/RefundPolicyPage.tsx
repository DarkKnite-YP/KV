import React from 'react';
import { Hero, Section, Container, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';

export default function RefundPolicyPage() {
  return (
    <>
      <SEO
        title="Cancellation & Refund Policy — Kesari Van"
        description="Guidelines for order cancellation, perishable damaged fruit claims, tree adoption refunds, and resolution timelines."
      />

      <Hero
        eyebrow="HONEST COMMITMENTS"
        headline="We believe trust grows when things are clear."
        copy="Our transparent guidelines for order cancellations, perishable damage claims, and tree adoption refund scenarios."
        size="small"
      />

      <Section background="white" padding="default">
        <Container narrow>
          <div className="space-y-10 font-body text-charcoal/80 text-sm leading-relaxed">
            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">1. Mango Box Order Cancellations</h3>
              <p>
                Because fresh mangoes are harvested and hand-packed on demand based on confirmed orders, the following cancellation rules apply:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Before Harvest / Packing Stage:</strong> You may cancel your order for a 100% full refund by contacting us before your box status changes to “Preparing”.</li>
                <li><strong>After Dispatch:</strong> Once mango crates have been handed over to the courier network, cancellation is not possible due to the perishable nature of fresh produce.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">2. Damaged or Spoiled Produce Claims</h3>
              <p>
                We stand behind the condition of our fruit. If a box arrives compromised by transit crushing or severe internal rot:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Notify us within <strong>24 hours of delivery</strong>.</li>
                <li>Submit clear photographs or a short video showing the outer shipping label, damaged box, and affected fruit.</li>
                <li>Our team will inspect the claim within 24 hours.</li>
                <li>Upon verification, we will issue a proportionate refund to your original payment method or dispatch a replacement box at our discretion.</li>
              </ol>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">3. Natural Variation is Not Damage</h3>
              <p>
                Gir Kesar mangoes are authentic agricultural produce. Slight surface freckles, minor skin sap marks, variable blush tones, and weight variations within the natural grading range are characteristic of chemical-free orchard mangoes and do not qualify as defect or damage.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">4. Tree Adoption Cancellations & Guarantee Fulfillment</h3>
              <p>
                Adopting a tree is a seasonal agricultural commitment. Specific refund provisions include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Prior to Plaque Allocation:</strong> If you cancel within 48 hours of adoption, a full refund will be processed.</li>
                <li><strong>Tree Health & Substitution:</strong> In the rare event that an adopted tree suffers severe health decline or storm damage, we will notify you and offer either an equivalent tree in the same block or a 100% refund.</li>
                <li><strong>Harvest Shortfall:</strong> We guarantee 25 kg minimum harvest. If adverse weather reduces your tree's yield below 25 kg, the shortfall is fulfilled from the orchard's verified Gir Kesar buffer stock.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">5. Refund Processing Timelines</h3>
              <p>
                Approved refunds are initiated via Razorpay back to your original source payment method (UPI, credit/debit card, or bank account). Financial institutions typically reflect refunds within <strong>5 to 7 business days</strong> from authorization.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">6. Contact for Claims</h3>
              <p>
                For all cancellation and refund inquiries, email <strong>care@kesarivan.in</strong> with your order ID or call our helpline during farm office hours (9:00 AM – 6:00 PM IST).
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

