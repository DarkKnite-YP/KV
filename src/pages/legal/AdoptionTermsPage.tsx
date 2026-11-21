import React from 'react';
import { Hero, Section, Container, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { formatPrice } from '../../lib/utils';
import { BRAND } from '../../lib/constants';

export default function AdoptionTermsPage() {
  return (
    <>
      <SEO
        title="Tree Adoption Terms — Seasonal Agreement"
        description="Official seasonal agreement for adopting a Gir Kesar mango tree at Kesari Van. Details regarding the 25 kg guarantee, excess harvest, and visits."
      />

      <Hero
        eyebrow="TREE ADOPTION · SEASONAL AGREEMENT"
        headline="A tree of your own. A season to share."
        copy="This document defines the mutual responsibilities, harvest guarantee, and operational terms governing your seasonal mango tree adoption at Kesari Van."
        size="small"
      />

      <Section background="white" padding="default">
        <Container narrow>
          <div className="space-y-10 font-body text-charcoal/80 text-sm leading-relaxed">
            {/* Key Terms Panel */}
            <div className="p-6 md:p-8 bg-mango-cream/50 rounded-softer border border-charcoal/10 space-y-4">
              <Badge variant="gold">Summary of Core Terms</Badge>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs text-charcoal">
                <div><strong>Adoption Fee:</strong> {formatPrice(BRAND.adoptionPrice)} per season</div>
                <div><strong>Tree Selection:</strong> 1 designated numbered tree (KV-001 to KV-100)</div>
                <div><strong>Cultivar:</strong> Authentic Gir Kesar grafted sapling</div>
                <div><strong>Minimum Guarantee:</strong> 25 kg fresh Gir Kesar mangoes</div>
                <div><strong>Surplus Yield:</strong> Eligible excess yield belongs to the adopter</div>
                <div><strong>Shipping Charges:</strong> Billed separately prior to harvest dispatch</div>
                <div><strong>Term:</strong> Single mango season (2025)</div>
                <div><strong>Orchard Location:</strong> Umbhel, Kamrej, Surat, Gujarat</div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">1. Nature of the Adoption</h3>
              <p>
                Adoption is a seasonal agricultural relationship. It provides the adopter with the harvest yield of a specific numbered tree, seasonal video updates, and farm visit privileges. Adoption does <strong>not convey land ownership, real estate rights, or permanent equity</strong> in the orchard or tree.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">2. Tree Selection & Numbering</h3>
              <p>
                Adopters choose from an inventory of 100 available trees. Upon payment confirmation, the selected Tree ID (e.g., KV-021) is bound to your account, and a physical engraved plaque is affixed to the designated tree row.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">3. Minimum Harvest Guarantee (25 kg)</h3>
              <p>
                Kesari Van guarantees that you will receive at least 25 kg of fresh Gir Kesar mangoes. If unfavorable microclimatic events or natural fruit drop cause your specific tree to produce less than 25 kg, the shortfall will be supplemented from our orchard's reserve Gir Kesar trees to fulfill the full 25 kg guarantee.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">4. Excess Yield Entitlement</h3>
              <p>
                If your adopted tree produces an abundant harvest exceeding the 25 kg threshold, all eligible sound fruit harvested from that tree belongs to you at no additional adoption fee. Additional courier shipping charges apply for delivering the excess weight.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">5. Orchard-Wide Weekly Updates</h3>
              <p>
                Adopters receive collective orchard video updates shared once weekly during the active season via WhatsApp and email, showing flowering, fruit bagging, and canopy progress. We do not provide individualized live streaming feeds for each tree.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">6. Orchard Visits</h3>
              <p>
                Adopters and their immediate families are warmly invited to visit their tree in Surat during the season by prior appointment. Visits must be booked in advance to avoid conflicts with farm irrigation and cultural operations.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">7. Shipping Charges</h3>
              <p>
                Shipping costs are calculated separately based on courier rates and destination PIN code. Prior to harvest dispatch, adopters will receive an invoice for the courier fee based on the total box weight.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl text-charcoal">8. No Silent Substitution</h3>
              <p>
                In the rare event that an adopted tree suffers severe storm damage or disease, we will promptly notify the adopter and provide the option of selecting an equivalent tree or receiving a full refund. We never substitute a tree silently.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

