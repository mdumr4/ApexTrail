import React, { useState } from 'react';
import { useTrek } from '../context/TrekContext';
import { TrailCard } from './TrailCard';
import {
  SlidersHorizontal,
  Mountain,
  RotateCcw,
} from 'lucide-react';

export const ExploreTrails: React.FC = () => {
  const {
    trails,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    activeCategory,
  } = useTrek();

  const [sortBy, setSortBy] = useState<'recommended' | 'elevation' | 'duration' | 'price'>('recommended');

  const filteredTrails = trails
    .filter((trail) => {
      if (!trail.isActive) return false;

      // Category filter
      if (activeCategory === 'Himalayas' && !trail.region.includes('Himalayas')) return false;
      if (activeCategory === 'Alps' && !trail.region.includes('Alps')) return false;
      if (activeCategory === 'Andes' && !trail.country.includes('Peru') && !trail.country.includes('Chile')) return false;
      if (activeCategory === 'High Altitude' && trail.highestPointMeters < 4500) return false;
      if (activeCategory === 'Moderate' && trail.difficulty !== 'Moderate' && trail.difficulty !== 'Beginner') return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = trail.name.toLowerCase().includes(q);
        const matchesRegion = trail.region.toLowerCase().includes(q);
        const matchesCountry = trail.country.toLowerCase().includes(q);
        const matchesDesc = trail.description.toLowerCase().includes(q);
        if (!matchesName && !matchesRegion && !matchesCountry && !matchesDesc) return false;
      }

      // Difficulty match
      if (selectedDifficulty !== 'All' && trail.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'elevation') return b.highestPointMeters - a.highestPointMeters;
      if (sortBy === 'duration') return b.durationDays - a.durationDays;
      if (sortBy === 'price') return a.priceUsd - b.priceUsd;
      return (b.rating || 5) - (a.rating || 5);
    });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#ffffff]">
      {/* Subheader Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebebeb] pb-4">
        <div>
          <h2 className="text-[22px] font-semibold text-[#222222]">
            {activeCategory === 'All Trails' ? 'World-Class Mountain Expeditions' : `${activeCategory} Expeditions`}
          </h2>
          <p className="text-[14px] text-[#6a6a6a]">
            {filteredTrails.length} verified routes &bull; Real-time summit telemetry &bull; Certified mountain leaders
          </p>
        </div>

        {/* Sort & Quick Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[14px] text-[#222222]">
            <span className="text-[#6a6a6a]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium border border-[#dddddd] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer text-[13px]"
            >
              <option value="recommended">Rating &amp; Popularity</option>
              <option value="elevation">Highest Peak (Elevation)</option>
              <option value="duration">Expedition Length</option>
              <option value="price">Price (Lowest first)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-Column Photo-First Card Grid */}
      {filteredTrails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredTrails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#f7f7f7] border border-[#dddddd] text-[#222222] flex items-center justify-center mx-auto">
            <Mountain className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#222222]">
            No exact matches
          </h3>
          <p className="text-[14px] text-[#6a6a6a]">
            Try changing or clearing some of your filters or search keywords to find mountain trails.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
            }}
            className="px-5 py-2.5 rounded-lg border border-[#222222] text-[#222222] font-semibold text-[14px] hover:bg-[#f7f7f7] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
