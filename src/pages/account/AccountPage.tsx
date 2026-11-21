import React from 'react';
import { Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Card, Button, Badge } from '../../components/ui';
import { formatPrice } from '../../lib/utils';
import { ShoppingBag, Trees, MapPin, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountPage() {
  const { user } = useAuthStore();
  const { orders, trees } = useOrchardStore();

  const userEmail = user?.email?.toLowerCase();
  const userPhone = user?.user_metadata?.phone;

  const userOrders = orders.filter((o) => {
    if (!user) return false;
    if (userEmail && o.email?.toLowerCase() === userEmail) return true;
    if (userPhone && o.phone?.replace(/\D/g, '') === userPhone.replace(/\D/g, '')) return true;
    return false;
  });

  const userTrees = trees.filter((t) => {
    if (!user) return false;
    const treeEmail = t.adopter_email || t.adopter_info?.email;
    const treePhone = t.adopter_phone || t.adopter_info?.phone;
    if (userEmail && treeEmail?.toLowerCase() === userEmail) return true;
    if (userPhone && treePhone?.replace(/\D/g, '') === userPhone.replace(/\D/g, '')) return true;
    return false;
  });

  const activeOrder = userOrders[0];
  const adoptedTree = userTrees[0];

  return (
    <>
      <SEO title="My Account" description="Manage your mango orders, tree adoptions, and orchard visits." noIndex />

      <AccountLayout>
        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="bg-white border border-charcoal/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs text-charcoal/60 uppercase tracking-wider">Active Orders</p>
                <p className="font-display text-3xl text-charcoal mt-1">{userOrders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <Link to="/account/orders" className="text-xs font-semibold text-orchard-green hover:underline mt-4 inline-flex items-center gap-1">
              View orders <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card padding="md" className="bg-white border border-charcoal/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs text-charcoal/60 uppercase tracking-wider">Adopted Trees</p>
                <p className="font-display text-3xl text-charcoal mt-1">{userTrees.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
            </div>
            <Link to="/account/adoptions" className="text-xs font-semibold text-orchard-green hover:underline mt-4 inline-flex items-center gap-1">
              View my trees <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card padding="md" className="bg-white border border-charcoal/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs text-charcoal/60 uppercase tracking-wider">Saved Addresses</p>
                <p className="font-display text-3xl text-charcoal mt-1">0</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <Link to="/account/addresses" className="text-xs font-semibold text-orchard-green hover:underline mt-4 inline-flex items-center gap-1">
              Manage addresses <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        </div>

        {/* Active Order Preview or Clean Empty State */}
        <div className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div>
              <h3 className="font-display text-xl text-charcoal">Active Harvest Orders</h3>
              <p className="font-body text-xs text-charcoal/50">
                {activeOrder ? `${activeOrder.order_number} · Placed on ${activeOrder.order_date}` : 'Direct from our orchard in Surat'}
              </p>
            </div>
            {activeOrder && <Badge variant="green">{activeOrder.status}</Badge>}
          </div>

          {activeOrder ? (
            <>
              <div className="flex items-center justify-between text-sm font-body">
                <div>
                  <p className="font-medium text-charcoal">{activeOrder.items_summary}</p>
                  <p className="text-xs text-charcoal/60">
                    Destination: {activeOrder.delivery_address?.city}, {activeOrder.delivery_address?.state}
                  </p>
                </div>
                <span className="font-bold text-orchard-green">{formatPrice(activeOrder.total_amount)}</span>
              </div>

              <div className="p-3 bg-mango-cream/40 rounded-soft flex items-center gap-3 text-xs font-body text-charcoal/70">
                <Clock className="w-4 h-4 text-dawn-gold flex-shrink-0" />
                <span>Currently registered in orchard dispatch schedule.</span>
              </div>

              <div className="text-right">
                <Link to={`/account/orders/${activeOrder.order_number}`} className="text-xs font-semibold text-orchard-green hover:underline">
                  View Order Details →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3 font-body text-sm text-charcoal/70">
              <ShoppingBag className="w-10 h-10 text-charcoal/30 mx-auto" />
              <p>You have no active mango box orders at this time.</p>
              <Button href="/shop" variant="primary" size="sm">
                Explore Fresh Mango Boxes
              </Button>
            </div>
          )}
        </div>

        {/* Adopted Tree Preview or Clean Empty State */}
        <div className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div>
              <h3 className="font-display text-xl text-charcoal">My Adopted Tree</h3>
              <p className="font-body text-xs text-charcoal/50">
                {adoptedTree ? `Tree ${adoptedTree.tree_id} · ${adoptedTree.location_description}` : '100-Tree Adoption Program'}
              </p>
            </div>
            {adoptedTree && <Badge variant="gold">Active (Season {adoptedTree.season})</Badge>}
          </div>

          {adoptedTree ? (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-soft bg-soft-sage/40 flex items-center justify-center text-3xl">
                  🌳
                </div>
                <div className="font-body text-xs space-y-1 text-charcoal/80">
                  <p><strong>Cultivar:</strong> {adoptedTree.variety}</p>
                  <p><strong>Harvest Guarantee:</strong> {adoptedTree.min_guarantee_kg} kg minimum</p>
                  <p><strong>Location:</strong> {adoptedTree.location_description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-body text-charcoal/50">Orchard monitored · Season 2025</span>
                <Link to={`/account/adoptions/${adoptedTree.tree_id}`} className="text-xs font-semibold text-orchard-green hover:underline">
                  View Tree Story →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3 font-body text-sm text-charcoal/70">
              <Trees className="w-10 h-10 text-charcoal/30 mx-auto" />
              <p>You have not adopted a mango tree for this harvest season yet.</p>
              <Button href="/adopt" variant="secondary" size="sm">
                Select Your Tree from the Registry
              </Button>
            </div>
          )}
        </div>
      </AccountLayout>
    </>
  );
}

