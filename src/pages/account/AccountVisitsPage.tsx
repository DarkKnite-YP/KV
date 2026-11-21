import React from 'react';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Badge, Button } from '../../components/ui';
import { Calendar, Plus, Compass } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useOrchardStore } from '../../stores/orchardStore';

export default function AccountVisitsPage() {
  const { user } = useAuthStore();
  const { visits } = useOrchardStore();

  const userEmail = user?.email?.toLowerCase();
  const userPhone = user?.user_metadata?.phone;

  const userVisits = visits.filter((v) => {
    if (!user) return false;
    if (userEmail && v.email?.toLowerCase() === userEmail) return true;
    if (userPhone && v.phone?.replace(/\D/g, '') === userPhone.replace(/\D/g, '')) return true;
    return false;
  });

  return (
    <>
      <SEO title="My Orchard Visits" description="Manage your planned farm visits." noIndex />

      <AccountLayout title="My Orchard Visits" subtitle="Review scheduled visits to our grove in Surat.">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-2xl text-charcoal">Scheduled & Past Visits</h3>
            <Button href="/visit" variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Request New Visit
            </Button>
          </div>

          {userVisits.length > 0 ? (
            <div className="space-y-4">
              {userVisits.map((visit) => (
                <div key={visit.id} className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
                    <div>
                      <span className="font-display text-xl text-charcoal font-semibold">Visit on {visit.preferred_date}</span>
                      <p className="font-body text-xs text-charcoal/50">Party of {visit.number_of_visitors} visitors</p>
                    </div>
                    <Badge variant={visit.status === 'confirmed' ? 'green' : 'neutral'}>
                      {visit.status}
                    </Badge>
                  </div>
                  {visit.message && (
                    <p className="font-body text-xs text-charcoal/70">
                      {visit.message}
                    </p>
                  )}
                  <p className="font-body text-[11px] text-charcoal/50">
                    Location: Kesari Van, Umbhel, Kamrej, Surat. Please arrive by 9:30 AM to avoid peak afternoon heat.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
              <Compass className="w-12 h-12 text-charcoal/30 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display text-2xl text-charcoal">No Scheduled Visits</h3>
                <p className="font-body text-xs text-charcoal/60 max-w-sm mx-auto">
                  Experience our grove in person. Walk under mature Gir Kesar canopies and observe our drip-irrigated soil biology firsthand.
                </p>
              </div>
              <Button href="/visit" variant="primary" size="md">
                <Calendar className="w-4 h-4 mr-1.5" /> Book an Orchard Visit
              </Button>
            </div>
          )}
        </div>
      </AccountLayout>
    </>
  );
}

