// Comprehensive logistics domain types

export type VehicleStatus = "in_transit" | "loading" | "unloading" | "idle" | "maintenance" | "offline";
export type VehicleType = "tractor" | "rigid" | "box" | "flatbed" | "reefer" | "tanker";
export type DriverStatus = "on_duty" | "off_duty" | "resting" | "on_break" | "emergency";
export type ShipmentStatus =
  | "draft"
  | "scheduled"
  | "dispatched"
  | "in_transit"
  | "at_warehouse"
  | "delivered"
  | "delayed"
  | "cancelled";
export type AlertSeverity = "info" | "warning" | "critical" | "emergency";
export type AlertType =
  | "overload"
  | "rollover_risk"
  | "unauthorized_passenger"
  | "unauthorized_cargo"
  | "driver_sos"
  | "driver_fatigue"
  | "geofence_breach"
  | "maintenance_due"
  | "tire_pressure"
  | "temperature"
  | "speeding"
  | "stocktake_discrepancy"
  | "invoice_overdue";
export type FinanceType = "income" | "expense";
export type FinanceCategory =
  | "freight_revenue"
  | "fuel"
  | "maintenance"
  | "salaries"
  | "tolls"
  | "insurance"
  | "warehouse_lease"
  | "utilities"
  | "customs_duties"
  | "permits"
  | "other";

export interface Telemetry {
  lat: number;
  lng: number;
  speed: number; // km/h
  heading: number; // degrees
  fuelLevel: number; // percentage 0-100
  odometer: number; // km
  engineTemp: number; // °C
  tirePressure: number[]; // psi per tire
  gForce: number; // lateral g
  tilt: number; // degrees — for rollover risk
  loadWeight: number; // kg
  cabinTemp: number; // °C
  cabinHumidity: number; // %
  driverHeartRate: number; // bpm
  driverFatigue: number; // 0-100
  timestamp: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  maxLoadKg: number;
  maxVolumeM3: number;
  status: VehicleStatus;
  driverId: string | null;
  trailerId: string | null;
  currentShipmentId: string | null;
  depot: string;
  telemetry: Telemetry;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelEfficiency: number; // L/100km
  installedSensors: string[];
}

export interface Trailer {
  id: string;
  plate: string;
  type: "curtain_sider" | "box_trailer" | "flatbed" | "tanker" | "reefer";
  maxLoadKg: number;
  attachedVehicleId: string | null;
  status: "attached" | "detached" | "loading" | "maintenance";
  currentLoadKg: number;
  axleCount: number;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  status: DriverStatus;
  vehicleId: string | null;
  hoursDriving: number;
  hoursSinceBreak: number;
  comfortScore: number; // 0-100
  safetyScore: number; // 0-100
  fatigue: number; // 0-100
  heartRate: number;
  cabinTemp: number;
  panicButton: boolean;
  lastBreak: string;
  hireDate: string;
  licenseExpiry: string;
  photo?: string;
}

export interface CargoItem {
  id: string;
  description: string;
  weightKg: number;
  volumeM3: number;
  declared: boolean; // whether it's authorized on the manifest
  hazardous: boolean;
  unitCount: number;
}

export interface Shipment {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  vehicleId: string | null;
  driverId: string | null;
  cargo: CargoItem[];
  totalWeightKg: number;
  totalVolumeM3: number;
  pickupDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  freightCharge: number;
  distanceKm: number;
  progress: number; // 0-100
  customsCleared: boolean;
  insuranceValue: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacityM3: number;
  usedM3: number;
  utilization: number; // percentage
  zones: number;
  dockCount: number;
  manager: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  warehouseId: string;
  quantity: number;
  unit: string;
  expectedQuantity: number; // for stocktake comparison
  lastCount: string;
  reorderLevel: number;
  unitValue: number;
  category: string;
}

export interface StocktakeRecord {
  id: string;
  warehouseId: string;
  auditor: string;
  date: string;
  itemsScanned: number;
  discrepancies: number;
  status: "in_progress" | "completed" | "scheduled";
  notes?: string;
}

export interface FinanceTransaction {
  id: string;
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
  relatedShipmentId?: string;
  relatedVehicleId?: string;
  status: "pending" | "cleared" | "overdue";
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  vehicleId?: string;
  driverId?: string;
  shipmentId?: string;
  timestamp: number;
  acknowledged: boolean;
  location?: { lat: number; lng: number; place: string };
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  category: "customs" | "fuel" | "weighbridge" | "payment" | "fuel_station" | "toll" | "insurance" | "erp" | "tax_authority";
  endpoint: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  lastSync: string;
  description: string;
  requestsToday: number;
  uptime: number; // percentage
}

export interface RoutePoint {
  lat: number;
  lng: number;
  label: string;
  time: string;
}

export type ModuleKey =
  | "dashboard"
  | "tracking"
  | "fleet"
  | "tms"
  | "wms"
  | "finance"
  | "safety"
  | "drivers"
  | "integrations";
