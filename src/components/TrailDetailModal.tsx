import React, { useState, useEffect } from 'react';
import { MountainTrail, MountainWeather } from '../types';
import { useTrek } from '../context/TrekContext';
import { ElevationProfileChart } from './ElevationProfileChart';
import {
  X,
  Star,
  Share2,
  Heart,
  Mountain,
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  CloudSun,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Wind,
  Droplets,
  Award,
} from 'lucide-react';

interface Props {
  trail: MountainTrail;
  onClose: () => void;
}

export const TrailDetailModal: React.FC<Props> = ({ trail, onClose }) => {
  const {
    setBookingModalTrail,
    setPrefilledAiTrail,
    setActiveTab,
    getMountainWeather,
    wishlist,
    toggleWishlist,
  } = useTrek();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'itinerary' | 'elevation' | 'weather'>('overview');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [weatherData, setWeatherData] = useState<MountainWeather | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<string>(trail.availableDates[0]?.id || '');
  const [guestsCount, setGuestsCount] = useState<number>(1);

  const isSaved = wishlist.includes(trail.id);

  useEffect(() => {
    let isMounted = true;
    getMountainWeather(trail).then((w) => {
      if (isMounted) setWeatherData(w);
    });
    return () => {
      isMounted = false;
    };
  }, [trail]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const selectedDate = trail.availableDates.find((d) => d.id === selectedDateId) || trail.availableDates[0];
  const basePrice = Math.round(trail.priceUsd * (selectedDate?.priceModifier || 1));
  const subtotal = basePrice * guestsCount;
  const permitFee = 85 * guestsCount;
  const serviceFee = Math.round(subtotal * 0.08);
  const totalPrice = subtotal + permitFee + serviceFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#000000]/50 backdrop-blur-[2px] overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#ffffff] rounded-3xl shadow-airbnb-elevated border border-[#ebebeb] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Floating Control Bar */}
        <div className="px-6 py-4 border-b border-[#ebebeb] flex items-center justify-between shrink-0 bg-[#ffffff]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#ff385c] uppercase tracking-wider">
              {trail.difficulty} EXPEDITION
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(trail.id)}
              className="p-2 rounded-full hover:bg-[#f7f7f7] text-[#222222] transition-colors flex items-center gap-1.5 text-[13px] font-medium"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#ff385c] text-[#ff385c]' : 'text-[#222222]'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f7f7f7] text-[#222222] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Listing Title Header */}
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#222222] leading-tight">
              {trail.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[14px] text-[#222222]">
              <span className="flex items-center gap-1 font-semibold">
                <Star className="w-4 h-4 fill-[#222222] text-[#222222]" />
                <span>{trail.rating.toFixed(2)}</span>
                <span className="underline font-normal text-[#6a6a6a]">({trail.reviewCount} reviews)</span>
              </span>
              <span>&bull;</span>
              <span className="font-medium text-[#6a6a6a]">
                {trail.region}, {trail.country}
              </span>
              <span>&bull;</span>
              <span className="font-semibold text-[#ff385c]">
                Peak {trail.highestPointMeters.toLocaleString()}m
              </span>
            </div>
          </div>

          {/* Photo Showcase Grid (Airbnb 5-photo style or crisp banner) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-[#f2f2f2]">
            <div className="md:col-span-2 h-full overflow-hidden">
              <img
                src={trail.imageUrl}
                alt={trail.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="hidden md:flex flex-col gap-2 h-full">
              <div className="flex-1 overflow-hidden">
                <img
                  src={trail.gallery[1] || trail.imageUrl}
                  alt={trail.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <img
                  src={trail.gallery[0] || trail.imageUrl}
                  alt={trail.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-2 h-full">
              <div className="flex-1 overflow-hidden">
                <img
                  src={trail.gallery[1] || trail.imageUrl}
                  alt={trail.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 overflow-hidden relative">
                <img
                  src={trail.imageUrl}
                  alt={trail.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-semibold text-[13px]">
                  View all photos
                </div>
              </div>
            </div>
          </div>

          {/* Signature Rating Display Card ({rating-display-card}) */}
          <div className="p-6 rounded-2xl border border-[#ebebeb] bg-[#f7f7f7] text-center max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-[#6a6a6a]">❧</span>
              <span className="text-[56px] font-bold text-[#222222] tracking-tight leading-none">
                {trail.rating.toFixed(2)}
              </span>
              <span className="text-2xl text-[#6a6a6a]">☙</span>
            </div>
            <div className="text-[16px] font-semibold text-[#222222]">
              Guest favorite
            </div>
            <p className="text-[13px] text-[#6a6a6a] max-w-sm mx-auto">
              One of the most loved high-altitude routes on ApexTrail based on ratings, reviews, and summit safety reliability.
            </p>
          </div>

          {/* 2-Column Listing Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Content Column (~64%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tab navigation */}
              <div className="flex items-center gap-6 border-b border-[#ebebeb] text-[15px] font-medium">
                <button
                  onClick={() => setActiveSubTab('overview')}
                  className={`pb-3 transition-colors ${
                    activeSubTab === 'overview'
                      ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
                      : 'text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSubTab('itinerary')}
                  className={`pb-3 transition-colors ${
                    activeSubTab === 'itinerary'
                      ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
                      : 'text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  Itinerary ({trail.itinerary.length} Days)
                </button>
                <button
                  onClick={() => setActiveSubTab('elevation')}
                  className={`pb-3 transition-colors ${
                    activeSubTab === 'elevation'
                      ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
                      : 'text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  Elevation Profile
                </button>
                <button
                  onClick={() => setActiveSubTab('weather')}
                  className={`pb-3 transition-colors ${
                    activeSubTab === 'weather'
                      ? 'border-b-2 border-[#222222] text-[#222222] font-semibold'
                      : 'text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  Live Radar
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6">
                  {/* Lead Guide Host Row */}
                  <div className="flex items-center justify-between pb-6 border-b border-[#ebebeb]">
                    <div>
                      <h3 className="text-[17px] font-semibold text-[#222222]">
                        Expedition led by certified UIAGM &amp; Sherpa Guides
                      </h3>
                      <p className="text-[14px] text-[#6a6a6a]">
                        {trail.durationDays} days &bull; {trail.distanceKm} km total &bull; Highest pass {trail.highestPointMeters}m
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#f2f2f2] border border-[#dddddd] flex items-center justify-center font-bold text-[#222222]">
                      <Mountain className="w-6 h-6 text-[#222222]" />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-4">
                    <h4 className="text-[17px] font-semibold text-[#222222]">
                      What this expedition offers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {trail.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-[14px] text-[#222222]">
                          <CheckCircle2 className="w-5 h-5 text-[#ff385c] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="space-y-3 pt-4 border-t border-[#ebebeb]">
                    <h4 className="text-[17px] font-semibold text-[#222222]">
                      About this trail
                    </h4>
                    <p className="text-[15px] text-[#3f3f3f] leading-relaxed">
                      {trail.description}
                    </p>
                  </div>

                  {/* Included Services */}
                  <div className="space-y-3 pt-4 border-t border-[#ebebeb]">
                    <h4 className="text-[17px] font-semibold text-[#222222]">
                      Included in reservation
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] text-[#3f3f3f]">
                      {trail.includedServices.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#222222]" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Day-by-Day Itinerary */}
              {activeSubTab === 'itinerary' && (
                <div className="space-y-4">
                  <h4 className="text-[17px] font-semibold text-[#222222]">
                    Expedition Schedule ({trail.itinerary.length} Days)
                  </h4>
                  <div className="space-y-3">
                    {trail.itinerary.map((day) => {
                      const isExpanded = expandedDay === day.day;
                      return (
                        <div
                          key={day.day}
                          className="rounded-xl border border-[#dddddd] bg-[#ffffff] overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                            className="w-full text-left p-4 flex items-center justify-between hover:bg-[#f7f7f7] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-[#f2f2f2] text-[#222222] text-[12px] font-bold flex items-center justify-center shrink-0">
                                {day.day}
                              </span>
                              <div>
                                <div className="text-[15px] font-semibold text-[#222222]">
                                  {day.title}
                                </div>
                                <div className="text-[13px] text-[#6a6a6a]">
                                  {day.distanceKm} km &bull; +{day.ascentM}m / -{day.descentM}m &bull; Camp: {day.altitudeM}m
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#6a6a6a]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#6a6a6a]" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-4 pt-1 border-t border-[#ebebeb] text-[14px] text-[#3f3f3f] space-y-2">
                              <p className="leading-relaxed">{day.description}</p>
                              <div className="text-[12px] text-[#6a6a6a] font-medium flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#ff385c]" />
                                <span>Overnight Camp: <strong>{day.campName}</strong></span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Elevation Profile */}
              {activeSubTab === 'elevation' && (
                <div className="space-y-4">
                  <h4 className="text-[17px] font-semibold text-[#222222]">
                    Topographic Elevation Profile
                  </h4>
                  <div className="p-4 rounded-2xl border border-[#ebebeb] bg-[#ffffff]">
                    <ElevationProfileChart
                      points={trail.elevationProfile}
                      highestPoint={trail.highestPointMeters}
                      trailName={trail.name}
                    />
                  </div>
                  <p className="text-[13px] text-[#6a6a6a]">
                    Peak elevation reaches {trail.highestPointMeters.toLocaleString()}m. Our AI Adviser calibrates daily ascent limits and rest steps to prevent acute mountain sickness.
                  </p>
                </div>
              )}

              {/* Tab 4: Summit Weather Radar */}
              {activeSubTab === 'weather' && (
                <div className="space-y-4">
                  <h4 className="text-[17px] font-semibold text-[#222222]">
                    Real-time Summit Telemetry (Open-Meteo)
                  </h4>
                  {weatherData ? (
                    <div className="p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[12px] font-semibold text-[#6a6a6a] uppercase">
                            Peak Altitude: {weatherData.summitElevation}m
                          </div>
                          <div className="text-[32px] font-bold text-[#222222] font-mono">
                            {weatherData.temperature}°C
                          </div>
                          <div className="text-[13px] text-[#6a6a6a]">
                            Feels like {weatherData.feelsLike}°C with summit wind
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${
                            weatherData.safetyLevel === 'Good'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {weatherData.safetyLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#ebebeb] text-[13px]">
                        <div>
                          <div className="text-[#6a6a6a]">Wind Gusts</div>
                          <div className="font-semibold text-[#222222]">{weatherData.windGusts} km/h</div>
                        </div>
                        <div>
                          <div className="text-[#6a6a6a]">Precipitation</div>
                          <div className="font-semibold text-[#222222]">{weatherData.precipitation} mm</div>
                        </div>
                        <div>
                          <div className="text-[#6a6a6a]">Humidity</div>
                          <div className="font-semibold text-[#222222]">{weatherData.humidity}%</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f7f7f7] text-[13px] text-[#3f3f3f]">
                        {weatherData.safetyNotice}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-[#6a6a6a] text-[14px]">
                      Loading real-time alpine telemetry...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Reservation Card ({component.reservation-card}) */}
            <div>
              <div className="sticky top-24 p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb space-y-5">
                {/* Nightly / Trekker Price */}
                <div className="flex items-baseline justify-between">
                  <div className="text-[22px] font-semibold text-[#222222]">
                    ${basePrice.toLocaleString()}
                    <span className="text-[14px] text-[#6a6a6a] font-normal"> / trekker</span>
                  </div>
                  <div className="flex items-center gap-1 text-[14px] font-semibold text-[#222222]">
                    <Star className="w-3.5 h-3.5 fill-[#222222]" />
                    <span>{trail.rating.toFixed(2)}</span>
                  </div>
                </div>

                {/* Date & Guest Picker Box (Airbnb segmented box) */}
                <div className="rounded-xl border border-[#dddddd] overflow-hidden text-[12px]">
                  {/* Dates Row */}
                  <div className="p-3 border-b border-[#dddddd] bg-[#ffffff]">
                    <div className="font-bold uppercase tracking-wider text-[#222222] text-[10px]">
                      EXPEDITION DATES
                    </div>
                    <select
                      value={selectedDateId}
                      onChange={(e) => setSelectedDateId(e.target.value)}
                      className="w-full mt-1 text-[13px] text-[#222222] font-medium bg-transparent focus:outline-none cursor-pointer"
                    >
                      {trail.availableDates.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.startDate} - {d.endDate} ({d.slotsTotal - d.slotsBooked} left)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests Row */}
                  <div className="p-3 bg-[#ffffff]">
                    <div className="font-bold uppercase tracking-wider text-[#222222] text-[10px]">
                      TREKKERS
                    </div>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full mt-1 text-[13px] text-[#222222] font-medium bg-transparent focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'trekker' : 'trekkers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary CTA (button-primary in Rausch #ff385c) */}
                <button
                  onClick={() => {
                    onClose();
                    setBookingModalTrail(trail);
                  }}
                  className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-[#ffffff] font-medium text-[16px] transition-colors shadow-sm cursor-pointer flex items-center justify-center"
                >
                  Reserve
                </button>

                <p className="text-[12px] text-center text-[#6a6a6a]">
                  You won&apos;t be charged yet
                </p>

                {/* Fee Breakdown Stack */}
                <div className="space-y-3 text-[14px] text-[#222222] pt-3 border-t border-[#ebebeb]">
                  <div className="flex justify-between">
                    <span className="underline text-[#3f3f3f]">
                      ${basePrice.toLocaleString()} &times; {guestsCount} trekker{guestsCount > 1 ? 's' : ''}
                    </span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="underline text-[#3f3f3f]">National park &amp; altitude permit</span>
                    <span>${permitFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="underline text-[#3f3f3f]">Expedition logistics &amp; rescue insurance</span>
                    <span>${serviceFee.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t border-[#ebebeb] flex justify-between font-semibold text-[16px]">
                    <span>Total before taxes</span>
                    <span>${totalPrice.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* AI Packing Advice Shortcut */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      setPrefilledAiTrail(trail);
                      setActiveTab('ai-guide');
                    }}
                    className="w-full py-2.5 rounded-lg border border-[#dddddd] hover:border-[#222222] text-[13px] font-semibold text-[#222222] flex items-center justify-center gap-2 hover:bg-[#f7f7f7] transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#ff385c]" />
                    <span>Get AI Packing List for this trail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
