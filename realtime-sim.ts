"use client";

import { useEffect, useRef } from "react";
import { useLogisticsStore } from "./store";
import type { Alert } from "./types";

// Real-time simulator — animates vehicle telemetry, driver fatigue, fuel burn, etc.
// Emits new alerts when thresholds are crossed.

let alertCounter = 0;

export function useRealtimeSimulation() {
  const enabled = useLogisticsStore((s) => s.liveTrackingEnabled);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabled) return;

    const tick = setInterval(() => {
      if (!enabledRef.current) return;

      const store = useLogisticsStore.getState();
      const activeVehicles = store.vehicles.filter(
        (v) => v.status === "in_transit",
      );

      activeVehicles.forEach((v) => {
        // Advance along heading with slight jitter
        const jitterLat = (Math.random() - 0.5) * 0.01;
        const jitterLng = (Math.random() - 0.5) * 0.01;
        const newLat = v.telemetry.lat + jitterLat;
        const newLng = v.telemetry.lng + jitterLng;

        // Speed fluctuation ±5
        const speedChange = (Math.random() - 0.5) * 6;
        const newSpeed = Math.max(0, Math.min(105, v.telemetry.speed + speedChange));

        // Fuel slowly drops
        const fuelDrop = newSpeed > 0 ? 0.05 + (newSpeed / 100) * 0.08 : 0;

        // Cornering/tilt — simulate curve events
        const corneringEvent = Math.random() < 0.08;
        const newTilt = corneringEvent ? Math.min(7.5, v.telemetry.tilt + Math.random() * 4) : Math.max(0, v.telemetry.tilt - 0.6);
        const newGForce = corneringEvent ? Math.min(0.7, v.telemetry.gForce + Math.random() * 0.25) : Math.max(0.05, v.telemetry.gForce - 0.05);

        // Engine temp fluctuates
        const tempChange = (Math.random() - 0.5) * 1.2;
        const newEngineTemp = Math.max(75, Math.min(105, v.telemetry.engineTemp + tempChange));

        // Driver updates
        if (v.driverId) {
          const driver = store.drivers.find((d) => d.id === v.driverId);
          if (driver) {
            const fatigueInc = newSpeed > 0 ? 0.4 + Math.random() * 0.6 : 0;
            const newFatigue = Math.min(95, driver.fatigue + fatigueInc);
            const hrChange = (Math.random() - 0.5) * 4;
            const newHR = Math.max(55, Math.min(120, driver.heartRate + hrChange));
            const newHours = driver.hoursDriving + 1 / 3600;
            const newHoursSinceBreak = driver.hoursSinceBreak + 1 / 3600;

            store.updateDriverBiometrics(v.driverId!, {
              fatigue: Math.round(newFatigue),
              heartRate: Math.round(newHR),
              hoursDriving: newHours,
              hoursSinceBreak: newHoursSinceBreak,
              cabinTemp: v.telemetry.cabinTemp + (Math.random() - 0.5) * 0.4,
            });

            // Fatigue alert
            if (newFatigue > 70 && driver.fatigue <= 70 && Math.random() < 0.6) {
              store.pushAlert({
                id: `AL-RT-${++alertCounter}`,
                type: "driver_fatigue",
                severity: "warning",
                title: `Driver fatigue critical — ${driver.name}`,
                message: `Fatigue index ${Math.round(newFatigue)}%. Mandatory 30-minute rest advised within 30 minutes. Cabin biometric monitoring active.`,
                driverId: driver.id,
                vehicleId: v.id,
                timestamp: Date.now(),
                acknowledged: false,
                location: { lat: newLat, lng: newLng, place: v.depot },
              });
            }
          }
        }

        // Rollover alert
        if (newTilt > 5.0 && v.telemetry.tilt <= 5.0) {
          store.pushAlert({
            id: `AL-RT-${++alertCounter}`,
            type: "rollover_risk",
            severity: "critical",
            title: "Rollover risk — cornering tilt",
            message: `${v.plate} trailer tilt ${newTilt.toFixed(1)}°. Reduce speed to 45 km/h on upcoming curves. Stability control engaged.`,
            vehicleId: v.id,
            driverId: v.driverId ?? undefined,
            timestamp: Date.now(),
            acknowledged: false,
            location: { lat: newLat, lng: newLng, place: v.depot },
          });
        }

        store.updateVehicleTelemetry(v.id, {
          lat: newLat,
          lng: newLng,
          speed: Math.round(newSpeed * 10) / 10,
          fuelLevel: Math.max(0, v.telemetry.fuelLevel - fuelDrop),
          engineTemp: Math.round(newEngineTemp * 10) / 10,
          tilt: Math.round(newTilt * 10) / 10,
          gForce: Math.round(newGForce * 100) / 100,
          odometer: v.telemetry.odometer + (newSpeed / 3600),
        });
      });

      // Occasionally simulate a weighbridge ping or unauthorized boarding
      if (Math.random() < 0.04) {
        const v = store.vehicles[Math.floor(Math.random() * store.vehicles.length)];
        if (v && v.status === "in_transit") {
          const overloadDelta = Math.random() < 0.5 ? Math.random() * 2500 : 0;
          if (overloadDelta > 1500) {
            store.pushAlert({
              id: `AL-RT-${++alertCounter}`,
              type: "overload",
              severity: "critical",
              title: "Weighbridge overload detected",
              message: `${v.plate} gross weight ${(v.telemetry.loadWeight + overloadDelta).toFixed(0)} kg. Legal limit ${v.maxLoadKg} kg. Risk of citation on next weighbridge stop.`,
              vehicleId: v.id,
              driverId: v.driverId ?? undefined,
              timestamp: Date.now(),
              acknowledged: false,
            });
          }
        }
      }
    }, 2000);

    return () => clearInterval(tick);
  }, [enabled]);
}
