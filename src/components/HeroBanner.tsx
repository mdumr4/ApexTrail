import React, { useState } from 'react';
import { useTrek } from '../context/TrekContext';
import {
  Search,
  SlidersHorizontal,
  Compass,
  Mountain,
  MapPin,
  Calendar,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    activeCategory,
    setActiveCategory,
    userProfile,
    setUserProfile,
    setActiveTab,
  } = useTrek();

  const [whereInput, setWhereInput] = useState(searchQuery);
  const [activeSegment, setActiveSegment] = useState<'where' | 'when' | 'who' | null>(null);

  const categories = [
    { id: 'All Trails', name: 'All Expeditions', icon: Mountain },
    { id: 'Himalayas', name: 'Himalayas', icon: Compass },
    { id: 'Alps', name: 'European Alps', icon: Mountain },
    { id: 'Andes', name: 'Andes & South America', icon: Compass },
    { id: 'High Altitude', name: 'High Col (4,500m+)', icon: Mountain },
    { id: 'Moderate', name: 'Moderate Scenic', icon: Compass },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(whereInput);
    setActiveSegment(null);
  };

  return (
    <div className="bg-[#ffffff] border-b border-[#ebebeb] pt-6 pb-4">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Pill Search Bar (Canonical Airbnb Search) */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#ffffff] rounded-full border border-[#dddddd] shadow-airbnb hover:shadow-airbnb-hover transition-all flex items-center h-16 relative"
          >
            {/* Segment 1: Where */}
            <div
              onClick={() => setActiveSegment('where')}
              className={`flex-1 px-7 py-2 rounded-full cursor-pointer transition-colors ${
                activeSegment === 'where' ? 'bg-[#ebebeb]/50' : 'hover:bg-[#f7f7f7]'
              }`}
            >
              <div className="text-[12px] font-bold text-[#222222] tracking-wide">
                Where
              </div>
              <input
                type="text"
                value={whereInput}
                onChange={(e) => {
                  setWhereInput(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search trails, peaks, countries"
                className="w-full bg-transparent text-[14px] text-[#222222] placeholder-[#6a6a6a] focus:outline-none truncate"
              />
            </div>

            <div className="h-8 w-[1px] bg-[#ebebeb]" />

            {/* Segment 2: When / Difficulty */}
            <div
              onClick={() => setActiveSegment('when')}
              className={`flex-1 px-6 py-2 rounded-full cursor-pointer transition-colors hidden sm:block ${
                activeSegment === 'when' ? 'bg-[#ebebeb]/50' : 'hover:bg-[#f7f7f7]'
              }`}
            >
              <div className="text-[12px] font-bold text-[#222222] tracking-wide">
                Difficulty
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[#222222] focus:outline-none cursor-pointer"
              >
                <option value="All">Any difficulty</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Strenuous">Strenuous</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>

            <div className="h-8 w-[1px] bg-[#ebebeb] hidden sm:block" />

            {/* Segment 3: Who (Skill Level) */}
            <div
              onClick={() => setActiveSegment('who')}
              className={`flex-1 px-6 py-2 rounded-full cursor-pointer transition-colors hidden md:block ${
                activeSegment === 'who' ? 'bg-[#ebebeb]/50' : 'hover:bg-[#f7f7f7]'
              }`}
            >
              <div className="text-[12px] font-bold text-[#222222] tracking-wide">
                Skill Level
              </div>
              <select
                value={userProfile.skillLevel}
                onChange={(e) => setUserProfile((p) => ({ ...p, skillLevel: e.target.value as any }))}
                className="w-full bg-transparent text-[14px] text-[#222222] focus:outline-none cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mountaineer">Mountaineer</option>
              </select>
            </div>

            {/* Circular Rausch Search Orb */}
            <div className="pr-2">
              <button
                type="submit"
                className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer"
                title="Search Trails"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>

        {/* Category Strip Bar (Airbnb Icon Strip) */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-none flex-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 pb-2.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer group ${
                    isActive
                      ? 'border-[#222222] text-[#222222]'
                      : 'border-transparent text-[#6a6a6a] hover:text-[#222222] hover:border-[#ebebeb]'
                  }`}
                >
                  <Icon className={`w-6 h-6 transition-transform group-hover:scale-105 ${isActive ? 'text-[#222222]' : 'text-[#6a6a6a]'}`} />
                  <span className="text-[12px] font-medium tracking-tight">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick AI Launch button */}
          <div className="hidden sm:block shrink-0 pl-4 border-l border-[#ebebeb]">
            <button
              onClick={() => setActiveTab('ai-guide')}
              className="px-4 py-2.5 rounded-xl border border-[#dddddd] hover:border-[#222222] text-[13px] font-semibold text-[#222222] flex items-center gap-2 transition-all shadow-sm hover:shadow-airbnb bg-white"
            >
              <Sparkles className="w-4 h-4 text-[#ff385c]" />
              <span>AI Packing Adviser</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
