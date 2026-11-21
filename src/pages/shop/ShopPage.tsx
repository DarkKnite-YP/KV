import React from 'react';
import { Link } from 'react-router-dom';
import { Hero, Section, SectionHeading, Button, Card, Badge } from '../../components/ui';
import { SEO } from '../../components/ui/SEO';
import { useOrchardStore } from '../../stores/orchardStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

export default function ShopPage() {
  const products = useOrchardStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <>
      <SEO
        title="Shop Mangoes — Fresh Gir Kesar Collection"
        description="Order fresh Gir Kesar mangoes from Kesari Van orchard in Surat. 10 kg Premium Kesar, Golden Kesar individually bagged, and Signature Harvest gift boxes."
      />

      {/* Hero */}
      <Hero
        eyebrow="THE SEASON'S COLLECTION"
        headline="A summer worth waiting for."
        copy="Picked only when nature says they’re ready. Direct from our orchard rows to your family table in cushioned, breathable crates."
        primaryCTA={{ label: 'Explore the Collection', href: '#collection' }}
        secondaryCTA={{ label: 'Our Growing Story', href: '/our-story' }}
        size="large"
      />

      {/* Product Grid */}
      <Section id="collection" background="white" padding="default">
        <SectionHeading
          eyebrow="Orchard Fresh Selections"
          title="Three Collections. One Honest Standard."
          subtitle="Every box is packed with pride, weighed fairly, and harvested at optimal mature-raw stage for perfect home ripening."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} hover padding="none" className="flex flex-col h-full bg-white border border-charcoal/10">
              <div className="h-64 bg-soft-sage/30 relative flex items-center justify-center p-8 border-b border-charcoal/5">
                <span className="text-7xl drop-shadow-sm select-none">🥭</span>
                {product.is_bagged && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="green" size="sm">Individually Bagged</Badge>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="sage" size="sm">
                    {product.weight_kg ? `${product.weight_kg} kg Box` : `${product.mango_count} Mangoes`}
                  </Badge>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1 justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl text-charcoal">{product.name}</h3>
                    <span className="font-body font-bold text-xl text-orchard-green">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-dawn-gold">
                    Mangoes {product.min_weight_g} g onwards
                  </p>
                  <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                    {product.short_description}
                  </p>
                </div>

                <div className="pt-4 border-t border-charcoal/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() =>
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
                        })
                      }
                      variant="primary"
                      size="sm"
                      fullWidth
                    >
                      Add to Basket
                    </Button>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="px-3 py-2 border border-charcoal/20 rounded-soft text-charcoal hover:bg-soft-sage/30 text-sm font-medium transition-colors"
                      title="View details"
                    >
                      Details
                    </Link>
                  </div>
                  <p className="text-center font-body text-xs text-charcoal/50">
                    Shipping calculated at checkout
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Comparison Guide */}
      <Section background="cream" padding="default">
        <SectionHeading
          eyebrow="Choosing Guide"
          title="Compare Our Collections"
          subtitle="Find the exact fit for your family or seasonal gifting."
          align="center"
          className="mb-12"
        />

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto bg-white rounded-softer shadow-card border border-charcoal/10 overflow-hidden text-left font-body text-sm">
            <thead className="bg-soft-sage/40 text-charcoal font-semibold border-b border-charcoal/10">
              <tr>
                <th className="p-4 md:p-6">Feature</th>
                <th className="p-4 md:p-6">Premium Kesar</th>
                <th className="p-4 md:p-6">Golden Kesar</th>
                <th className="p-4 md:p-6">Signature Harvest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10 text-charcoal/80">
              <tr>
                <td className="p-4 md:p-6 font-medium text-charcoal">Box Specification</td>
                <td className="p-4 md:p-6">10 kg Gross</td>
                <td className="p-4 md:p-6">10 kg Gross</td>
                <td className="p-4 md:p-6">12 Large Mangoes</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-medium text-charcoal">Minimum Mango Size</td>
                <td className="p-4 md:p-6">200 g+ each</td>
                <td className="p-4 md:p-6">250 g+ each</td>
                <td className="p-4 md:p-6">300 g+ each</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-medium text-charcoal">Tree Protection Bags</td>
                <td className="p-4 md:p-6 text-charcoal/40">—</td>
                <td className="p-4 md:p-6 text-orchard-green font-semibold">✓ Individually Bagged</td>
                <td className="p-4 md:p-6 text-orchard-green font-semibold">✓ Individually Bagged</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-medium text-charcoal">Ripening Nature</td>
                <td className="p-4 md:p-6">Natural Room Temp</td>
                <td className="p-4 md:p-6">Natural Room Temp</td>
                <td className="p-4 md:p-6">Natural Room Temp</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-medium text-charcoal">Best Suited For</td>
                <td className="p-4 md:p-6">Daily family enjoyment</td>
                <td className="p-4 md:p-6">Connoisseurs & purity lovers</td>
                <td className="p-4 md:p-6">Festive and luxury gifting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Adoption Cross-Sell */}
      <Section background="sage" padding="default">
        <div className="max-w-reading mx-auto text-center space-y-6">
          <Badge variant="earth">Looking for something more personal?</Badge>
          <h2 className="font-display text-section text-charcoal">
            Adopt an Entire Tree for the Season
          </h2>
          <p className="font-body text-base text-charcoal/80 leading-relaxed">
            Instead of buying by the box, select your own numbered tree in our Surat grove. Receive a guaranteed minimum harvest of 25 kg, all surplus fruit, and weekly video dispatches throughout the season.
          </p>
          <div className="pt-2">
            <Button href="/adopt-a-tree" variant="primary">
              Learn About Tree Adoption
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
