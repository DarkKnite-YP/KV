import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Button, Input, Select, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';
import { supabase } from '../../lib/supabase';
import { isRealSupabaseConfigured } from '../../lib/supabaseService';
import { formatPrice, generateOrderNumber, isValidMobile, isValidPincode } from '../../lib/utils';
import { SERVICEABLE_STATES } from '../../lib/constants';
import { Lock, ShieldCheck, ArrowRight, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, totalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addOrder, adjustProductStock } = useOrchardStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    notes: '',
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping calculation logic: flat ₹250 per box for Gujarat, ₹400 for neighboring states
  const shippingPerBox = formData.state === 'Gujarat' ? 25000 : 40000; // in paise
  const estimatedShipping = totalItems() * shippingPerBox;
  const orderTotal = subtotal() + estimatedShipping;

  if (lines.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-mango-cream text-center">
        <Container narrow>
          <h2 className="font-display text-3xl text-charcoal mb-4">Your basket is empty</h2>
          <p className="font-body text-sm text-charcoal/70 mb-6">
            Please add mangoes to your cart before proceeding to checkout.
          </p>
          <Button href="/shop" variant="primary">Explore Shop</Button>
        </Container>
      </div>
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isValidMobile(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.address1.trim() || !formData.city.trim()) {
      setErrorMsg('Please complete your street address and city.');
      return;
    }
    if (!isValidPincode(formData.pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms & Conditions and Shipping Policy.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = generateOrderNumber();

      // Record real order in orchardStore
      addOrder({
        order_number: orderNumber,
        customer_name: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        order_date: new Date().toISOString(),
        items_summary: lines.map((l) => `${l.quantity}x ${l.product.name}`).join(', '),
        items_count: totalItems(),
        subtotal: subtotal(),
        shipping_amount: estimatedShipping,
        total_amount: orderTotal,
        status: 'confirmed',
        payment_status: 'captured',
        delivery_address: {
          line1: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}`,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        notes: formData.notes || undefined,
      });

      // Update product inventory accordingly
      lines.forEach((l) => {
        const remaining = Math.max(0, l.product.stock_quantity - l.quantity);
        adjustProductStock(l.product.id, remaining, `Order ${orderNumber} placed`);
      });

      // Sync order to Supabase Cloud
      if (isRealSupabaseConfigured()) {
        (supabase.from('orders') as any).insert({
          order_number: orderNumber,
          customer_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          subtotal: subtotal(),
          shipping_amount: estimatedShipping,
          total_amount: orderTotal,
          status: 'confirmed',
          payment_status: 'captured',
          delivery_address: {
            line1: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}`,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          notes: formData.notes || null,
        }).then(({ error }: any) => {
          if (error) console.warn('Supabase order insert error:', error);
        });
      }

      // Clear cart
      clearCart();
      setIsProcessing(false);

      // Redirect to success page
      navigate(`/order-success?orderId=${orderNumber}&total=${orderTotal}`);
    }, 1200);
  }

  return (
    <>
      <SEO title="Secure Checkout" description="Complete your fresh mango order with secure payment." noIndex />

      <div className="pt-24 pb-20 bg-mango-cream">
        <Container>
          <div className="max-w-reading mx-auto text-center mb-10">
            <h1 className="font-display text-4xl text-charcoal">Checkout</h1>
            <p className="font-body text-sm text-charcoal/60 mt-1">
              Provide delivery coordinates and complete your seasonal harvest order.
            </p>
          </div>

          <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-content mx-auto">
            {/* Delivery Details Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                  <h3 className="font-display text-2xl text-charcoal">Delivery Address</h3>
                  <span className="font-body text-xs text-charcoal/50">All fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="E.g. Jayesh Patel"
                  />
                  <Input
                    label="Mobile Number (for Courier & OTP)"
                    name="phone"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                  />
                </div>

                <Input
                  label="Email Address (for order receipts & dispatch tracking)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                />

                <Input
                  label="Street Address / House No. / Building"
                  name="address1"
                  required
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="House/Apartment, Street name"
                />

                <Input
                  label="Apartment, Suite, Unit, Landmark (Optional)"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  placeholder="Near landmark, sector, floor"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="E.g. Surat, Mumbai"
                  />
                  <Select
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    options={SERVICEABLE_STATES.map((s) => ({ value: s, label: s }))}
                  />
                  <Input
                    label="PIN Code"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="395007"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-body font-medium text-charcoal">
                    Delivery Instructions / Gift Note (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="E.g. Please ring doorbell twice or leave with security."
                    className="w-full px-3 py-2 text-xs font-body rounded-soft border border-charcoal/20 focus:outline-none focus:border-orchard-green resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Right */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
                <h3 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-4">
                  Order Summary
                </h3>

                {/* Basket Items */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {lines.map((line) => (
                    <div key={line.product.id} className="flex justify-between items-center text-sm font-body">
                      <div>
                        <p className="font-medium text-charcoal">{line.product.name}</p>
                        <p className="text-xs text-charcoal/50">Qty: {line.quantity}</p>
                      </div>
                      <span className="font-semibold text-charcoal">
                        {formatPrice(line.product.price * line.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Shipping, Total */}
                <div className="border-t border-charcoal/10 pt-4 space-y-2 text-sm font-body">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-orchard-green" /> Express Courier Shipping
                    </span>
                    <span>{formatPrice(estimatedShipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-charcoal pt-2 border-t border-charcoal/10">
                    <span>Total Amount</span>
                    <span className="text-orchard-green">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-700 text-xs font-body bg-red-50 p-3 rounded-soft border border-red-200">
                    {errorMsg}
                  </p>
                )}

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-body text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-charcoal/30 text-orchard-green focus:ring-orchard-green"
                  />
                  <span>
                    I accept the{' '}
                    <Link to="/legal/terms" target="_blank" className="text-orchard-green underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and understand mangoes are dispatched in harvest batches according to tree maturity.
                  </span>
                </label>

                {/* Payment Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  Pay {formatPrice(orderTotal)} & Place Order
                </Button>

                <div className="pt-4 border-t border-charcoal/10 flex items-center justify-center gap-2 text-xs font-body text-charcoal/50">
                  <Lock className="w-3.5 h-3.5 text-orchard-green" />
                  <span>256-bit Secure Encryption · Direct Farm Dispatch</span>
                </div>
              </div>
            </div>
          </form>
        </Container>
      </div>
    </>
  );
}
