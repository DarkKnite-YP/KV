import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section, Container, Button, Badge, Accordion, Card } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import { Check, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const products = useOrchardStore((s) => s.products);
  const product = products.find((p) => p.slug === slug) || products[0];

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      weight_kg: product.weight_kg,
      mango_count: product.mango_count,
      min_weight_g: product.min_weight_g,
      is_bagged: product.is_bagged,
      image_url: null,
      stock_quantity: product.stock_quantity,
    }, quantity);
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate('/cart');
  }

  const accordionItems = [
    {
      id: 'details',
      title: 'Fruit & Harvest Specifications',
      content: (
        <div className="space-y-2 text-sm text-charcoal/80">
          <p><strong>Cultivar:</strong> 100% Authentic Gir Kesar grafted saplings.</p>
          <p><strong>Orchard Terroir:</strong> Deep alluvial clay-loam, Umbhel, Kamrej, Surat, Gujarat.</p>
          <p><strong>Minimum Sizing:</strong> Guaranteed {product.min_weight_g} g minimum per fruit.</p>
          <p><strong>Treatment:</strong> Absolutely carbide-free and chemical-dip free. Ripens purely with natural plant ethylene.</p>
        </div>
      ),
    },
    {
      id: 'packaging',
      title: 'Packaging & Cushioning',
      content: (
        <p className="text-sm text-charcoal/80 leading-relaxed">
          Packed in heavy-gauge 5-ply corrugated ventilated crates. Each mango sits in its own protective nest with unbleached organic wood wool and soft separators to prevent pressure bruising during transit.
        </p>
      ),
    },
    {
      id: 'ripening',
      title: 'Ripening & Storage Guidance',
      content: (
        <div className="space-y-2 text-sm text-charcoal/80 leading-relaxed">
          <p>1. Open the box upon arrival and inspect the fruit. Mangoes are dispatched at semi-mature raw stage to withstand transit.</p>
          <p>2. Keep mangoes in a single layer at room temperature in a dry, ventilated corner of your room.</p>
          <p>3. As skin turns saffron-golden and the stem emits an intense perfume, the fruit is ready to savor.</p>
          <p>4. <em>Do not refrigerate until fully ripe.</em> Refrigeration stops natural sugar development.</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery Details',
      content: (
        <p className="text-sm text-charcoal/80 leading-relaxed">
          We ship across Gujarat, Maharashtra, Rajasthan, and Madhya Pradesh via express parcel courier. Shipping fee is calculated at checkout based on destination PIN code. Standard transit time is 24 to 48 hours from dispatch.
        </p>
      ),
    },
  ];

  return (
    <>
      <SEO
        title={`${product.name} — ${product.weight_kg ? `${product.weight_kg}kg Box` : `${product.mango_count} Mangoes`}`}
        description={product.short_description || product.description}
      />

      <div className="pt-24 pb-16 bg-mango-cream">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs font-body text-charcoal/60">
            <Link to="/" className="hover:text-orchard-green">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-orchard-green">Shop</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Gallery Left */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-softer shadow-card border border-charcoal/10 aspect-[4/3] flex items-center justify-center relative overflow-hidden p-8">
                <span className="text-9xl drop-shadow select-none">🥭</span>
                {product.is_bagged && (
                  <div className="absolute top-6 right-6">
                    <Badge variant="green" size="md">Individually Protected on Tree</Badge>
                  </div>
                )}
                <div className="absolute bottom-6 left-6">
                  <Badge variant="sage" size="md">
                    {product.weight_kg ? `${product.weight_kg} kg Box` : `${product.mango_count} Mangoes`}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails placeholder */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-soft p-4 border-2 border-orchard-green aspect-[4/3] flex items-center justify-center">
                  <span className="text-3xl">🥭</span>
                </div>
                <div className="bg-white/60 rounded-soft p-4 border border-charcoal/10 aspect-[4/3] flex items-center justify-center opacity-70">
                  <span className="text-3xl">📦</span>
                </div>
                <div className="bg-white/60 rounded-soft p-4 border border-charcoal/10 aspect-[4/3] flex items-center justify-center opacity-70">
                  <span className="text-3xl">🌳</span>
                </div>
              </div>
            </div>

            {/* Product Details Right */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-dawn-gold mb-1">
                  Gir Kesar · Kesari Van, Surat
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-charcoal">
                  {product.name}
                </h1>
                <p className="font-body text-sm text-charcoal/60 mt-1">
                  {product.weight_kg ? `${product.weight_kg} kg box · Individual protection for every mango` : `${product.mango_count} selected mangoes`}
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl md:text-4xl font-semibold text-orchard-green">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && (
                  <span className="font-body text-base text-charcoal/40 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                <span className="font-body text-xs text-charcoal/50">Shipping calculated separately</span>
              </div>

              <p className="font-body text-sm text-charcoal/80 leading-relaxed italic border-l-2 border-dawn-gold pl-3">
                “Picked only when nature says they’re ready.”
              </p>

              {/* Bullet Highlights */}
              <ul className="space-y-2 font-body text-sm text-charcoal/80">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orchard-green" />
                  <span>Authentic Gir Kesar mangoes from Surat</span>
                </li>
                {product.is_bagged && (
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orchard-green" />
                    <span>Each mango individually protected with breathable bag</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orchard-green" />
                  <span>Minimum fruit weight {product.min_weight_g} g onwards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orchard-green" />
                  <span>No calcium carbide or chemical artificial ripening</span>
                </li>
              </ul>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <label className="font-body text-sm font-medium text-charcoal">Quantity:</label>
                  <div className="flex items-center border border-charcoal/20 rounded-soft bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-charcoal hover:bg-soft-sage/40 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-body font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-charcoal hover:bg-soft-sage/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    Add to Basket
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="gold"
                    size="lg"
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Reassurance */}
              <div className="pt-4 border-t border-charcoal/10 grid grid-cols-2 gap-4 font-body text-xs text-charcoal/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orchard-green" />
                  <span>Genuine orchard guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orchard-green" />
                  <span>Express courier tracking</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="pt-4">
                <Accordion items={accordionItems} />
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-24 pt-12 border-t border-charcoal/10">
            <h3 className="font-display text-3xl text-charcoal mb-8 text-center">
              Other Selections from the Orchard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {products.filter((p) => p.slug !== product.slug).map((rel) => (
                <Card key={rel.id} hover padding="md" className="flex items-center gap-4 bg-white border border-charcoal/10">
                  <span className="text-4xl">🥭</span>
                  <div className="flex-1">
                    <h4 className="font-display text-xl text-charcoal">{rel.name}</h4>
                    <p className="font-body text-xs text-charcoal/60">{formatPrice(rel.price)}</p>
                  </div>
                  <Button href={`/shop/${rel.slug}`} variant="outline" size="sm">
                    View
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
