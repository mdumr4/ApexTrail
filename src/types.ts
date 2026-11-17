export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mountaineer';
export type FitnessLevel = 'Casual Walker' | 'Active / Moderate' | 'Marathon / High Endurance' | 'Peak Athlete';
export type DifficultyLevel = 'Beginner' | 'Moderate' | 'Challenging' | 'Strenuous' | 'Extreme';

export interface ItineraryDay {
  day: number;
  title: string;
  distanceKm: number;
  ascentM: number;
  descentM: number;
  campName: string;
  description: string;
  altitudeM: number;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  label?: string;
  isCamp?: boolean;
  isSummit?: boolean;
}

export interface DepartureDate {
  id: string;
  startDate: string;
  endDate: string;
  slotsTotal: number;
  slotsBooked: number;
  leadGuide: string;
  priceModifier: number; // e.g. 1.0 standard, 1.15 peak season
}

export interface MountainTrail {
  id: string;
  name: string;
  region: string;
  country: string;
  highestPointMeters: number;
  distanceKm: number;
  durationDays: number;
  difficulty: DifficultyLevel;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
    elevation: number;
  };
  elevationProfile: ElevationPoint[];
  itinerary: ItineraryDay[];
  availableDates: DepartureDate[];
  requiredGear: string[];
  includedServices: string[];
  excludedServices: string[];
  imageUrl: string;
  gallery: string[];
  isActive: boolean;
  isFeatured: boolean;
  bestMonths: string[];
}

export interface GearAddon {
  id: string;
  name: string;
  pricePerDay: number;
  description: string;
  selected: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  trailId: string;
  trailName: string;
  departureDateId: string;
  startDate: string;
  endDate: string;
  leadTrekker: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    skillLevel: SkillLevel;
    fitnessLevel: FitnessLevel;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
  partySize: number;
  selectedAddons: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  basePrice: number;
  addonsTotal: number;
  permitFee: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Wire / Expedition Transfer';
  createdAt: string;
  notes?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  essential: boolean;
  description: string;
  weightEstimateGrams: number;
  skillTip: string;
  packed: boolean;
}

export interface PackingCategory {
  category: string;
  items: PackingItem[];
}

export interface DailyPacingPlan {
  dayNumber: number;
  title: string;
  targetHikingHours: number;
  recommendedAscentCapM?: number;
  restStops?: string;
  turnaroundTime?: string;
  keyHazardWarning: string;
}

export interface ExpeditionPlan {
  trailName: string;
  skillLevel: SkillLevel;
  fitnessLevel: FitnessLevel;
  season: string;
  executiveSummary: string;
  skillFitAssessment: {
    suitabilityLevel: string;
    recommendedPaceMultiplier: number;
    cautionNotes: string[];
  };
  routeStrategy: {
    acclimatizationProtocol: string;
    emergencyContingency: string;
    dailyPacing: DailyPacingPlan[];
  };
  packingList: PackingCategory[];
  criticalSafetyRules: string[];
  weatherCopingStrategy: string;
  generatedAt: string;
}

export interface MountainWeather {
  summitElevation: number;
  stationElevation: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  weatherCode: number;
  precipitation: number;
  safetyLevel: 'Good' | 'Moderate' | 'Severe Caution';
  safetyNotice: string;
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
    precipitationProbability: number[];
    windGustsMax: number[];
    uvIndexMax: number[];
  } | null;
}
