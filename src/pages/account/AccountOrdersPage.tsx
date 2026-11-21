import React from 'react';
import { Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { formatPrice } from '../../lib/utils';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountOrdersPage() {
  const { user } = useAuthStore();
  const { orders } = useOrchardStore();

  const userEmail = user?.email?.toLowerCase();
  const userPhone = user?.user_metadata?.phone;

  const userOrders = orders.filter((o) => {
    if (!user) return false;
    if (userEmail && o.email?.toLowerCase() === userEmail) return true;
    if (userPhone && o.phone?.replace(/\D/g, '') === userPhone.replace(/\D/g, '')) return true;
    return false;
  });

  return (
    <>
      <SEO title="My Orders" description="Order history and live harvest tracking." noIndex />

      <AccountLayout title="My Orders" subtitle="Track active harvest deliveries and review previous seasons.">
        {userOrders.length > 0 ? (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal/10 pb-3">
                  <div>
                    <span className="font-display text-lg text-charcoal font-semibold">{order.order_number}</span>
                    <p className="font-body text-xs text-charcoal/50">Ordered on {order.order_date}</p>
                  </div>
                  <Badge variant={order.status === 'confirmed' ? 'green' : 'neutral'}>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-body text-sm">
                  <div>
                    <p className="font-semibold text-charcoal">{order.items_summary}</p>
                    <p className="text-xs text-charcoal/60">Quantity: {order.items_count || order.quantity || 1} box{(order.items_count || order.quantity || 1) > 1 ? 'es' : ''}</p>
                    {order.notes && order.notes !== order.items_summary && (
                      <p className="text-xs text-charcoal/50 italic mt-1">Delivery note: {order.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-orchard-green">{formatPrice(order.total_amount)}</span>
                    <p className="text-[10px] text-charcoal/50">Incl. courier delivery</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button href={`/account/orders/${order.order_number}`} variant="outline" size="sm">
                    View Details & Tracking <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-charcoal/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-charcoal">No Orders Placed Yet</h3>
              <p className="font-body text-xs text-charcoal/60 max-w-sm mx-auto">
                Your seasonal mango box orders will appear here with live orchard harvesting and courier tracking coordinates.
              </p>
            </div>
            <Button href="/shop" variant="primary" size="md">
              Browse Available Mango Boxes
            </Button>
          </div>
        )}
      </AccountLayout>
    </>
  );
}

