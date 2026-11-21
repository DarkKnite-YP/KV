import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Button, Card, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { formatPrice } from '../../lib/utils';
import { CheckCircle2, Package, Truck, ArrowRight, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'KV-202505-XXXX';
  const totalParam = searchParams.get('total');
  const total = totalParam ? parseInt(totalParam, 10) : 265000;

  const timeline = [
    { label: 'Order Placed', status: 'completed', desc: 'Payment verified and queued' },
    { label: 'Harvest & Sorting', status: 'upcoming', desc: 'Handpicked from grove rows' },
    { label: 'Dispatched', status: 'upcoming', desc: 'Sent in ventilated crates' },
    { label: 'Delivered', status: 'upcoming', desc: 'Arrives at your doorstep' },
  ];

  return (
    <>
      <SEO title="Order Confirmed" description="Thank you for your order from Kesari Van orchard." noIndex />

      <div className="pt-28 pb-20 bg-mango-cream">
        <Container narrow>
          <div className="bg-white p-8 md:p-12 rounded-softer shadow-card border border-charcoal/10 text-center space-y-6">
            <img src="/logo-dark.svg" alt="Kesari Van" className="h-14 w-auto mx-auto object-contain" />
            <div className="w-16 h-16 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-dawn-gold">
                Harvest Order Confirmed
              </p>
              <h1 className="font-display text-4xl text-charcoal mt-1">
                Your summer just got a little closer.
              </h1>
              <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you for choosing mangoes grown with care. Your order has been placed, and we’ll keep you updated as it makes its way from our orchard to your home.
              </p>
            </div>

            {/* Order Details Badge */}
            <div className="p-4 bg-mango-cream/50 rounded-soft border border-charcoal/10 inline-flex flex-col sm:flex-row gap-4 items-center justify-around w-full text-sm font-body">
              <div>
                <span className="text-charcoal/50 text-xs block">Order Reference</span>
                <span className="font-bold text-charcoal">{orderId}</span>
              </div>
              <div>
                <span className="text-charcoal/50 text-xs block">Payment State</span>
                <Badge variant="green">Verified & Paid</Badge>
              </div>
              <div>
                <span className="text-charcoal/50 text-xs block">Total Amount</span>
                <span className="font-bold text-orchard-green">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-6 border-t border-charcoal/10 text-left">
              <h3 className="font-display text-xl text-charcoal mb-6 text-center">
                Harvest & Delivery Timeline
              </h3>
              <div className="space-y-6 max-w-md mx-auto">
                {timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === 'completed'
                          ? 'bg-orchard-green text-white'
                          : 'bg-charcoal/10 text-charcoal/50'
                      }`}>
                        {idx + 1}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 h-10 bg-charcoal/10 my-1" />
                      )}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-charcoal">{step.label}</p>
                      <p className="font-body text-xs text-charcoal/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-charcoal/10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/account/orders" variant="primary">
                View in My Account
              </Button>
              <Button href="/shop" variant="outline">
                Continue Exploring <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

