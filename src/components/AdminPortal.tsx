import React, { useState } from 'react';
import { useTrek } from '../context/TrekContext';
import { MountainTrail, DifficultyLevel } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Users,
  Compass,
  RotateCcw,
  Eye,
  EyeOff,
  LogOut,
  Mountain,
  Calendar,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    adminLogin,
    adminLogout,
    trails,
    addTrail,
    updateTrail,
    deleteTrail,
    toggleTrailStatus,
    bookings,
    updateBookingStatus,
    deleteBooking,
    resetDataToDefaults,
  } = useTrek();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState<'trails' | 'bookings'>('trails');

  // Trail Add / Edit Modal state
  const [editingTrail, setEditingTrail] = useState<MountainTrail | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [trailForm, setTrailForm] = useState({
    name: '',
    region: '',
    country: '',
    highestPointMeters: 4500,
    distanceKm: 90,
    durationDays: 7,
    difficulty: 'Challenging' as DifficultyLevel,
    priceUsd: 1600,
    rating: 4.9,
    reviewCount: 45,
    description: '',
    highlights: 'Panoramic summit pass, Glacial lake camp, Local sherpa guides',
    lat: 28.0,
    lng: 85.0,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    requiredGear: 'Gore-Tex boots, 4-season sleeping bag, Trekking poles',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    leadGuide: 'Dawa Sherpa (IFMGA)',
    slotsTotal: 12,
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const openAddModal = () => {
    setTrailForm({
      name: '',
      region: 'Swiss Alps',
      country: 'Switzerland',
      highestPointMeters: 3800,
      distanceKm: 85,
      durationDays: 6,
      difficulty: 'Challenging',
      priceUsd: 1750,
      rating: 4.9,
      reviewCount: 20,
      description: 'Spectacular alpine high pass traverse with glacial moraines and pristine tarns.',
      highlights: 'High col pass, Sunset alpenglow, Historic mountain huts',
      lat: 46.0,
      lng: 7.5,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      requiredGear: 'Trekking poles, Ankle-support boots, Thermal base layers, Waterproof hardshell',
      startDate: '2026-08-10',
      endDate: '2026-08-16',
      leadGuide: 'Philippe Laurent (UIAGM)',
      slotsTotal: 12,
    });
    setEditingTrail(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (trail: MountainTrail) => {
    setEditingTrail(trail);
    setTrailForm({
      name: trail.name,
      region: trail.region,
      country: trail.country,
      highestPointMeters: trail.highestPointMeters,
      distanceKm: trail.distanceKm,
      durationDays: trail.durationDays,
      difficulty: trail.difficulty,
      priceUsd: trail.priceUsd,
      rating: trail.rating,
      reviewCount: trail.reviewCount,
      description: trail.description,
      highlights: trail.highlights.join(', '),
      lat: trail.coordinates.lat,
      lng: trail.coordinates.lng,
      imageUrl: trail.imageUrl,
      requiredGear: trail.requiredGear.join(', '),
      startDate: trail.availableDates[0]?.startDate || '2026-09-01',
      endDate: trail.availableDates[0]?.endDate || '2026-09-08',
      leadGuide: trail.availableDates[0]?.leadGuide || 'Expedition Lead',
      slotsTotal: trail.availableDates[0]?.slotsTotal || 12,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTrail = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsArr = trailForm.highlights.split(',').map((h) => h.trim()).filter(Boolean);
    const gearArr = trailForm.requiredGear.split(',').map((g) => g.trim()).filter(Boolean);

    if (editingTrail) {
      updateTrail(editingTrail.id, {
        name: trailForm.name,
        region: trailForm.region,
        country: trailForm.country,
        highestPointMeters: Number(trailForm.highestPointMeters),
        distanceKm: Number(trailForm.distanceKm),
        durationDays: Number(trailForm.durationDays),
        difficulty: trailForm.difficulty,
        priceUsd: Number(trailForm.priceUsd),
        description: trailForm.description,
        highlights: highlightsArr,
        requiredGear: gearArr,
        imageUrl: trailForm.imageUrl,
      });
    } else {
      addTrail({
        name: trailForm.name,
        region: trailForm.region,
        country: trailForm.country,
        highestPointMeters: Number(trailForm.highestPointMeters),
        distanceKm: Number(trailForm.distanceKm),
        durationDays: Number(trailForm.durationDays),
        difficulty: trailForm.difficulty,
        priceUsd: Number(trailForm.priceUsd),
        rating: trailForm.rating,
        reviewCount: trailForm.reviewCount,
        description: trailForm.description,
        highlights: highlightsArr,
        requiredGear: gearArr,
        includedServices: [
          'Certified Mountain Lead Guide',
          'Full trail permits & national park entry',
          'Mountain camp/hut accommodations',
        ],
        excludedServices: ['Personal international flights', 'Alcohol & gear rentals'],
        imageUrl: trailForm.imageUrl,
        gallery: [trailForm.imageUrl],
        isActive: true,
        isFeatured: false,
        bestMonths: ['July', 'August', 'September'],
        coordinates: {
          lat: Number(trailForm.lat),
          lng: Number(trailForm.lng),
          elevation: Number(trailForm.highestPointMeters),
        },
        elevationProfile: [
          { distanceKm: 0, elevationM: 1800, label: 'Base Camp', isCamp: true },
          { distanceKm: 40, elevationM: Number(trailForm.highestPointMeters), label: 'Summit Pass', isSummit: true },
        ],
        itinerary: [
          {
            day: 1,
            title: 'Trailhead to Base Camp',
            distanceKm: 14,
            ascentM: 600,
            descentM: 100,
            campName: 'Valley Camp',
            description: 'Departure hike into the lower valley through mountain pine forests.',
            altitudeM: 2000,
          },
        ],
        availableDates: [
          {
            id: `date-${Date.now()}`,
            startDate: trailForm.startDate,
            endDate: trailForm.endDate,
            slotsTotal: Number(trailForm.slotsTotal),
            slotsBooked: 2,
            leadGuide: trailForm.leadGuide,
            priceModifier: 1.0,
          },
        ],
      });
    }

    setIsAddModalOpen(false);
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const totalTrekkers = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.partySize, 0);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 bg-[#ffffff]">
        <div className="p-8 rounded-2xl border border-[#dddddd] shadow-airbnb bg-[#ffffff] space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f7f7f7] text-[#222222] flex items-center justify-center mx-auto border border-[#ebebeb]">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-[#222222]">
              Host &amp; Admin login
            </h2>
            <p className="text-[13px] text-[#6a6a6a] mt-1">
              Manage mountain trails, adjust pricing, and oversee reservations.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[12px] font-semibold text-[#222222] mb-1">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (e.g. summit2026)"
                className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="text-[13px] text-rose-600 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Incorrect password. Use &quot;summit2026&quot; or click Demo Login.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors shadow-sm cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <div className="pt-2 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={() => adminLogin('summit2026')}
              className="w-full py-2.5 rounded-lg border border-[#dddddd] hover:border-[#222222] text-[#222222] text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#ff385c]" />
              <span>One-Click Demo Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#ffffff]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <h1 className="text-[26px] sm:text-[32px] font-semibold text-[#222222] tracking-tight">
            Expedition Command Dashboard
          </h1>
          <p className="text-[14px] text-[#6a6a6a]">
            Manage trails, update availability slots, and track bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDataToDefaults}
            className="px-4 py-2 rounded-lg border border-[#dddddd] hover:border-[#222222] text-[#222222] text-[13px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset seed data</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trail</span>
          </button>

          <button
            onClick={adminLogout}
            className="p-2 rounded-lg hover:bg-[#f7f7f7] text-[#6a6a6a] hover:text-[#222222] transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb">
          <div className="text-[12px] font-medium text-[#6a6a6a]">Total Revenue</div>
          <div className="text-[24px] font-semibold text-[#222222] mt-0.5">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#ff385c]">From active bookings</div>
        </div>

        <div className="p-5 rounded-xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb">
          <div className="text-[12px] font-medium text-[#6a6a6a]">Confirmed Trekkers</div>
          <div className="text-[24px] font-semibold text-[#222222] mt-0.5">
            {totalTrekkers}
          </div>
          <div className="text-[11px] text-[#6a6a6a]">Active travelers</div>
        </div>

        <div className="p-5 rounded-xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb">
          <div className="text-[12px] font-medium text-[#6a6a6a]">Catalog Trails</div>
          <div className="text-[24px] font-semibold text-[#222222] mt-0.5">
            {trails.length}
          </div>
          <div className="text-[11px] text-[#6a6a6a]">{trails.filter((t) => t.isActive).length} active</div>
        </div>

        <div className="p-5 rounded-xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb">
          <div className="text-[12px] font-medium text-[#6a6a6a]">Reservations</div>
          <div className="text-[24px] font-semibold text-[#222222] mt-0.5">
            {bookings.length}
          </div>
          <div className="text-[11px] text-[#6a6a6a]">Permits requested</div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-6 border-b border-[#ebebeb] text-[15px] font-medium">
        <button
          onClick={() => setAdminTab('trails')}
          className={`pb-3 transition-colors ${
            adminTab === 'trails'
              ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
              : 'text-[#6a6a6a] hover:text-[#222222]'
          }`}
        >
          Mountain Trails ({trails.length})
        </button>
        <button
          onClick={() => setAdminTab('bookings')}
          className={`pb-3 transition-colors ${
            adminTab === 'bookings'
              ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
              : 'text-[#6a6a6a] hover:text-[#222222]'
          }`}
        >
          Reservations ({bookings.length})
        </button>
      </div>

      {/* Trails table */}
      {adminTab === 'trails' && (
        <div className="rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f7f7f7] text-[#6a6a6a] text-[12px] uppercase tracking-wider border-b border-[#ebebeb]">
                <tr>
                  <th className="py-3 px-4">Trail</th>
                  <th className="py-3 px-4">Peak</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb] text-[#222222]">
                {trails.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="py-3 px-4 font-semibold">{t.name}</td>
                    <td className="py-3 px-4 font-mono">{t.highestPointMeters}m</td>
                    <td className="py-3 px-4 text-[#6a6a6a]">{t.difficulty}</td>
                    <td className="py-3 px-4 font-semibold">${t.priceUsd}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleTrailStatus(t.id)}
                        className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                          t.isActive
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {t.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1 rounded hover:bg-[#ebebeb] text-[#222222]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete trail ${t.name}?`)) deleteTrail(t.id);
                          }}
                          className="p-1 rounded hover:bg-[#ebebeb] text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings table */}
      {adminTab === 'bookings' && (
        <div className="rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f7f7f7] text-[#6a6a6a] text-[12px] uppercase tracking-wider border-b border-[#ebebeb]">
                <tr>
                  <th className="py-3 px-4">Pass #</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Trail</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb] text-[#222222]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="py-3 px-4 font-mono text-[13px]">{b.bookingNumber}</td>
                    <td className="py-3 px-4 font-medium">{b.leadTrekker.fullName}</td>
                    <td className="py-3 px-4">{b.trailName}</td>
                    <td className="py-3 px-4 font-semibold">${b.totalPrice}</td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                        className="border border-[#dddddd] rounded px-2 py-1 text-[13px] bg-white cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete record ${b.bookingNumber}?`)) deleteBooking(b.id);
                        }}
                        className="text-rose-600 hover:underline text-[13px]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Trail Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-[2px]">
          <div className="w-full max-w-xl bg-[#ffffff] rounded-2xl shadow-airbnb-elevated border border-[#ebebeb] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebebeb]">
              <h3 className="text-[18px] font-semibold text-[#222222]">
                {editingTrail ? 'Edit trail details' : 'Add new mountain trail'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] text-[#222222] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrail} className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#222222] mb-1">Trail Name</label>
                <input
                  type="text"
                  required
                  value={trailForm.name}
                  onChange={(e) => setTrailForm({ ...trailForm, name: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">Region</label>
                  <input
                    type="text"
                    required
                    value={trailForm.region}
                    onChange={(e) => setTrailForm({ ...trailForm, region: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={trailForm.country}
                    onChange={(e) => setTrailForm({ ...trailForm, country: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">Peak (m)</label>
                  <input
                    type="number"
                    required
                    value={trailForm.highestPointMeters}
                    onChange={(e) => setTrailForm({ ...trailForm, highestPointMeters: Number(e.target.value) })}
                    className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">Days</label>
                  <input
                    type="number"
                    value={trailForm.durationDays}
                    onChange={(e) => setTrailForm({ ...trailForm, durationDays: Number(e.target.value) })}
                    className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={trailForm.priceUsd}
                    onChange={(e) => setTrailForm({ ...trailForm, priceUsd: Number(e.target.value) })}
                    className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#222222] mb-1">Image URL</label>
                <input
                  type="text"
                  value={trailForm.imageUrl}
                  onChange={(e) => setTrailForm({ ...trailForm, imageUrl: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#222222] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={trailForm.description}
                  onChange={(e) => setTrailForm({ ...trailForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#dddddd] focus:border-[#222222] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ebebeb]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#dddddd] text-[#222222] font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[13px]"
                >
                  Save trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
