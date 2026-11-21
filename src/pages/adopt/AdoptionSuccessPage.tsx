import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Button, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdoptionSuccessPage() {
  const [searchParams] = useSearchParams();
  const treeId = searchParams.get('treeId') || 'KV-021';
  const adoptionId = searchParams.get('adoptionId') || `ADOPT-${treeId}-2025`;

  return (
    <>
      <SEO title="Tree Adoption Confirmed" description="Welcome to Kesari Van orchard family." noIndex />

      <div className="pt-28 pb-20 bg-mango-cream">
        <Container narrow>
          <div className="bg-white p-8 md:p-12 rounded-softer shadow-card border border-charcoal/10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <Badge variant="gold">Tree Adoption Confirmed</Badge>
              <h1 className="font-display text-4xl text-charcoal mt-2">
                It's official. You have a tree of your own.
              </h1>
              <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto mt-2 leading-relaxed">
                Somewhere in our orchard, a tree now has your name connected to it. Thank you for becoming a part of Kesari Van. Your season with us has begun.
              </p>
            </div>

            {/* Official Tree Confirmation Card */}
            <div className="p-6 bg-mango-cream/50 rounded-softer border border-charcoal/10 text-left space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
                <div>
                  <h3 className="font-display text-2xl text-charcoal">Tree {treeId}</h3>
                  <p className="font-body text-xs text-charcoal/60">Gir Kesar · Season 2025</p>
                </div>
                <Badge variant="green">Active</Badge>
              </div>

              <div className="font-body text-xs space-y-2 text-charcoal/80">
                <p><strong>Adoption ID:</strong> {adoptionId}</p>
                <p><strong>Harvest Guarantee:</strong> 25 kg minimum guaranteed yield</p>
                <p><strong>Surplus Yield:</strong> All eligible excess fruit belongs to you</p>
                <p><strong>Location:</strong> Kesari Van Grove, Umbhel, Kamrej, Surat</p>
              </div>
            </div>

            {/* What to Expect Next */}
            <div className="pt-6 border-t border-charcoal/10 text-left max-w-md mx-auto space-y-4">
              <h4 className="font-display text-xl text-charcoal text-center">What Happens Next?</h4>
              <ul className="space-y-3 font-body text-xs text-charcoal/70">
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">1.</span>
                  <span><strong>Physical Plaque:</strong> We will hang your engraved tag on the tree row this week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">2.</span>
                  <span><strong>Weekly Video:</strong> You will begin receiving our collective orchard video dispatch via WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dawn-gold font-bold">3.</span>
                  <span><strong>Harvest Dispatch:</strong> When summer arrives, your 25 kg harvest will be packed and express couriered.</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-charcoal/10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/account/adoptions" variant="primary">
                View My Tree in Account
              </Button>
              <Button href="/visit" variant="outline">
                Plan a Visit <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

