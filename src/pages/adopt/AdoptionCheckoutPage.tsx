import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Container, Button, Input, Select, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { AuthModal } from '../../components/auth/AuthModal';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';
import { supabase } from '../../lib/supabase';
import { isRealSupabaseConfigured } from '../../lib/supabaseService';
import { formatPrice, isValidMobile, isValidPincode } from '../../lib/utils';
import { SERVICEABLE_STATES } from '../../lib/constants';
import { Lock, ShieldCheck, ArrowLeft, TreeDeciduous, User } from 'lucide-react';

export default function AdoptionCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const treeIdParam = searchParams.get('tree') || 'KV-001';

  const { trees, pricingConfig, adoptTree, addOrder } = useOrchardStore();
  const { user, profile } = useAuthStore();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const tree = trees.find((t) => t.tree_id === treeIdParam) || trees[0];
  const adoptionFee = tree.adoption_fee || pricingConfig.price;

  const [formData, setFormData] = useState({
    adopterName: '',
    phone: '',
    email: '',
    plaqueName: '',
    address1: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        adopterName: prev.adopterName || (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : ''),
        phone: prev.phone || profile?.phone || '',
      }));
    }
  }, [user, profile]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.adopterName.trim()) {
      setErrorMsg('Please enter the adopter full name.');
      return;
    }
    if (!isValidMobile(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!isValidPincode(formData.pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Tree Adoption Terms.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const adoptionId = `ADOPT-${tree.tree_id}-2025`;

      // 1. Update tree status in registry
      adoptTree(tree.tree_id, {
        name: formData.adopterName,
        phone: formData.phone,
        email: formData.email,
      });

      const adoptionSummary = `Tree Adoption: Tree ${tree.tree_id} (${tree.variety} · ${pricingConfig.min_guarantee_kg}kg guarantee)`;
      const formattedNotes = formData.plaqueName
        ? `Items: ${adoptionSummary} | Plaque: "${formData.plaqueName}"`
        : `Items: ${adoptionSummary}`;

      // 2. Add an order record into harvest orders store
      addOrder({
        order_number: adoptionId,
        customer_name: formData.adopterName,
        phone: formData.phone,
        email: formData.email || null,
        order_date: new Date().toISOString(),
        items_summary: adoptionSummary,
        items_count: 1,
        collection_type: 'Tree Adoption',
        quantity: 1,
        subtotal: adoptionFee,
        shipping_amount: 0,
        total_amount: adoptionFee,
        status: 'confirmed',
        payment_status: 'captured',
        delivery_address: {
          line1: formData.address1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        notes: formattedNotes,
      });

      // Sync to Supabase Cloud
      if (isRealSupabaseConfigured()) {
        (supabase.from('trees') as any).update({
          status: 'adopted',
          adopter_name: formData.adopterName,
          adopter_phone: formData.phone,
          adopter_email: formData.email || null,
        }).eq('tree_id', tree.tree_id).then(({ error }: any) => {
          if (error) console.warn('Supabase tree update error:', error);
        });

        // Insert into orders table with collection_type and quantity
        (async () => {
          try {
            const basePayload: any = {
              order_number: adoptionId,
              user_id: user?.id || null,
              customer_name: formData.adopterName,
              phone: formData.phone,
              email: formData.email || null,
              subtotal: adoptionFee,
              shipping_amount: 0,
              total_amount: adoptionFee,
              status: 'confirmed',
              payment_status: 'captured',
              delivery_address: {
                line1: formData.address1,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
              },
              notes: formattedNotes,
            };

            let createdOrderId: string | null = null;
            const { data: orderWithCols, error: colsErr } = await (supabase.from('orders') as any)
              .insert({
                ...basePayload,
                collection_type: 'Tree Adoption',
                quantity: 1,
              })
              .select('id')
              .single();

            if (!colsErr && orderWithCols?.id) {
              createdOrderId = orderWithCols.id;
            } else {
              const { data: baseOrder } = await (supabase.from('orders') as any)
                .insert(basePayload)
                .select('id')
                .single();
              if (baseOrder?.id) createdOrderId = baseOrder.id;
            }

            // Populate order_items table for adoption
            if (createdOrderId) {
              // Find matching or default product
              const { data: prodData }: any = await (supabase.from('products') as any).select('id').limit(1);
              const defaultProdId = prodData?.[0]?.id || '9c1072c7-5086-4d46-b385-673d65e7acda';
              await (supabase.from('order_items') as any).insert({
                order_id: createdOrderId,
                product_id: defaultProdId,
                product_name: `Tree Adoption: Tree ${tree.tree_id}`,
                quantity: 1,
                unit_price: adoptionFee,
                total_price: adoptionFee,
              });
            }
          } catch (e) {
            console.warn('Supabase adoption order insert error:', e);
          }
        })();
      }

      setIsProcessing(false);
      navigate(`/adoption-success?treeId=${tree.tree_id}&adoptionId=${adoptionId}`);
    }, 1200);
  }

  return (
    <>
      <SEO title="Tree Adoption Checkout" description="Finalize seasonal tree adoption at Kesari Van." noIndex />

      <div className="pt-24 pb-20 bg-mango-cream">
        <Container>
          <div className="max-w-reading mx-auto text-center mb-10">
            <h1 className="font-display text-4xl text-charcoal">Almost part of the orchard.</h1>
            <p className="font-body text-sm text-charcoal/60 mt-1">
              Confirm your tree selection and complete adoption for {pricingConfig.season}.
            </p>
          </div>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-content mx-auto">
            {/* Form Left */}
            <div className="lg:col-span-7 space-y-6">
              {!user ? (
                <div className="bg-white p-8 md:p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-soft-sage/50 text-orchard-green flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-orchard-green" />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="gold">Customer Account Required</Badge>
                    <h2 className="font-display text-3xl text-charcoal">Sign In to Complete Tree Adoption</h2>
                    <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                      Guests must log in or create an account before filling out adoption details and delivery addresses. Your account connects you directly with your numbered tree, provides weekly orchard video updates, and coordinates your seasonal harvest delivery.
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
                      href="/adopt-a-tree"
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Back to Tree Selection
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
                  <h3 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-4">
                    Adopter Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Adopter Full Name"
                      name="adopterName"
                      required
                      value={formData.adopterName}
                      onChange={handleInputChange}
                      placeholder="E.g. Rajesh Patel"
                    />
                    <Input
                      label="Mobile Number (WhatsApp updates)"
                      name="phone"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile"
                    />
                  </div>

                  <Input
                    label="Email Address (Weekly photo reports)"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                  />

                  <Input
                    label="Name to Engrave on Tree Plaque (Optional)"
                    name="plaqueName"
                    value={formData.plaqueName}
                    onChange={handleInputChange}
                    hint="Leave blank to use Adopter Full Name"
                    placeholder="E.g. The Patel Family Tree"
                  />

                  <h4 className="font-display text-xl text-charcoal pt-4 border-t border-charcoal/10">
                    Anticipated Harvest Delivery Address
                  </h4>

                  <Input
                    label="Street Address / Flat No."
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Address where harvest should be delivered"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
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
                </div>
              )}
            </div>

            {/* Summary Right */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
                <h3 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-4">
                  Adoption Summary
                </h3>

                <div className="flex gap-4 items-center p-4 bg-mango-cream/40 rounded-soft border border-charcoal/5">
                  <div className="w-14 h-14 rounded-soft bg-soft-sage/40 flex items-center justify-center text-3xl flex-shrink-0">
                    🌳
                  </div>
                  <div>
                    <Badge variant="gold" size="sm">{pricingConfig.season}</Badge>
                    <h4 className="font-display text-xl text-charcoal">Tree {tree.tree_id}</h4>
                    <p className="font-body text-xs text-charcoal/60">{tree.location_description}</p>
                  </div>
                </div>

                <div className="space-y-3 font-body text-xs text-charcoal/70 border-b border-charcoal/10 pb-4">
                  <div className="flex justify-between">
                    <span>Variety</span>
                    <span className="font-medium text-charcoal">{tree.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Harvest Guarantee</span>
                    <span className="font-medium text-orchard-green">{pricingConfig.min_guarantee_kg} kg Minimum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surplus Yield</span>
                    <span className="font-medium text-charcoal">Eligible excess included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly WhatsApp Updates</span>
                    <span className="font-medium text-charcoal">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical Tree Plaque</span>
                    <span className="font-medium text-charcoal">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-body text-sm font-semibold text-charcoal">Total Adoption Fee</span>
                  <span className="font-display text-2xl font-bold text-orchard-green">{formatPrice(adoptionFee)}</span>
                </div>

                {errorMsg && (
                  <p className="text-red-700 text-xs font-body bg-red-50 p-3 rounded-soft border border-red-200">
                    {errorMsg}
                  </p>
                )}

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-body text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-charcoal/30 text-orchard-green focus:ring-orchard-green"
                    />
                    <span>
                      I agree to the{' '}
                      <Link to="/legal/adoption-terms" target="_blank" className="text-orchard-green underline font-medium">
                        Tree Adoption Terms
                      </Link>
                      , acknowledging harvest depends on seasonal ripening.
                    </span>
                  </label>

                  {!user ? (
                    <Button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      variant="gold"
                      size="lg"
                      fullWidth
                      className="shadow-md"
                    >
                      Sign In to Adopt Tree {tree.tree_id}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      fullWidth
                      className="shadow-md"
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      Confirm & Adopt Tree {tree.tree_id}
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-charcoal/10 flex items-center justify-center gap-2 text-xs font-body text-charcoal/50">
                  <ShieldCheck className="w-4 h-4 text-orchard-green" />
                  <span>Guaranteed authentic Surat grove adoption</span>
                </div>
              </div>
            </div>
          </form>
        </Container>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
