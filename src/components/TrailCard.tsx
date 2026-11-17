import React, { useState } from 'react';
import { MountainTrail } from '../types';
import { useTrek } from '../context/TrekContext';
import {
  Heart,
  Star,
  Mountain,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface Props {
  trail: MountainTrail;
}

export const TrailCard: React.FC<Props> = ({ trail }) => {
  const {
    setActiveTrail,
    setBookingModalTrail,
    setPrefilledAiTrail,
    setActiveTab,
    wishlist,
    toggleWishlist,
  } = useTrek();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const isSaved = wishlist.includes(trail.id);
  const photos = trail.gallery && trail.gallery.length > 0 ? trail.gallery : [trail.imageUrl];

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(trail.id);
  };

  const nearestDate = trail.availableDates[0];

  return (
    <div
      onClick={() => setActiveTrail(trail)}
      className="group cursor-pointer flex flex-col space-y-3 select-none"
    >
      {/* Photo Plate (Aspect Ratio Square with ~14px rounded clipping) */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f2f2f2]">
        <img
          src={photos[activePhotoIdx] || trail.imageUrl}
          alt={trail.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Floating "Guest favorite" Pill Badge Top-Left */}
        {trail.rating >= 4.9 && (
          <div className="absolute top-3 left-3 bg-[#ffffff] text-[#222222] text-[12px] font-semibold px-3 py-1 rounded-full shadow-airbnb border border-[#ebebeb]/80 flex items-center gap-1.5 pointer-events-none">
            <span>Guest favorite</span>
          </div>
        )}

        {/* Wishlist Heart Button Top-Right (Airbnb Canonical Heart) */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-90 transition-transform cursor-pointer"
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-6 h-6 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
              isSaved
                ? 'fill-[#ff385c] text-[#ff385c]'
                : 'fill-black/20 text-white'
            }`}
          />
        </button>

        {/* Bottom Elevation / Difficulty Tag */}
        <div className="absolute bottom-3 left-3 bg-[#222222]/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full pointer-events-none">
          {trail.highestPointMeters.toLocaleString()}m &bull; {trail.difficulty}
        </div>
      </div>

      {/* Meta Block Beneath Image */}
      <div className="space-y-0.5 text-[15px]">
        {/* Row 1: Title and Rating */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold text-[#222222] truncate group-hover:text-[#ff385c] transition-colors">
            {trail.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 font-medium text-[#222222] text-[14px]">
            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
            <span>{trail.rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Row 2: Region & Distance */}
        <div className="text-[14px] text-[#6a6a6a] truncate">
          {trail.region}, {trail.country} &bull; {trail.distanceKm} km
        </div>

        {/* Row 3: Duration / Next departure */}
        <div className="text-[14px] text-[#6a6a6a]">
          {trail.durationDays} days &bull; {nearestDate ? nearestDate.startDate : 'Flexible dates'}
        </div>

        {/* Row 4: Price & Actions */}
        <div className="pt-1 flex items-baseline justify-between">
          <div className="text-[15px] text-[#222222]">
            <span className="font-semibold">${trail.priceUsd.toLocaleString()}</span>
            <span className="text-[#6a6a6a] font-normal text-[14px]"> / trekker</span>
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrefilledAiTrail(trail);
                setActiveTab('ai-guide');
              }}
              title="Tailor AI packing list for this trail"
              className="p-1.5 rounded-full hover:bg-[#f7f7f7] text-[#6a6a6a] hover:text-[#ff385c] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBookingModalTrail(trail);
              }}
              className="text-[13px] font-semibold text-[#ff385c] hover:underline px-1"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
