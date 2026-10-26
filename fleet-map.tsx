"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Vehicle, Alert } from "@/lib/types";

interface FleetMapProps {
  vehicles: Vehicle[];
  alerts: Alert[];
  onSelectVehicle?: (id: string) => void;
  selectedVehicleId?: string | null;
  height?: number;
}

// Simple equirectangular projection for East Africa bounding box
const BOUNDS = { minLat: -5, maxLat: 1, minLng: 33, maxLng: 42 };

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * w;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return { x, y };
}

// Major cities for map reference
const CITIES = [
  { name: "Nairobi", lat: -1.2864, lng: 36.8172 },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682 },
  { name: "Kampala", lat: 0.3476, lng: 32.5825 },
  { name: "Arusha", lat: -3.3869, lng: 36.683 },
  { name: "Nakuru", lat: -0.3031, lng: 36.08 },
  { name: "Eldoret", lat: 0.5143, lng: 35.2698 },
  { name: "Voi", lat: -3.4, lng: 38.55 },
  { name: "Malindi", lat: -3.14, lng: 40.12 },
  { name: "Garissa", lat: -0.45, lng: 39.65 },
  { name: "Kisumu", lat: -0.09, lng: 34.77 },
];

// Major routes (polyline)
const ROUTES: { name: string; path: { lat: number; lng: number }[]; color: string }[] = [
  {
    name: "Northern Corridor",
    path: [
      { lat: -4.0435, lng: 39.6682 }, // Mombasa
      { lat: -3.4, lng: 38.55 }, // Voi
      { lat: -2.0, lng: 37.3 },
      { lat: -1.45, lng: 36.97 },
      { lat: -1.2864, lng: 36.8172 }, // Nairobi
      { lat: -0.3031, lng: 36.08 }, // Nakuru
      { lat: 0.5143, lng: 35.2698 }, // Eldoret
      { lat: 0.3476, lng: 32.5825 }, // Kampala
    ],
    color: "#10b981",
  },
  {
    name: "Nairobi–Arusha",
    path: [
      { lat: -1.2864, lng: 36.8172 },
      { lat: -2.0, lng: 36.7 },
      { lat: -2.85, lng: 36.72 },
      { lat: -3.3869, lng: 36.683 },
    ],
    color: "#f59e0b",
  },
];

export function FleetMap({ vehicles, alerts, onSelectVehicle, selectedVehicleId, height = 460 }: FleetMapProps) {
  const W = 800;
  const H = 460;

  const vehiclePositions = useMemo(
    () =>
      vehicles.map((v) => ({
        vehicle: v,
        ...project(v.telemetry.lat, v.telemetry.lng, W, H),
      })),
    [vehicles],
  );

  const cityPositions = useMemo(
    () => CITIES.map((c) => ({ ...c, ...project(c.lat, c.lng, W, H) })),
    [],
  );

  const routePaths = useMemo(
    () =>
      ROUTES.map((r) => ({
        ...r,
        d: r.path.map((p, i) => `${i === 0 ? "M" : "L"} ${project(p.lat, p.lng, W, H).x} ${project(p.lat, p.lng, W, H).y}`).join(" "),
      })),
    [],
  );

  const alertMarkers = useMemo(
    () =>
      alerts
        .filter((a) => a.location && !a.acknowledged && (a.severity === "critical" || a.severity === "emergency"))
        .map((a) => ({ alert: a, ...project(a.location!.lat, a.location!.lng, W, H) }))
        .slice(0, 10),
    [alerts],
  );

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Water / land background gradient */}
        <defs>
          <linearGradient id="land" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#86efac" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <radialGradient id="alertGlow">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#land)" />
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Lake Victoria (rough ellipse) */}
        <ellipse cx={project(-0.5, 33.8, W, H).x} cy={project(-0.5, 33.8, W, H).y} rx={45} ry={55} fill="#7dd3fc" opacity="0.6" />
        {/* Indian Ocean hint */}
        <path d={`M ${W} 0 L ${W} ${H} L ${project(-5, 42, W, H).x} ${project(-5, 42, W, H).y} L ${project(-3, 41.5, W, H).x} ${project(-3, 41.5, W, H).y} Z`} fill="#7dd3fc" opacity="0.4" />

        {/* Routes */}
        {routePaths.map((r) => (
          <g key={r.name}>
            <path d={r.d} fill="none" stroke={r.color} strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
            <path d={r.d} fill="none" stroke={r.color} strokeWidth="1" opacity="0.9" />
          </g>
        ))}

        {/* Cities */}
        {cityPositions.map((c) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="3" fill="#1e293b" />
            <text x={c.x + 6} y={c.y + 4} className="fill-slate-700 dark:fill-slate-300" style={{ fontSize: 11, fontWeight: 600 }}>
              {c.name}
            </text>
          </g>
        ))}

        {/* Active alert glows */}
        {alertMarkers.map((m) => (
          <g key={m.alert.id}>
            <circle cx={m.x} cy={m.y} r="22" fill="url(#alertGlow)" />
            <circle cx={m.x} cy={m.y} r="5" fill="#ef4444">
              <animate attributeName="r" values="5;9;5" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Vehicles */}
        {vehiclePositions.map((p) => {
          const v = p.vehicle;
          const isOverloaded = v.telemetry.loadWeight > v.maxLoadKg;
          const isRolloverRisk = v.telemetry.tilt > 5;
          const isMoving = v.status === "in_transit";
          const isSelected = selectedVehicleId === v.id;
          const color = isOverloaded || isRolloverRisk ? "#ef4444" : isMoving ? "#10b981" : "#94a3b8";

          return (
            <g
              key={v.id}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer"
              onClick={() => onSelectVehicle?.(v.id)}
            >
              {/* Selection ring */}
              {isSelected && <circle r="14" fill="none" stroke="#0ea5e9" strokeWidth="2" />}
              {/* Vehicle marker */}
              <circle r="7" fill={color} stroke="white" strokeWidth="2" />
              <text x="0" y="3" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill="white">
                {v.plate.slice(-3)}
              </text>
              {/* Heading indicator */}
              {isMoving && (
                <line
                  x1="0"
                  y1="0"
                  x2={Math.sin((v.telemetry.heading * Math.PI) / 180) * 12}
                  y2={-Math.cos((v.telemetry.heading * Math.PI) / 180) * 12}
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 dark:bg-slate-900/95 p-3 text-[11px] shadow-md backdrop-blur">
        <div className="font-semibold mb-1.5">Fleet Status</div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Moving
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Idle / Stopped
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" /> Critical Alert
          </span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-3 right-3 rounded-lg bg-white/95 dark:bg-slate-900/95 p-3 text-[11px] shadow-md backdrop-blur">
        <div className="text-muted-foreground mb-1">Active Vehicles</div>
        <div className="text-lg font-bold">{vehicles.filter((v) => v.status === "in_transit").length} / {vehicles.length}</div>
      </div>
    </div>
  );
}
