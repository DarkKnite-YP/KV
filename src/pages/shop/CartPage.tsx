import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Section, Container, Button, EmptyState } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice, isValidPincode } from '../../lib/utils';
import { SERVICEABLE_STATES } from '../../lib/constants';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { lines, removeItem, updateQuantity, subtotal, totalItems } = useCartStore();

  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'serviceable' | 'unserviceable'>('idle');

  function checkPincode() {
    if (!isValidPincode(pincode)) {
      setPinStatus('unserviceable');
      return;
    }
    // Simulation: 38xxxx, 39xxxx (Gujarat), 40xxxx (MH), 30xxxx (RJ), 45xxxx (MP)
    const prefix2 = pincode.substring(0, 2);
    if (['36', '37', '38', '39', '40', '41', '42', '44', '30', '31', '32', '34', '45', '46', '47', '48'].includes(prefix2)) {
      setPinStatus('serviceable');
    } else {
      setPinStatus('unserviceable');
    }
  }

  if (lines.length === 0) {
    return (
      <>
        <SEO title="Your Basket" description="Review items in your Kesari Van shopping basket." />
        <div className="pt-28 pb-20 bg-mango-cream min-h-[70vh] flex items-center justify-center">
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16 text-charcoal/30 mx-auto" />}
            title="Your basket is still growing."
            description="You haven’t added any mango collections yet. Explore our freshly harvested Gir Kesar boxes."
            action={{ label: 'Explore the Harvest', href: '/shop' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Shopping Basket" description="Review your selected mango boxes before checkout." />

      <div className="pt-24 pb-20 bg-mango-cream">
        <Container>
          <div className="max-w-reading mx-auto text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-charcoal">
              A little sunshine, almost on its way.
            </h1>
            <p className="font-body text-sm text-charcoal/70 mt-2">
              Take a moment to check your collection. Your mangoes are waiting for the season to be right.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-content mx-auto">
            {/* Cart Lines Left */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 divide-y divide-charcoal/10 overflow-hidden">
                {lines.map((line) => (
                  <div key={line.product.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-soft bg-soft-sage/40 flex items-center justify-center text-3xl flex-shrink-0">
                        🥭
                      </div>
                      <div>
                        <Link
                          to={`/shop/${line.product.slug}`}
                          className="font-display text-xl text-charcoal hover:text-orchard-green font-medium"
                        >
                          {line.product.name}
                        </Link>
                        <p className="font-body text-xs text-charcoal/60 mt-0.5">
                          {line.product.weight_kg ? `${line.product.weight_kg} kg box` : `${line.product.mango_count} mangoes`} · {line.product.min_weight_g} g+
                        </p>
                        <p className="font-body text-sm font-semibold text-orchard-green mt-1">
                          {formatPrice(line.product.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-charcoal/20 rounded-soft bg-white">
                        <button
                          onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                          className="px-2.5 py-1 text-charcoal hover:bg-soft-sage/30 text-sm"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-body text-sm font-semibold">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                          className="px-2.5 py-1 text-charcoal hover:bg-soft-sage/30 text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-body font-bold text-sm text-charcoal min-w-[5rem] text-right">
                        {formatPrice(line.product.price * line.quantity)}
                      </div>

                      <button
                        onClick={() => removeItem(line.product.id)}
                        className="text-charcoal/40 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Serviceability Checker */}
              <div className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-3">
                <div className="flex items-center gap-2 text-charcoal">
                  <Truck className="w-5 h-5 text-orchard-green" />
                  <h4 className="font-display text-lg">Check PIN Code Serviceability</h4>
                </div>
                <p className="font-body text-xs text-charcoal/60">
                  We deliver fresh harvest boxes across Gujarat, Maharashtra, Rajasthan, and Madhya Pradesh.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="border border-charcoal/20 rounded-soft px-3 py-2 text-sm font-body w-44 focus:outline-none focus:border-orchard-green"
                  />
                  <Button onClick={checkPincode} variant="outline" size="sm">
                    Check
                  </Button>
                </div>
                {pinStatus === 'serviceable' && (
                  <p className="font-body text-xs text-green-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PIN {pincode} is serviceable for harvest delivery!
                  </p>
                )}
                {pinStatus === 'unserviceable' && (
                  <p className="font-body text-xs text-amber-800">
                    PIN {pincode} may require special courier confirmation. Shipping will be verified at checkout.
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary Right */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
                <h3 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span className="font-medium text-charcoal">{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping & Delivery</span>
                    <span className="text-xs text-dawn-gold font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-lg text-charcoal">
                    <span>Estimated Total</span>
                    <span className="text-orchard-green">{formatPrice(subtotal())}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    onClick={() => navigate('/checkout')}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    href="/shop"
                    variant="ghost"
                    size="sm"
                    fullWidth
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="pt-4 border-t border-charcoal/10 text-xs text-charcoal/60 space-y-2">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orchard-green" />
                    <span>Secure Razorpay encrypted checkout</span>
                  </p>
                  <p>
                    Delivery is planned based on seasonal harvest readiness. You will be notified prior to crate dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

