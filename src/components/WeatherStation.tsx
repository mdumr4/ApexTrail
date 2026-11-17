import React, { useState, useEffect } from 'react';
import { useTrek } from '../context/TrekContext';
import { MountainTrail, MountainWeather } from '../types';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Mountain,
  RefreshCw,
  Sun,
  CloudRain,
  Snowflake,
} from 'lucide-react';

export const WeatherStation: React.FC = () => {
  const { trails, getMountainWeather } = useTrek();

  const [selectedTrailId, setSelectedTrailId] = useState<string>(trails[0]?.id || '');
  const [weather, setWeather] = useState<MountainWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const currentTrail: MountainTrail | undefined =
    trails.find((t) => t.id === selectedTrailId) || trails[0];

  useEffect(() => {
    if (!currentTrail) return;
    let isCurrent = true;
    setLoading(true);

    getMountainWeather(currentTrail).then((res) => {
      if (isCurrent) {
        setWeather(res);
        setLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedTrailId]);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-500" />;
    if (code >= 1 && code <= 3) return <CloudSun className="w-5 h-5 text-sky-500" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-teal-500" />;
    if (code >= 71) return <Snowflake className="w-5 h-5 text-sky-300" />;
    return <CloudSun className="w-5 h-5 text-sky-500" />;
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#ffffff]">
      {/* Title */}
      <div className="border-b border-[#ebebeb] pb-6">
        <h1 className="text-[26px] sm:text-[32px] font-semibold text-[#222222] tracking-tight">
          Summit Weather Radar
        </h1>
        <p className="mt-1 text-[15px] text-[#6a6a6a]">
          High-altitude physical lapse rate model (-6.5°C per 1,000m) adjusted to the exact summit elevation of each trail.
        </p>

        {/* Trail Selector Pill Row */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {trails.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrailId(t.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border ${
                selectedTrailId === t.id
                  ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                  : 'border-[#dddddd] bg-[#ffffff] text-[#222222] hover:border-[#222222]'
              }`}
            >
              {t.name} ({t.highestPointMeters}m)
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#6a6a6a]">
          <RefreshCw className="w-7 h-7 text-[#222222] animate-spin mx-auto mb-3" />
          <p className="text-[14px]">Fetching real-time alpine telemetry from Open-Meteo...</p>
        </div>
      ) : weather && currentTrail ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Weather Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-bold text-[#ff385c] uppercase tracking-wider">
                  {currentTrail.region}, {currentTrail.country}
                </div>
                <h2 className="text-[24px] font-semibold text-[#222222]">
                  {currentTrail.name}
                </h2>
                <div className="text-[13px] text-[#6a6a6a]">
                  Peak Altitude: <strong className="text-[#222222]">{weather.summitElevation.toLocaleString()}m</strong> &bull; Weather station: {weather.stationElevation}m
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border ${
                  weather.safetyLevel === 'Good'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                Summit Condition: {weather.safetyLevel}
              </span>
            </div>

            {/* Big Temperature Hero */}
            <div className="flex items-baseline gap-4 py-2">
              <div className="text-[56px] sm:text-[68px] font-bold text-[#222222] tracking-tight font-mono leading-none">
                {weather.temperature}°C
              </div>
              <div>
                <div className="text-[16px] font-medium text-[#222222]">
                  Feels like {weather.feelsLike}°C
                </div>
                <div className="text-[13px] text-[#6a6a6a]">
                  Wind chill &amp; thin air evaporative rate
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#ebebeb]">
              <div className="p-4 rounded-xl bg-[#f7f7f7] border border-[#ebebeb]">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6a6a6a] mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#222222]" />
                  <span>Ridge Gusts</span>
                </div>
                <div className="text-[18px] font-bold text-[#222222] font-mono">
                  {weather.windGusts} km/h
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f7f7] border border-[#ebebeb]">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6a6a6a] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#222222]" />
                  <span>Precipitation</span>
                </div>
                <div className="text-[18px] font-bold text-[#222222] font-mono">
                  {weather.precipitation} mm
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f7f7] border border-[#ebebeb]">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6a6a6a] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#222222]" />
                  <span>Humidity</span>
                </div>
                <div className="text-[18px] font-bold text-[#222222] font-mono">
                  {weather.humidity}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f7f7] border border-[#ebebeb]">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6a6a6a] mb-1">
                  <Mountain className="w-3.5 h-3.5 text-[#222222]" />
                  <span>Lapse Offset</span>
                </div>
                <div className="text-[18px] font-bold text-[#222222] font-mono">
                  -{(
                    ((weather.summitElevation - weather.stationElevation) / 1000) *
                    6.5
                  ).toFixed(1)}
                  °C
                </div>
              </div>
            </div>

            {/* Advisory */}
            <div className="p-4 rounded-xl bg-[#f7f7f7] text-[14px] text-[#3f3f3f] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#222222] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#222222]">Alpine Safety Advisory: </strong>
                {weather.safetyNotice}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          {weather.daily && (
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-[#222222]">
                7-Day High Altitude Forecast
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weather.daily.time.slice(0, 7).map((dayStr, idx) => {
                  const dateObj = new Date(dayStr);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateShort = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const tMax = weather.daily?.temperatureMax[idx];
                  const tMin = weather.daily?.temperatureMin[idx];
                  const rainChance = weather.daily?.precipitationProbability[idx];

                  return (
                    <div
                      key={dayStr}
                      className="p-4 rounded-xl border border-[#dddddd] bg-[#ffffff] text-center space-y-2 hover:border-[#222222] transition-colors"
                    >
                      <div className="text-[13px] font-semibold text-[#222222]">{dayName}</div>
                      <div className="text-[11px] text-[#6a6a6a]">{dateShort}</div>

                      <div className="flex justify-center py-1">
                        {getWeatherIcon(weather.daily?.weatherCode[idx] || 0)}
                      </div>

                      <div className="text-[18px] font-bold text-[#222222] font-mono">
                        {tMax}°
                      </div>
                      <div className="text-[12px] text-[#6a6a6a] font-mono">
                        Min {tMin}°C
                      </div>

                      <div className="pt-2 border-t border-[#ebebeb] text-[11px] text-[#6a6a6a]">
                        Rain: {rainChance}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
