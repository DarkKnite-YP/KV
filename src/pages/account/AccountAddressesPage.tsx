import React, { useState } from 'react';
import { AccountLayout } from '../../components/account/AccountLayout';
import { SEO } from '../../components/ui/SEO';
import { Button, Input, Select, Badge } from '../../components/ui';
import { SERVICEABLE_STATES } from '../../lib/constants';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    line1: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
  });

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddr.name || !newAddr.line1) return;

    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        name: newAddr.name,
        phone: newAddr.phone,
        line1: newAddr.line1,
        city: newAddr.city,
        state: newAddr.state,
        pincode: newAddr.pincode,
        isDefault: false,
      },
    ]);
    setShowAddForm(false);
    setNewAddr({ name: '', phone: '', line1: '', city: '', state: 'Gujarat', pincode: '' });
  }

  function handleRemove(id: string) {
    setAddresses(addresses.filter((a) => a.id !== id));
  }

  return (
    <>
      <SEO title="Saved Addresses" description="Manage saved delivery addresses." noIndex />

      <AccountLayout title="My Addresses" subtitle="Manage harvest crate delivery destinations.">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-2xl text-charcoal">Delivery Address Book</h3>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add New Address
              </Button>
            )}
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-4">
              <h4 className="font-display text-xl text-charcoal">New Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Recipient Name / Label"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  placeholder="e.g. Home, Parent's Home"
                />
                <Input
                  label="Contact Mobile"
                  required
                  maxLength={10}
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  placeholder="10-digit number"
                />
              </div>

              <Input
                label="Street Address"
                required
                value={newAddr.line1}
                onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                placeholder="House no., Building, Area"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                />
                <Select
                  label="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  options={SERVICEABLE_STATES.map((s) => ({ value: s, label: s }))}
                />
                <Input
                  label="PIN Code"
                  required
                  maxLength={6}
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" size="sm">Save Address</Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showAddForm && (
            <div className="bg-white p-10 rounded-softer shadow-card border border-charcoal/10 text-center space-y-4">
              <MapPin className="w-12 h-12 text-charcoal/30 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display text-2xl text-charcoal">No Saved Addresses</h3>
                <p className="font-body text-xs text-charcoal/60 max-w-sm mx-auto">
                  Add your home or office address for fast, one-click checkout during harvest dispatches.
                </p>
              </div>
              <Button onClick={() => setShowAddForm(true)} variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Your First Address
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white p-6 rounded-softer shadow-card border border-charcoal/10 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-charcoal font-semibold">{addr.name}</span>
                  {addr.isDefault && <Badge variant="green" size="sm">Default</Badge>}
                </div>
                <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                  {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                </p>
                <p className="font-body text-xs text-charcoal/50">Mobile: +91 {addr.phone}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleRemove(addr.id)}
                    className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccountLayout>
    </>
  );
}

