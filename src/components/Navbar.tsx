import React, { useState } from 'react';
import { useTrek } from '../context/TrekContext';
import { SkillLevel } from '../types';
import {
  Compass,
  Sparkles,
  CloudSun,
  Ticket,
  ShieldCheck,
  Shield,
  Menu,
  User,
  Globe,
  ChevronDown,
  Mountain,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    userProfile,
    setUserProfile,
    isAdmin,
  } = useTrek();

  const [menuOpen, setMenuOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Mountaineer'];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#ebebeb] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Flush Left */}
          <div
            onClick={() => handleTabClick('explore')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            {/* Airbnb-style Rausch Emblem */}
            <div className="w-9 h-9 rounded-full bg-[#ff385c] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Mountain className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <span className="text-[20px] font-bold tracking-tight text-[#ff385c] font-sans">
              apextrail
            </span>
          </div>

          {/* Centered Product Tabs */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Tab 1: Mountain Treks */}
            <button
              onClick={() => handleTabClick('explore')}
              className={`relative py-2 text-[15px] font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'text-[#222222] font-semibold'
                  : 'text-[#6a6a6a] hover:text-[#222222]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Mountain Treks</span>
              {activeTab === 'explore' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#222222] rounded-full" />
              )}
            </button>

            {/* Tab 2: AI Expedition Guide (with NEW badge) */}
            <button
              onClick={() => handleTabClick('ai-guide')}
              className={`relative py-2 text-[15px] font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'ai-guide'
                  ? 'text-[#222222] font-semibold'
                  : 'text-[#6a6a6a] hover:text-[#222222]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#ff385c]" />
              <span>AI Expedition Guide</span>
              <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#f7f7f7] border border-[#dddddd] text-[#222222]">
                NEW
              </span>
              {activeTab === 'ai-guide' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#222222] rounded-full" />
              )}
            </button>

            {/* Tab 3: Summit Weather */}
            <button
              onClick={() => handleTabClick('weather')}
              className={`relative py-2 text-[15px] font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'weather'
                  ? 'text-[#222222] font-semibold'
                  : 'text-[#6a6a6a] hover:text-[#222222]'
              }`}
            >
              <CloudSun className="w-4 h-4" />
              <span>Weather Radar</span>
              {activeTab === 'weather' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#222222] rounded-full" />
              )}
            </button>

            {/* Tab 4: My Trips */}
            <button
              onClick={() => handleTabClick('my-bookings')}
              className={`relative py-2 text-[15px] font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'my-bookings'
                  ? 'text-[#222222] font-semibold'
                  : 'text-[#6a6a6a] hover:text-[#222222]'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Trips</span>
              {bookings.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#ff385c] text-white text-[10px] font-bold flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
              {activeTab === 'my-bookings' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#222222] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Utilities & Account Menu Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('admin')}
              className="hidden lg:block text-[14px] font-medium text-[#222222] px-3.5 py-2 rounded-full hover:bg-[#f7f7f7] transition-colors"
            >
              {isAdmin ? 'Admin Dashboard' : 'Admin portal'}
            </button>

            <button
              onClick={() => setSkillModalOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#f7f7f7] text-[#222222] transition-colors"
              title="Change Trekker Skill Level"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Airbnb Pill Account Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1.5 pl-3.5 rounded-full border border-[#dddddd] hover:shadow-airbnb transition-all bg-[#ffffff]"
              >
                <Menu className="w-4 h-4 text-[#222222]" />
                <div className="w-7 h-7 rounded-full bg-[#222222] text-white text-xs font-semibold flex items-center justify-center">
                  {userProfile.fullName ? userProfile.fullName.charAt(0) : 'A'}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-[#ffffff] border border-[#ebebeb] rounded-2xl shadow-airbnb-elevated py-2 z-50 text-[14px] animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-[#ebebeb]">
                    <div className="text-[13px] font-semibold text-[#222222]">
                      {userProfile.fullName}
                    </div>
                    <div className="text-[12px] text-[#6a6a6a]">
                      Skill: <strong className="text-[#ff385c]">{userProfile.skillLevel}</strong>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleTabClick('explore')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222] font-medium"
                    >
                      Mountain Trails
                    </button>
                    <button
                      onClick={() => handleTabClick('ai-guide')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222] flex items-center justify-between"
                    >
                      <span>AI Expedition Guide</span>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#ff385c] text-white">
                        NEW
                      </span>
                    </button>
                    <button
                      onClick={() => handleTabClick('weather')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222]"
                    >
                      Weather Telemetry
                    </button>
                    <button
                      onClick={() => handleTabClick('my-bookings')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222] flex items-center justify-between"
                    >
                      <span>Trips &amp; Passes</span>
                      {bookings.length > 0 && (
                        <span className="text-xs font-semibold text-[#6a6a6a]">{bookings.length}</span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-[#ebebeb] pt-1">
                    <button
                      onClick={() => {
                        setSkillModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222]"
                    >
                      Switch skill level ({userProfile.skillLevel})
                    </button>
                    <button
                      onClick={() => handleTabClick('admin')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f7f7f7] text-[#222222] font-medium flex items-center gap-1.5"
                    >
                      {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-[#ff385c]" /> : <Shield className="w-3.5 h-3.5 text-[#6a6a6a]" />}
                      <span>{isAdmin ? 'Admin Console' : 'Admin Login'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Level Selection Modal (Airbnb clean dialog) */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-[2px]">
          <div className="w-full max-w-md bg-[#ffffff] rounded-2xl shadow-airbnb-elevated border border-[#ebebeb] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebebeb]">
              <h3 className="text-[18px] font-semibold text-[#222222]">
                Select your trekker skill level
              </h3>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] text-[#222222] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-[14px] text-[#6a6a6a] leading-normal">
              Our AI engine recalibrates packing lists, weight suggestions, and acclimatization pacing specifically to your skill tier.
            </p>
            <div className="space-y-2">
              {skillLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setUserProfile((prev) => ({ ...prev, skillLevel: lvl }));
                    setSkillModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    userProfile.skillLevel === lvl
                      ? 'border-[#222222] bg-[#f7f7f7]'
                      : 'border-[#dddddd] hover:border-[#222222]'
                  }`}
                >
                  <div>
                    <div className="text-[15px] font-semibold text-[#222222]">{lvl}</div>
                    <div className="text-[12px] text-[#6a6a6a]">
                      {lvl === 'Beginner' && 'Day hikes, sub-2500m peaks, basic kit'}
                      {lvl === 'Intermediate' && 'Multi-day backpacking, passes up to 4000m'}
                      {lvl === 'Advanced' && 'Glacier moraines, high passes 4500m+'}
                      {lvl === 'Mountaineer' && 'Technical crampons, 5500m+, high altitude'}
                    </div>
                  </div>
                  {userProfile.skillLevel === lvl && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff385c]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
