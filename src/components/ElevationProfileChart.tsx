import React, { useState } from 'react';
import { ElevationPoint } from '../types';

interface Props {
  points: ElevationPoint[];
  highestPoint: number;
  trailName: string;
}

export const ElevationProfileChart: React.FC<Props> = ({ points, highestPoint, trailName }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ElevationPoint | null>(null);

  if (!points || points.length === 0) {
    return (
      <div className="p-4 text-center text-[#6a6a6a] text-[13px]">
        Elevation data profile currently unavailable for this route.
      </div>
    );
  }

  // Dimensions
  const width = 720;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const minElevation = Math.max(0, Math.min(...points.map((p) => p.elevationM)) - 200);
  const maxElevation = Math.max(highestPoint, ...points.map((p) => p.elevationM)) + 150;
  const maxDistance = Math.max(...points.map((p) => p.distanceKm));

  const scaleX = (dist: number) => {
    return paddingX + (dist / (maxDistance || 1)) * (width - paddingX * 2);
  };

  const scaleY = (elev: number) => {
    return (
      height -
      paddingY -
      ((elev - minElevation) / (maxElevation - minElevation || 1)) * (height - paddingY * 2)
    );
  };

  // Build SVG path
  const linePoints = points.map((p) => `${scaleX(p.distanceKm)},${scaleY(p.elevationM)}`);
  const pathD = `M ${linePoints.join(' L ')}`;
  const areaD = `${pathD} L ${scaleX(maxDistance)},${height - paddingY} L ${scaleX(0)},${height - paddingY} Z`;

  // Horizontal grid steps
  const elevRange = maxElevation - minElevation;
  const step = Math.round(elevRange / 4 / 200) * 200 || 500;
  const yTicks: number[] = [];
  for (let e = Math.ceil(minElevation / step) * step; e <= maxElevation; e += step) {
    yTicks.push(e);
  }

  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#dddddd] text-[#222222] relative">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-[13px] font-semibold tracking-wide text-[#222222] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff385c]"></span>
            Topographic Elevation Profile
          </h4>
          <p className="text-[12px] text-[#6a6a6a]">
            {trailName} &bull; Peak: <strong className="text-[#222222]">{highestPoint.toLocaleString()}m</strong>
          </p>
        </div>

        {hoveredPoint ? (
          <div className="bg-[#ffffff] border border-[#222222] px-3 py-1 rounded-lg text-[12px] shadow-sm flex items-center gap-3">
            <span className="text-[#ff385c] font-semibold">{hoveredPoint.label || 'Waypoint'}</span>
            <span className="text-[#6a6a6a]">Dist: {hoveredPoint.distanceKm} km</span>
            <span className="text-[#222222] font-bold">{hoveredPoint.elevationM.toLocaleString()} m</span>
          </div>
        ) : (
          <div className="text-[12px] text-[#6a6a6a] hidden sm:block">Hover along route to inspect altitude</div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff385c" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#ff385c" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((y) => (
            <g key={y}>
              <line
                x1={paddingX}
                y1={scaleY(y)}
                x2={width - paddingX}
                y2={scaleY(y)}
                stroke="#ebebeb"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={scaleY(y) + 4}
                textAnchor="end"
                fontSize="9"
                fill="#929292"
                fontFamily="sans-serif"
              >
                {y}m
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#elevationGrad)" />

          {/* Profile line */}
          <path
            d={pathD}
            fill="none"
            stroke="#ff385c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X axis base */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#dddddd"
            strokeWidth="1.5"
          />

          {/* Waypoints */}
          {points.map((p, idx) => {
            const cx = scaleX(p.distanceKm);
            const cy = scaleY(p.elevationM);
            const isSummit = p.isSummit || p.elevationM === highestPoint;
            const isCamp = p.isCamp;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={height - paddingY}
                  stroke={isSummit ? '#ff385c' : '#dddddd'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                <circle
                  cx={cx}
                  cy={cy}
                  r={isSummit ? 6 : isCamp ? 4.5 : 3.5}
                  fill={isSummit ? '#ff385c' : isCamp ? '#222222' : '#ffffff'}
                  stroke={isSummit ? '#ffffff' : '#222222'}
                  strokeWidth="2"
                />

                {(isSummit || isCamp || idx === 0 || idx === points.length - 1) && (
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fontSize={isSummit ? '10' : '8.5'}
                    fontWeight={isSummit ? 'bold' : 'normal'}
                    fill="#222222"
                    className="pointer-events-none select-none"
                  >
                    {p.label || `${p.elevationM}m`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[12px] text-[#6a6a6a] mt-2 px-1 border-t border-[#ebebeb] pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff385c]"></span> Summit Pass
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#222222]"></span> Refuge Camp
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#222222] bg-[#ffffff]"></span> Waypoint
          </span>
        </div>
        <div>Total Distance: {maxDistance} km</div>
      </div>
    </div>
  );
};
