import React, { useState, useEffect } from 'react';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Button, Input } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

export default function AccountProfilePage() {
  const { user, profile, setProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: profile?.first_name || user?.user_metadata?.first_name || '',
    lastName: profile?.last_name || user?.user_metadata?.last_name || '',
    email: user?.email || profile?.email || '',
    phone: profile?.phone || user?.user_metadata?.phone || '',
  });

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile || user) {
      setFormData({
        firstName: profile?.first_name || user?.user_metadata?.first_name || '',
        lastName: profile?.last_name || user?.user_metadata?.last_name || '',
        email: user?.email || profile?.email || '',
        phone: profile?.phone || user?.user_metadata?.phone || '',
      });
    }
  }, [profile, user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    // 1. Update in-memory auth store
    if (profile) {
      setProfile({
        ...profile,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      });
    }

    // 2. Persist to Supabase profiles table
    if (user?.id) {
      try {
        await (supabase.from('profiles') as any).update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <SEO title="My Profile" description="Account details and communication preferences." noIndex />

      <AccountLayout title="Profile & Preferences" subtitle="Manage your profile information and update preferences.">
        <div className="bg-white p-6 md:p-8 rounded-softer shadow-card border border-charcoal/10 space-y-6">
          <h3 className="font-display text-2xl text-charcoal border-b border-charcoal/10 pb-4">
            Personal Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                disabled
                value={formData.email}
                hint="Primary Google / account email (cannot be changed)"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                hint="Editable contact & WhatsApp number for harvest dispatches"
              />
            </div>

            {saved && (
              <p className="text-sm text-green-700 font-body">Profile updated successfully.</p>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </AccountLayout>
    </>
  );
}

