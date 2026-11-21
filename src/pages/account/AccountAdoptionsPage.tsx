import React from 'react';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { Trees, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountAdoptionsPage() {
  const { user } = useAuthStore();
  const { trees } = useOrchardStore();

  const userEmail = user?.email?.toLowerCase();
  const userPhone = user?.user_metadata?.phone;

  const userTrees = trees.filter((t) => {
    if (!user) return false;
    const treeEmail = t.adopter_email || t.adopter_info?.email;
    const treePhone = t.adopter_phone || t.adopter_info?.phone;
    if (userEmail && treeEmail?.toLowerCase() === userEmail) return true;
    if (userPhone && treePhone?.replace(/\D/g, '') === userPhone.replace(/\D/g, '')) return true;
    return false;
  });

  return (
    <>
      <SEO title="My Adopted Trees" description="View and follow your adopted mango trees." noIndex />

      <AccountLayout title="My Adopted Trees" subtitle="Somewhere in our orchard, a tree is growing with your name on it.">
        {userTrees.length > 0 ? (
          <div className="space-y-4">
            {userTrees.map((item) => (
              <div key={item.id} className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal/10 pb-4">
                  <div>
                    <Badge variant="gold" size="sm">Season {item.season}</Badge>
                    <h3 className="font-display text-2xl text-charcoal mt-1">Tree {item.tree_id}</h3>
                    <p className="font-body text-xs text-charcoal/60">{item.location_description}</p>
                  </div>
                  <Badge variant="green">Active Adoption</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-xs text-charcoal/80">
                  <div className="p-3 bg-mango-cream/40 rounded-soft">
                    <span className="text-charcoal/50 block">Cultivar</span>
                    <strong>{item.variety}</strong>
                  </div>
                  <div className="p-3 bg-mango-cream/40 rounded-soft">
                    <span className="text-charcoal/50 block">Harvest Commitment</span>
                    <strong className="text-orchard-green">{item.min_guarantee_kg} kg minimum guarantee</strong>
                  </div>
                  <div className="p-3 bg-mango-cream/40 rounded-soft">
                    <span className="text-charcoal/50 block">Orchard Updates</span>
                    <strong>Weekly via WhatsApp</strong>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button href={`/account/adoptions/${item.tree_id}`} variant="primary" size="sm">
                    View Tree Story & Certificate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
            <Trees className="w-12 h-12 text-charcoal/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-charcoal">No Trees Adopted Yet</h3>
              <p className="font-body text-xs text-charcoal/60 max-w-sm mx-auto">
                Select your personal tree from our 100-Tree Registry in Surat to enjoy a guaranteed 25 kg minimum harvest and personal farm visit privileges.
              </p>
            </div>
            <Button href="/adopt" variant="primary" size="md">
              Explore 100-Tree Registry
            </Button>
          </div>
        )}
      </AccountLayout>
    </>
  );
}

