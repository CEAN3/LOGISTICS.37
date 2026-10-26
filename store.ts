"use client";

import { create } from "zustand";
import type {
  Vehicle, Driver, Trailer, Shipment, Warehouse, InventoryItem,
  StocktakeRecord, FinanceTransaction, Alert, Integration, ModuleKey, Telemetry,
} from "./types";
import {
  VEHICLES as INITIAL_VEHICLES,
  DRIVERS as INITIAL_DRIVERS,
  TRAILERS as INITIAL_TRAILERS,
  SHIPMENTS as INITIAL_SHIPMENTS,
  WAREHOUSES as INITIAL_WAREHOUSES,
  INVENTORY as INITIAL_INVENTORY,
  STOCKTAKES as INITIAL_STOCKTAKES,
  FINANCE_TXNS as INITIAL_FINANCE,
  INTEGRATIONS as INITIAL_INTEGRATIONS,
  INITIAL_ALERTS,
} from "./mock-data";

interface LogisticsState {
  // Module navigation
  activeModule: ModuleKey;
  setActiveModule: (m: ModuleKey) => void;

  // Data collections
  vehicles: Vehicle[];
  drivers: Driver[];
  trailers: Trailer[];
  shipments: Shipment[];
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  stocktakes: StocktakeRecord[];
  financeTxns: FinanceTransaction[];
  alerts: Alert[];
  integrations: Integration[];

  // Real-time
  liveTrackingEnabled: boolean;
  toggleLiveTracking: () => void;
  updateVehicleTelemetry: (vehicleId: string, telemetry: Partial<Telemetry>) => void;
  updateDriverBiometrics: (driverId: string, updates: Partial<Driver>) => void;
  pushAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAcknowledged: () => void;

  // Driver SOS panic button
  triggerDriverSOS: (driverId: string) => void;

  // Selected entity (for detail panels)
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  activeModule: "dashboard",
  setActiveModule: (m) => set({ activeModule: m }),

  vehicles: INITIAL_VEHICLES,
  drivers: INITIAL_DRIVERS,
  trailers: INITIAL_TRAILERS,
  shipments: INITIAL_SHIPMENTS,
  warehouses: INITIAL_WAREHOUSES,
  inventory: INITIAL_INVENTORY,
  stocktakes: INITIAL_STOCKTAKES,
  financeTxns: INITIAL_FINANCE,
  alerts: INITIAL_ALERTS,
  integrations: INITIAL_INTEGRATIONS,

  liveTrackingEnabled: true,
  toggleLiveTracking: () => set((s) => ({ liveTrackingEnabled: !s.liveTrackingEnabled })),

  updateVehicleTelemetry: (vehicleId, telemetry) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, telemetry: { ...v.telemetry, ...telemetry, timestamp: Date.now() } } : v,
      ),
    })),

  updateDriverBiometrics: (driverId, updates) =>
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === driverId ? { ...d, ...updates } : d)),
    })),

  pushAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 60),
    })),

  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
    })),

  clearAcknowledged: () =>
    set((state) => ({
      alerts: state.alerts.filter((a) => !a.acknowledged),
    })),

  triggerDriverSOS: (driverId) => {
    const driver = get().drivers.find((d) => d.id === driverId);
    if (!driver) return;
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === driverId ? { ...d, panicButton: true, status: "emergency" } : d)),
    }));
    get().pushAlert({
      id: `AL-SOS-${Date.now()}`,
      type: "driver_sos",
      severity: "emergency",
      title: `DRIVER SOS — ${driver.name}`,
      message: `Panic button activated by ${driver.name}. Location shared with control room and nearest rapid-response partner. Vehicle ${driver.vehicleId} halted via speed governor.`,
      driverId,
      vehicleId: driver.vehicleId ?? undefined,
      timestamp: Date.now(),
      acknowledged: false,
      location: driver.vehicleId
        ? { lat: get().vehicles.find((v) => v.id === driver.vehicleId)?.telemetry.lat ?? 0, lng: get().vehicles.find((v) => v.id === driver.vehicleId)?.telemetry.lng ?? 0, place: "Live GPS" }
        : undefined,
    });
  },

  selectedVehicleId: null,
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
}));
