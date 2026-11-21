import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { formatPrice } from '../../lib/utils';
import { ArrowLeft, CheckCircle2, Truck, Package, ShoppingBag } from 'lucide-react';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrchardStore();

  const order = orders.find((o) => o.order_number === id || o.id === id);

  if (!order) {
    return (
      <>
        <SEO title="Order Not Found" description="Order details." noIndex />
        <AccountLayout title="Order Details" subtitle="Track your harvest dispatches.">
          <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-charcoal/30 mx-auto" />
            <h3 className="font-display text-2xl text-charcoal">Order Not Found</h3>
            <p className="font-body text-xs text-charcoal/60">
              No order matching reference <span className="font-semibold text-charcoal">{id}</span> could be located.
            </p>
            <Button href="/account/orders" variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Orders
            </Button>
          </div>
        </AccountLayout>
      </>
    );
  }

  return (
    <>
      <SEO title={`Order ${order.order_number}`} description="Harvest tracking and order status." noIndex />

      <AccountLayout title={`Order ${order.order_number}`} subtitle="Authoritative order and harvest dispatch details.">
        <div className="mb-4">
          <Link to="/account/orders" className="inline-flex items-center gap-1 text-xs font-body text-orchard-green hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all orders
          </Link>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
            <div>
              <p className="font-body text-xs text-charcoal/50">Order Reference</p>
              <h3 className="font-display text-2xl text-charcoal">{order.order_number}</h3>
            </div>
            <div>
              <Badge variant={order.status === 'confirmed' ? 'green' : 'neutral'} size="md">
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-display text-lg text-charcoal mb-4">Harvest & Courier Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-body text-xs">
              <div className="p-3 bg-soft-sage/40 rounded-soft border border-charcoal/5">
                <CheckCircle2 className="w-5 h-5 text-orchard-green mx-auto mb-1" />
                <strong className="block text-charcoal">Order Placed</strong>
                <span className="text-charcoal/60">{order.order_date}</span>
              </div>
              <div className={`p-3 rounded-soft border ${order.status === 'preparing' || order.status === 'dispatched' || order.status === 'delivered' ? 'bg-mango-cream border-dawn-gold/30' : 'bg-charcoal/5 opacity-60'}`}>
                <Package className="w-5 h-5 text-dawn-gold mx-auto mb-1" />
                <strong className="block text-charcoal">Preparing</strong>
                <span className="text-charcoal/60">{order.status === 'preparing' ? 'Packing in Grove' : 'Scheduled'}</span>
              </div>
              <div className={`p-3 rounded-soft border ${order.status === 'dispatched' || order.status === 'delivered' ? 'bg-soft-sage/40 border-orchard-green/30' : 'bg-charcoal/5 opacity-60'}`}>
                <Truck className="w-5 h-5 text-orchard-green mx-auto mb-1" />
                <strong className="block text-charcoal">Dispatched</strong>
                <span className="text-charcoal/60">{order.tracking_number ? `${order.courier_name || 'Courier'}: ${order.tracking_number}` : 'Pending Harvest'}</span>
              </div>
              <div className={`p-3 rounded-soft border ${order.status === 'delivered' ? 'bg-soft-sage/40 border-orchard-green/30' : 'bg-charcoal/5 opacity-60'}`}>
                <CheckCircle2 className="w-5 h-5 text-orchard-green mx-auto mb-1" />
                <strong className="block text-charcoal">Delivered</strong>
                <span className="text-charcoal/60">{order.status === 'delivered' ? 'Completed' : 'In Transit'}</span>
              </div>
            </div>
          </div>

          {/* Item details */}
          <div className="border-t border-charcoal/10 pt-4 space-y-3 font-body text-sm">
            <h4 className="font-display text-lg text-charcoal">Purchased Collections</h4>
            <div className="flex justify-between items-center py-2 border-b border-charcoal/5">
              <div>
                <p className="font-semibold text-charcoal">{order.collection_type || order.items_summary || 'Gir Kesar Mango Collection'}</p>
                <p className="text-xs text-charcoal/60">Quantity: {order.quantity || order.items_count || 1} box{(order.quantity || order.items_count || 1) > 1 ? 'es' : ''}</p>
              </div>
              <span className="font-semibold text-charcoal">{formatPrice(order.subtotal)}</span>
            </div>
            {order.notes && order.notes !== order.items_summary && (
              <div className="p-3 bg-mango-cream/40 rounded-soft border border-charcoal/5 text-xs text-charcoal/70">
                <strong className="text-charcoal block mb-0.5">Delivery Instructions / Customer Note:</strong>
                <span>{order.notes}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-charcoal/60">
              <span>Courier Delivery</span>
              <span>{formatPrice(order.shipping_amount)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-orchard-green pt-2 border-t border-charcoal/10">
              <span>Total Amount ({order.payment_status})</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Delivery coordinates */}
          {order.delivery_address && (
            <div className="border-t border-charcoal/10 pt-4 space-y-2 font-body text-xs text-charcoal/70">
              <h4 className="font-display text-base text-charcoal font-semibold">Delivery Coordinates</h4>
              <p>{order.customer_name} · {order.phone}</p>
              <p>
                {order.delivery_address.line1}, {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.pincode}
              </p>
            </div>
          )}
        </div>
      </AccountLayout>
    </>
  );
}

