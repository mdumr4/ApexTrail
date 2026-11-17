import React, { createContext, useContext, useState, useEffect } from 'react';
import { MountainTrail, Booking, SkillLevel, FitnessLevel, MountainWeather } from '../types';
import { INITIAL_TRAILS, INITIAL_BOOKINGS } from '../data/mockTrails';

interface TrekContextType {
  trails: MountainTrail[];
  bookings: Booking[];
  activeTrail: MountainTrail | null;
  setActiveTrail: (trail: MountainTrail | null) => void;
  bookingModalTrail: MountainTrail | null;
  setBookingModalTrail: (trail: MountainTrail | null) => void;
  prefilledAiTrail: MountainTrail | null;
  setPrefilledAiTrail: (trail: MountainTrail | null) => void;
  activeTab: 'explore' | 'ai-guide' | 'weather' | 'my-bookings' | 'admin';
  setActiveTab: (tab: 'explore' | 'ai-guide' | 'weather' | 'my-bookings' | 'admin') => void;
  userProfile: {
    skillLevel: SkillLevel;
    fitnessLevel: FitnessLevel;
    fullName: string;
    email: string;
  };
  setUserProfile: React.Dispatch<
    React.SetStateAction<{
      skillLevel: SkillLevel;
      fitnessLevel: FitnessLevel;
      fullName: string;
      email: string;
    }>
  >;
  isAdmin: boolean;
  adminLogin: (pass: string) => boolean;
  adminLogout: () => void;
  addTrail: (trailData: Omit<MountainTrail, 'id'>) => MountainTrail;
  updateTrail: (id: string, updates: Partial<MountainTrail>) => void;
  deleteTrail: (id: string) => void;
  toggleTrailStatus: (id: string) => void;
  addBooking: (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  resetDataToDefaults: () => void;
  getMountainWeather: (trail: MountainTrail) => Promise<MountainWeather | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  wishlist: string[];
  toggleWishlist: (trailId: string) => void;
}

const TrekContext = createContext<TrekContextType | undefined>(undefined);

const TRAILS_STORAGE_KEY = 'apextrail_mountain_trails_v1';
const BOOKINGS_STORAGE_KEY = 'apextrail_bookings_v1';
const PROFILE_STORAGE_KEY = 'apextrail_user_profile_v1';
const ADMIN_STORAGE_KEY = 'apextrail_admin_auth_v1';

export const TrekProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trails, setTrails] = useState<MountainTrail[]>(() => {
    try {
      const saved = localStorage.getItem(TRAILS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading trails from localStorage:', e);
    }
    return INITIAL_TRAILS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading bookings from localStorage:', e);
    }
    return INITIAL_BOOKINGS;
  });

  const [userProfile, setUserProfile] = useState<{
    skillLevel: SkillLevel;
    fitnessLevel: FitnessLevel;
    fullName: string;
    email: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading profile from localStorage:', e);
    }
    return {
      skillLevel: 'Intermediate',
      fitnessLevel: 'Active / Moderate',
      fullName: 'Alex Vance',
      email: 'alex.vance@expedition.co',
    };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [activeTrail, setActiveTrail] = useState<MountainTrail | null>(null);
  const [bookingModalTrail, setBookingModalTrail] = useState<MountainTrail | null>(null);
  const [prefilledAiTrail, setPrefilledAiTrail] = useState<MountainTrail | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'ai-guide' | 'weather' | 'my-bookings' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All Trails');
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apextrail_wishlist_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return ['trail-tmb-alps', 'trail-inca-peru'];
  });

  const toggleWishlist = (trailId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(trailId) ? prev.filter((id) => id !== trailId) : [...prev, trailId];
      try {
        localStorage.setItem('apextrail_wishlist_v1', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Weather cache
  const [weatherCache, setWeatherCache] = useState<Record<string, { data: MountainWeather; timestamp: number }>>({});

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TRAILS_STORAGE_KEY, JSON.stringify(trails));
    } catch (e) {
      console.error('Failed to save trails:', e);
    }
  }, [trails]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdmin));
    } catch (e) {
      console.error('Failed to save admin state:', e);
    }
  }, [isAdmin]);

  const adminLogin = (pass: string) => {
    // Admin password check: 'summit2026' or 'admin'
    if (pass.trim().toLowerCase() === 'summit2026' || pass.trim().toLowerCase() === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
  };

  const addTrail = (trailData: Omit<MountainTrail, 'id'>) => {
    const newId = `trail-custom-${Date.now()}`;
    const newTrail: MountainTrail = {
      ...trailData,
      id: newId,
    };
    setTrails((prev) => [newTrail, ...prev]);
    return newTrail;
  };

  const updateTrail = (id: string, updates: Partial<MountainTrail>) => {
    setTrails((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    if (activeTrail && activeTrail.id === id) {
      setActiveTrail((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteTrail = (id: string) => {
    setTrails((prev) => prev.filter((t) => t.id !== id));
    if (activeTrail && activeTrail.id === id) {
      setActiveTrail(null);
    }
  };

  const toggleTrailStatus = (id: string) => {
    setTrails((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => {
    const newId = `book-${Date.now()}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `APEX-${new Date().getFullYear()}-${randomSuffix}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      bookingNumber,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Also decrement slots in that trail's departure
    setTrails((prev) =>
      prev.map((trail) => {
        if (trail.id === bookingData.trailId) {
          const updatedDates = trail.availableDates.map((d) => {
            if (d.id === bookingData.departureDateId) {
              return {
                ...d,
                slotsBooked: Math.min(d.slotsTotal, d.slotsBooked + bookingData.partySize),
              };
            }
            return d;
          });
          return { ...trail, availableDates: updatedDates };
        }
        return trail;
      })
    );

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const resetDataToDefaults = () => {
    setTrails(INITIAL_TRAILS);
    setBookings(INITIAL_BOOKINGS);
    localStorage.removeItem(TRAILS_STORAGE_KEY);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  };

  const getMountainWeather = async (trail: MountainTrail): Promise<MountainWeather | null> => {
    const cacheKey = `${trail.id}-${trail.coordinates.lat.toFixed(3)}`;
    const cached = weatherCache[cacheKey];
    // Cache for 15 minutes
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
      return cached.data;
    }

    try {
      const res = await fetch(
        `/api/weather/mountain?lat=${trail.coordinates.lat}&lng=${trail.coordinates.lng}&elevation=${trail.highestPointMeters}`
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const json = await res.json();
      if (json.success && json.data) {
        setWeatherCache((prev) => ({
          ...prev,
          [cacheKey]: { data: json.data, timestamp: Date.now() },
        }));
        return json.data;
      }
    } catch (e) {
      console.warn('Backend weather failed, fetching Open-Meteo direct fallback:', e);
      // Direct client fallback to Open-Meteo
      try {
        const directRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${trail.coordinates.lat}&longitude=${trail.coordinates.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max,uv_index_max&timezone=auto`
        );
        const wData = await directRes.json();
        const lapse = ((trail.highestPointMeters - (wData.elevation || 1500)) / 1000) * 6.5;
        const curTemp = Math.round((wData.current.temperature_2m - lapse) * 10) / 10;
        const feelsLike = Math.round((wData.current.apparent_temperature - lapse) * 10) / 10;
        const gusts = wData.current.wind_gusts_10m || 0;

        const fallbackWeather: MountainWeather = {
          summitElevation: trail.highestPointMeters,
          stationElevation: wData.elevation || 1500,
          temperature: curTemp,
          feelsLike,
          humidity: wData.current.relative_humidity_2m,
          windSpeed: wData.current.wind_speed_10m,
          windGusts: gusts,
          weatherCode: wData.current.weather_code,
          precipitation: wData.current.precipitation,
          safetyLevel: gusts > 50 || curTemp < -12 ? 'Severe Caution' : gusts > 30 ? 'Moderate' : 'Good',
          safetyNotice: gusts > 50 ? 'Alpine gale risk. Crampons & wind shell required.' : 'Stable alpine window.',
          daily: {
            time: wData.daily.time,
            temperatureMax: wData.daily.temperature_2m_max.map((t: number) => Math.round((t - lapse) * 10) / 10),
            temperatureMin: wData.daily.temperature_2m_min.map((t: number) => Math.round((t - lapse) * 10) / 10),
            weatherCode: wData.daily.weather_code,
            precipitationProbability: wData.daily.precipitation_probability_max,
            windGustsMax: wData.daily.wind_gusts_10m_max,
            uvIndexMax: wData.daily.uv_index_max,
          },
        };
        return fallbackWeather;
      } catch (err) {
        console.error('All weather fetches failed:', err);
      }
    }
    return null;
  };

  return (
    <TrekContext.Provider
      value={{
        trails,
        bookings,
        activeTrail,
        setActiveTrail,
        bookingModalTrail,
        setBookingModalTrail,
        prefilledAiTrail,
        setPrefilledAiTrail,
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        isAdmin,
        adminLogin,
        adminLogout,
        addTrail,
        updateTrail,
        deleteTrail,
        toggleTrailStatus,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        resetDataToDefaults,
        getMountainWeather,
        searchQuery,
        setSearchQuery,
        selectedDifficulty,
        setSelectedDifficulty,
        activeCategory,
        setActiveCategory,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </TrekContext.Provider>
  );
};

export const useTrek = () => {
  const context = useContext(TrekContext);
  if (!context) {
    throw new Error('useTrek must be used within a TrekProvider');
  }
  return context;
};
