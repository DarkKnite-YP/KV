import React, { useState } from 'react';
import { Hero, Section, Container, Button, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { SERVICEABLE_STATES } from '../../lib/constants';
import { isValidPincode } from '../../lib/utils';
import { Truck, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function ShippingPage() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<'idle' | 'yes' | 'no'>('idle');

  function checkPin() {
    if (!isValidPincode(pincode)) {
      setResult('no');
      return;
    }
    const prefix = pincode.substring(0, 2);
    if (['36', '37', '38', '39', '40', '41', '42', '44', '30', '31', '32', '34', '45', '46', '47', '48'].includes(prefix)) {
      setResult('yes');
    } else {
      setResult('no');
    }
  }

  return (
    <>
      <SEO
        title="Shipping & Delivery Policy — Kesari Van"
        description="Fresh harvest shipping regions, transit windows, ventilated packing standards, and PIN code serviceability across Western India."
      />

      <Hero
        eyebrow="FRESH HARVEST LOGISTICS"
        headline="A little journey from the orchard to you."
        copy="Fresh mangoes are living, perishable gifts of summer. Here is how we harvest, package, and courier our fruit to ensure maximum aroma and integrity."
        size="small"
      />

      <Section background="white" padding="default">
        <Container narrow>
          <div className="space-y-10 font-body text-charcoal/80 text-sm leading-relaxed">
            {/* PIN Code Checker */}
            <div className="p-6 bg-mango-cream/40 rounded-softer border border-charcoal/10 space-y-4">
              <div className="flex items-center gap-2 text-orchard-green">
                <Truck className="w-5 h-5" />
                <h3 className="font-display text-xl text-charcoal">Check Courier Serviceability</h3>
              </div>
              <p className="text-xs text-charcoal/70">
                We deliver fresh fruit across Gujarat, Maharashtra, Rajasthan, and Madhya Pradesh via express network.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="bg-white border border-charcoal/20 rounded-soft px-4 py-2.5 text-sm w-48 focus:outline-none focus:border-orchard-green"
                />
                <Button onClick={checkPin} variant="primary" size="sm">
                  Verify PIN
                </Button>
              </div>
              {result === 'yes' && (
                <p className="text-xs text-green-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> PIN {pincode} is serviceable for harvest delivery!
                </p>
              )}
              {result === 'no' && (
                <p className="text-xs text-amber-800">
                  PIN {pincode} may require special courier routing. Please contact us for custom delivery confirmation.
                </p>
              )}
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">1. Serviceable States & Regions</h3>
              <p>
                To preserve fruit freshness and prevent excessive transit heat, regular online orders are limited to serviceable postal PINs in:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {SERVICEABLE_STATES.map((s) => (
                  <li key={s} className="font-medium text-charcoal">{s}</li>
                ))}
              </ul>
              <p className="text-xs text-charcoal/60">
                Deliveries to other Indian states or international destinations require pre-arranged air-express cold chain logistics.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">2. Packing & Protection Standards</h3>
              <p>
                Our boxes are purpose-engineered for Indian summer transit:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Heavy 5-Ply Corrugated Cardboard:</strong> Ventilated fluting allows ambient air exchange while protecting against compression damage.</li>
                <li><strong>Wood Wool & Paper Separators:</strong> Eco-friendly, unbleached cushioning ensures mangoes do not strike each other during movement.</li>
                <li><strong>Stem Preservation:</strong> Fruit is harvested with a 1–2 cm stem intact to prevent natural sap loss and maintain fruit firmness.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">3. Shipping Fees & Separate Disclosure</h3>
              <p>
                Shipping charges are calculated separately from mango prices and disclosed transparently at checkout prior to payment. Charges depend on destination state, courier rate, and box gross weight. Typical surface express rates average ₹250 within Gujarat and ₹350–₹450 for neighboring states per 10 kg box.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">4. Harvest Schedules & Dispatch Windows</h3>
              <p>
                Mangoes ripen under natural climatic conditions. While we provide estimated dispatch dates, harvest timing depends on temperature and fruit maturity indices. When your harvest is picked and packed, you will receive an SMS and WhatsApp dispatch alert with tracking coordinates.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">5. Delivery Attempts & Perishable Responsibility</h3>
              <p>
                Because fresh mangoes cannot withstand prolonged storage in courier warehouses, recipients must ensure someone is present to accept delivery at the provided address. Courier partners typically make up to two delivery attempts. Kesari Van cannot accept liability for fruit spoilage caused by incorrect recipient contact details, refusal to accept delivery, or unavailable consignees.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-charcoal">6. In-Transit Damage Reporting</h3>
              <p>
                If your crate arrives with visible transit crushing or damaged fruit, photograph the parcel exterior and affected mangoes immediately and report it to <strong>care@kesarivan.in</strong> or our WhatsApp helpline within <strong>24 hours of delivery</strong>. We will review and provide a fair resolution under our Refund Policy.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

