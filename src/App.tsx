/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrekProvider, useTrek } from './context/TrekContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ExploreTrails } from './components/ExploreTrails';
import { AiExpeditionGuide } from './components/AiExpeditionGuide';
import { WeatherStation } from './components/WeatherStation';
import { MyBookings } from './components/MyBookings';
import { AdminPortal } from './components/AdminPortal';
import { TrailDetailModal } from './components/TrailDetailModal';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    activeTab,
    activeTrail,
    setActiveTrail,
    bookingModalTrail,
    setBookingModalTrail,
  } = useTrek();

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#222222] flex flex-col font-['Inter',sans-serif] selection:bg-[#ff385c] selection:text-[#ffffff]">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            <HeroBanner />
            <ExploreTrails />
          </div>
        )}

        {activeTab === 'ai-guide' && <AiExpeditionGuide />}

        {activeTab === 'weather' && <WeatherStation />}

        {activeTab === 'my-bookings' && <MyBookings />}

        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Trail Detail Modal */}
      {activeTrail && (
        <TrailDetailModal
          trail={activeTrail}
          onClose={() => setActiveTrail(null)}
        />
      )}

      {/* Booking Checkout Wizard Modal */}
      {bookingModalTrail && (
        <BookingModal
          trail={bookingModalTrail}
          onClose={() => setBookingModalTrail(null)}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <TrekProvider>
      <AppContent />
    </TrekProvider>
  );
}
