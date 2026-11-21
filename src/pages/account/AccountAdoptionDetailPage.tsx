import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { ArrowLeft, Award, Calendar, Trees } from 'lucide-react';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountAdoptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { trees } = useOrchardStore();

  const tree = trees.find((t) => t.tree_id === id || t.id === id);

  if (!tree) {
    return (
      <>
        <SEO title="Tree Not Found" description="Adoption details." noIndex />
        <AccountLayout title="Tree Details" subtitle="Follow your adopted tree.">
          <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
            <Trees className="w-12 h-12 text-charcoal/30 mx-auto" />
            <h3 className="font-display text-2xl text-charcoal">Tree Not Found</h3>
            <p className="font-body text-xs text-charcoal/60">
              No tree matching ID <span className="font-semibold text-charcoal">{id}</span> could be located in our active registry.
            </p>
            <Button href="/account/adoptions" variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Trees
            </Button>
          </div>
        </AccountLayout>
      </>
    );
  }

  return (
    <>
      <SEO title={`Tree ${tree.tree_id} Certificate`} description="Adoption status, certificate, and harvest updates." noIndex />

      <AccountLayout title={`Tree ${tree.tree_id}`} subtitle="Your adopted Gir Kesar tree at Kesari Van, Surat.">
        <div className="mb-4">
          <Link to="/account/adoptions" className="inline-flex items-center gap-1 text-xs font-body text-orchard-green hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to adopted trees
          </Link>
        </div>

        <div className="space-y-6">
          {/* Certificate Card */}
          <div className="bg-white p-8 md:p-10 rounded-softer shadow-card border-2 border-dawn-gold/40 text-center space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-dawn-gold/20 text-dawn-gold flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <p className="font-body text-xs uppercase tracking-widest text-dawn-gold font-semibold">
              Official Certificate of Adoption
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-charcoal">
              Tree {tree.tree_id}
            </h3>
            <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
              This certificate confirms that Tree <strong>{tree.tree_id}</strong> ({tree.variety}, {tree.location_description}) at Kesari Van Orchard in Kamrej, Surat is adopted for <strong>Season {tree.season}</strong>.
            </p>
            <div className="pt-2 text-xs font-body text-charcoal/50">
              Guaranteed Minimum Harvest: {tree.min_guarantee_kg} kg · Eligible Surplus Included
            </div>
          </div>

          {/* Current Seasonal Status */}
          <div className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h4 className="font-display text-xl text-charcoal">Current Tree Status</h4>
              <Badge variant="green">Healthy & Monitored</Badge>
            </div>

            <p className="font-body text-sm text-charcoal/80 leading-relaxed">
              Blossom panicles have completed fruit setting. Selected fruits have been enveloped in individual protective paper bags. Subsurface drip emitters are running on summer schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button href="/visit" variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1.5" /> Schedule a Visit to Meet Your Tree
              </Button>
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
}

