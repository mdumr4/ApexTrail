import React, { useState } from 'react';
import { useTrek } from '../context/TrekContext';
import { Booking } from '../types';
import {
  Ticket,
  Calendar,
  Mountain,
  Users,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { bookings, updateBookingStatus, trails, setPrefilledAiTrail, setActiveTab } = useTrek();

  const handlePrint = () => {
    window.print();
  };

  const handleAiPlanForBooking = (b: Booking) => {
    const matchedTrail = trails.find((t) => t.id === b.trailId);
    if (matchedTrail) {
      setPrefilledAiTrail(matchedTrail);
    }
    setActiveTab('ai-guide');
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f7f7f7] border border-[#dddddd] text-[#222222] flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-[22px] font-semibold text-[#222222]">
          No trips booked... yet!
        </h3>
        <p className="text-[14px] text-[#6a6a6a] max-w-sm mx-auto">
          Time to dust off your hiking boots and start planning your next mountain summit expedition.
        </p>
        <button
          onClick={() => setActiveTab('explore')}
          className="h-12 px-6 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Start exploring trails</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#ffffff]">
      <div className="border-b border-[#ebebeb] pb-6">
        <h1 className="text-[26px] sm:text-[32px] font-semibold text-[#222222] tracking-tight">
          Trips &amp; Expeditions ({bookings.length})
        </h1>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Manage your confirmed permits, view dates, and launch AI packing checklists.
        </p>
      </div>

      <div className="space-y-6">
        {bookings.map((b) => {
          const isCancelled = b.status === 'Cancelled';
          return (
            <div
              key={b.id}
              className={`rounded-2xl border border-[#dddddd] bg-[#ffffff] p-6 shadow-airbnb space-y-5 transition-all ${
                isCancelled ? 'opacity-60 bg-[#f7f7f7]' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebebeb] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-[#6a6a6a]">
                      Pass #{b.bookingNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : b.status === 'Completed'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-semibold text-[#222222] mt-1">
                    {b.trailName}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[12px] text-[#6a6a6a]">Total Paid</div>
                  <div className="text-[20px] font-semibold text-[#222222]">
                    ${b.totalPrice.toLocaleString()} <span className="text-[13px] text-[#6a6a6a] font-normal">USD</span>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                <div className="p-3.5 rounded-xl bg-[#f7f7f7]">
                  <div className="text-[12px] text-[#6a6a6a] mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#222222]" />
                    <span>Dates</span>
                  </div>
                  <div className="font-semibold text-[#222222]">{b.startDate} &ndash; {b.endDate}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f7f7f7]">
                  <div className="text-[12px] text-[#6a6a6a] mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#222222]" />
                    <span>Trekker</span>
                  </div>
                  <div className="font-semibold text-[#222222]">{b.leadTrekker.fullName} ({b.partySize})</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f7f7f7]">
                  <div className="text-[12px] text-[#6a6a6a] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#222222]" />
                    <span>Permit Status</span>
                  </div>
                  <div className="font-semibold text-[#222222]">TIMS Verified</div>
                </div>
              </div>

              {b.selectedAddons.length > 0 && (
                <div className="text-[13px] text-[#6a6a6a] flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#222222]">Rented Equipment:</span>
                  {b.selectedAddons.map((a) => (
                    <span key={a.id} className="px-2.5 py-0.5 rounded-full bg-[#f2f2f2] text-[#222222] text-[12px]">
                      {a.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ebebeb]">
                <div className="text-[12px] text-[#6a6a6a]">
                  Payment method: {b.paymentMethod}
                </div>

                <div className="flex items-center gap-3">
                  {!isCancelled && (
                    <button
                      onClick={() => handleAiPlanForBooking(b)}
                      className="h-10 px-4 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Packing List</span>
                    </button>
                  )}

                  <button
                    onClick={handlePrint}
                    className="h-10 px-4 rounded-[8px] border border-[#dddddd] hover:border-[#222222] text-[#222222] font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print voucher</span>
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => {
                        if (confirm(`Cancel reservation ${b.bookingNumber}?`)) {
                          updateBookingStatus(b.id, 'Cancelled');
                        }
                      }}
                      className="text-[13px] text-[#6a6a6a] hover:text-[#222222] underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
