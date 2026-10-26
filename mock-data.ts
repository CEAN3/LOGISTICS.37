import type {
  Vehicle,
  Driver,
  Trailer,
  Shipment,
  Warehouse,
  InventoryItem,
  StocktakeRecord,
  FinanceTransaction,
  Alert,
  Integration,
} from "./types";

// Realistic logistics data — East Africa context (Nairobi hub)
const NAIROBI = { lat: -1.2864, lng: 36.8172 };
const MOMBASA = { lat: -4.0435, lng: 39.6682 };
const KAMPALA = { lat: 0.3476, lng: 32.5825 };
const ARUSHA = { lat: -3.3869, lng: 36.683 };
const NAKURU = { lat: -0.3031, lng: 36.08 };
const ELDORET = { lat: 0.5143, lng: 35.2698 };

export const TRAILERS: Trailer[] = [
  { id: "TR-001", plate: "ZNK 447X", type: "curtain_sider", maxLoadKg: 28000, attachedVehicleId: "VH-001", status: "attached", currentLoadKg: 24500, axleCount: 3 },
  { id: "TR-002", plate: "ZNK 448X", type: "box_trailer", maxLoadKg: 30000, attachedVehicleId: "VH-002", status: "attached", currentLoadKg: 28900, axleCount: 3 },
  { id: "TR-003", plate: "ZNK 449X", type: "flatbed", maxLoadKg: 32000, attachedVehicleId: "VH-003", status: "attached", currentLoadKg: 31500, axleCount: 3 },
  { id: "TR-004", plate: "ZNK 450X", type: "reefer", maxLoadKg: 26000, attachedVehicleId: "VH-004", status: "attached", currentLoadKg: 22100, axleCount: 3 },
  { id: "TR-005", plate: "ZNK 451X", type: "tanker", maxLoadKg: 28000, attachedVehicleId: null, status: "detached", currentLoadKg: 0, axleCount: 3 },
  { id: "TR-006", plate: "ZNK 452X", type: "box_trailer", maxLoadKg: 30000, attachedVehicleId: "VH-006", status: "loading", currentLoadKg: 8200, axleCount: 3 },
  { id: "TR-007", plate: "ZNK 453X", type: "curtain_sider", maxLoadKg: 28000, attachedVehicleId: null, status: "maintenance", currentLoadKg: 0, axleCount: 3 },
];

export const DRIVERS: Driver[] = [
  {
    id: "DR-001", name: "James Mwangi", license: "KE-DL-449210", phone: "+254 712 449210",
    status: "on_duty", vehicleId: "VH-001", hoursDriving: 4.2, hoursSinceBreak: 2.1,
    comfortScore: 82, safetyScore: 95, fatigue: 28, heartRate: 72, cabinTemp: 23, panicButton: false,
    lastBreak: "2026-07-31T08:30:00Z", hireDate: "2022-03-15", licenseExpiry: "2028-09-30",
  },
  {
    id: "DR-002", name: "Peter Otieno", license: "KE-DL-551203", phone: "+254 722 551203",
    status: "on_duty", vehicleId: "VH-002", hoursDriving: 6.8, hoursSinceBreak: 3.4,
    comfortScore: 64, safetyScore: 88, fatigue: 62, heartRate: 88, cabinTemp: 27, panicButton: false,
    lastBreak: "2026-07-31T06:00:00Z", hireDate: "2021-07-22", licenseExpiry: "2027-12-31",
  },
  {
    id: "DR-003", name: "Samuel Kamau", license: "KE-DL-663414", phone: "+254 733 663414",
    status: "on_duty", vehicleId: "VH-003", hoursDriving: 2.1, hoursSinceBreak: 1.5,
    comfortScore: 91, safetyScore: 97, fatigue: 15, heartRate: 68, cabinTemp: 22, panicButton: false,
    lastBreak: "2026-07-31T09:45:00Z", hireDate: "2023-01-10", licenseExpiry: "2029-04-15",
  },
  {
    id: "DR-004", name: "Daniel Kiprop", license: "KE-DL-775516", phone: "+254 711 775516",
    status: "on_duty", vehicleId: "VH-004", hoursDriving: 5.5, hoursSinceBreak: 2.8,
    comfortScore: 75, safetyScore: 92, fatigue: 45, heartRate: 78, cabinTemp: 24, panicButton: false,
    lastBreak: "2026-07-31T07:15:00Z", hireDate: "2020-11-08", licenseExpiry: "2026-12-31",
  },
  {
    id: "DR-005", name: "Joseph Mutua", license: "KE-DL-886718", phone: "+254 712 886718",
    status: "on_break", vehicleId: "VH-005", hoursDriving: 3.2, hoursSinceBreak: 0.3,
    comfortScore: 88, safetyScore: 94, fatigue: 22, heartRate: 70, cabinTemp: 23, panicButton: false,
    lastBreak: "2026-07-31T10:30:00Z", hireDate: "2022-09-14", licenseExpiry: "2028-06-30",
  },
  {
    id: "DR-006", name: "Brian Ochieng", license: "KE-DL-997920", phone: "+254 722 997920",
    status: "on_duty", vehicleId: "VH-006", hoursDriving: 1.4, hoursSinceBreak: 1.4,
    comfortScore: 86, safetyScore: 90, fatigue: 18, heartRate: 74, cabinTemp: 23, panicButton: false,
    lastBreak: "2026-07-31T09:20:00Z", hireDate: "2023-05-22", licenseExpiry: "2029-08-31",
  },
  {
    id: "DR-007", name: "Eric Kiptoo", license: "KE-DL-108122", phone: "+254 733 108122",
    status: "off_duty", vehicleId: null, hoursDriving: 0, hoursSinceBreak: 0,
    comfortScore: 0, safetyScore: 96, fatigue: 0, heartRate: 0, cabinTemp: 0, panicButton: false,
    lastBreak: "2026-07-30T18:00:00Z", hireDate: "2021-02-11", licenseExpiry: "2027-03-31",
  },
  {
    id: "DR-008", name: "Francis Maina", license: "KE-DL-219224", phone: "+254 711 219224",
    status: "off_duty", vehicleId: null, hoursDriving: 0, hoursSinceBreak: 0,
    comfortScore: 0, safetyScore: 89, fatigue: 0, heartRate: 0, cabinTemp: 0, panicButton: false,
    lastBreak: "2026-07-30T17:30:00Z", hireDate: "2019-08-19", licenseExpiry: "2026-11-30",
  },
];

const now = Date.now();

function makeTelemetry(lat: number, lng: number, speed: number, fuel: number, loadKg: number, fatigue: number, heartRate: number, tilt: number, gForce: number, cabinTemp: number) {
  return {
    lat, lng, speed, heading: Math.floor(Math.random() * 360),
    fuelLevel: fuel, odometer: 145000 + Math.floor(Math.random() * 80000),
    engineTemp: 82 + Math.floor(Math.random() * 12),
    tirePressure: [108, 110, 107, 112, 109, 108],
    gForce, tilt, loadWeight: loadKg,
    cabinTemp, cabinHumidity: 45 + Math.floor(Math.random() * 15),
    driverHeartRate: heartRate, driverFatigue: fatigue,
    timestamp: now,
  };
}

export const VEHICLES: Vehicle[] = [
  {
    id: "VH-001", plate: "KDG 887X", type: "tractor", maxLoadKg: 28000, maxVolumeM3: 82,
    status: "in_transit", driverId: "DR-001", trailerId: "TR-001", currentShipmentId: "SH-1001",
    depot: "Nairobi DC", telemetry: makeTelemetry(-1.1, 36.95, 78, 64, 24500, 28, 72, 2.1, 0.18, 23),
    lastMaintenance: "2026-06-15", nextMaintenance: "2026-09-15", fuelEfficiency: 32,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Tire pressure TPM", "Cabin biometric", "Camera AI", "Fuel flow"],
  },
  {
    id: "VH-002", plate: "KDG 888X", type: "tractor", maxLoadKg: 30000, maxVolumeM3: 88,
    status: "in_transit", driverId: "DR-002", trailerId: "TR-002", currentShipmentId: "SH-1002",
    depot: "Nairobi DC", telemetry: makeTelemetry(-2.4, 37.5, 64, 38, 28900, 62, 88, 5.8, 0.42, 27),
    lastMaintenance: "2026-05-20", nextMaintenance: "2026-08-20", fuelEfficiency: 35,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Tire pressure TPM", "Cabin biometric", "Camera AI"],
  },
  {
    id: "VH-003", plate: "KDG 889X", type: "flatbed", maxLoadKg: 32000, maxVolumeM3: 0,
    status: "in_transit", driverId: "DR-003", trailerId: "TR-003", currentShipmentId: "SH-1003",
    depot: "Mombasa Port", telemetry: makeTelemetry(-3.2, 38.9, 82, 71, 31500, 15, 68, 1.5, 0.12, 22),
    lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", fuelEfficiency: 38,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Tire pressure TPM", "Camera AI"],
  },
  {
    id: "VH-004", plate: "KDG 890X", type: "reefer", maxLoadKg: 26000, maxVolumeM3: 76,
    status: "in_transit", driverId: "DR-004", trailerId: "TR-004", currentShipmentId: "SH-1004",
    depot: "Nairobi DC", telemetry: makeTelemetry(-0.8, 35.6, 70, 52, 22100, 45, 78, 3.2, 0.28, 24),
    lastMaintenance: "2026-04-25", nextMaintenance: "2026-07-25", fuelEfficiency: 41,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Tire pressure TPM", "Cabin biometric", "Reefer temp", "Camera AI"],
  },
  {
    id: "VH-005", plate: "KDG 891X", type: "tractor", maxLoadKg: 28000, maxVolumeM3: 82,
    status: "idle", driverId: "DR-005", trailerId: "TR-005", currentShipmentId: null,
    depot: "Nakuru Yard", telemetry: makeTelemetry(NAKURU.lat, NAKURU.lng, 0, 90, 0, 22, 70, 0, 0, 23),
    lastMaintenance: "2026-06-30", nextMaintenance: "2026-09-30", fuelEfficiency: 33,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Tire pressure TPM", "Cabin biometric"],
  },
  {
    id: "VH-006", plate: "KDG 892X", type: "box", maxLoadKg: 24000, maxVolumeM3: 70,
    status: "loading", driverId: "DR-006", trailerId: "TR-006", currentShipmentId: "SH-1005",
    depot: "Nairobi DC", telemetry: makeTelemetry(NAIROBI.lat, NAIROBI.lng, 0, 85, 8200, 18, 74, 0, 0, 23),
    lastMaintenance: "2026-07-12", nextMaintenance: "2026-10-12", fuelEfficiency: 36,
    installedSensors: ["GPS", "Weight axle 1-2", "Accelerometer", "Tire pressure TPM", "Camera AI"],
  },
  {
    id: "VH-007", plate: "KDG 893X", type: "tractor", maxLoadKg: 28000, maxVolumeM3: 82,
    status: "maintenance", driverId: null, trailerId: null, currentShipmentId: null,
    depot: "Nairobi Workshop", telemetry: makeTelemetry(NAIROBI.lat + 0.02, NAIROBI.lng - 0.01, 0, 0, 0, 0, 0, 0, 0, 0),
    lastMaintenance: "2026-07-15", nextMaintenance: "2026-08-15", fuelEfficiency: 34,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer"],
  },
  {
    id: "VH-008", plate: "KDG 894X", type: "tanker", maxLoadKg: 28000, maxVolumeM3: 30,
    status: "offline", driverId: null, trailerId: null, currentShipmentId: null,
    depot: "Eldoret Yard", telemetry: makeTelemetry(ELDORET.lat, ELDORET.lng, 0, 0, 0, 0, 0, 0, 0, 0),
    lastMaintenance: "2026-03-10", nextMaintenance: "2026-09-10", fuelEfficiency: 42,
    installedSensors: ["GPS", "Weight axle 1-3", "Accelerometer", "Pressure sensor"],
  },
];

export const SHIPMENTS: Shipment[] = [
  {
    id: "SH-1001", reference: "NBO-MBA-0731-01", customerId: "CU-001", customerName: "East African Distributors Ltd",
    origin: "Nairobi DC", destination: "Mombasa Port", status: "in_transit",
    vehicleId: "VH-001", driverId: "DR-001",
    cargo: [
      { id: "CG-01", description: "Cement bags 50kg", weightKg: 18000, volumeM3: 24, declared: true, hazardous: false, unitCount: 360 },
      { id: "CG-02", description: "Steel rods", weightKg: 6500, volumeM3: 8, declared: true, hazardous: false, unitCount: 130 },
    ],
    totalWeightKg: 24500, totalVolumeM3: 32, pickupDate: "2026-07-31T05:30:00Z",
    estimatedDelivery: "2026-07-31T19:00:00Z", freightCharge: 185000, distanceKm: 484, progress: 42,
    customsCleared: true, insuranceValue: 4200000,
  },
  {
    id: "SH-1002", reference: "NBO-KLA-0731-02", customerId: "CU-002", customerName: "TransAfrican Logistics",
    origin: "Nairobi DC", destination: "Kampala Warehouse", status: "in_transit",
    vehicleId: "VH-002", driverId: "DR-002",
    cargo: [
      { id: "CG-03", description: "Electronics — TVs", weightKg: 12500, volumeM3: 48, declared: true, hazardous: false, unitCount: 250 },
      { id: "CG-04", description: "Beverages — pallets", weightKg: 16400, volumeM3: 22, declared: true, hazardous: false, unitCount: 32 },
    ],
    totalWeightKg: 28900, totalVolumeM3: 70, pickupDate: "2026-07-31T03:00:00Z",
    estimatedDelivery: "2026-08-01T18:00:00Z", freightCharge: 312000, distanceKm: 920, progress: 28,
    customsCleared: true, insuranceValue: 8800000,
  },
  {
    id: "SH-1003", reference: "MBA-ARS-0731-03", customerId: "CU-003", customerName: "Mombasa Cement Plc",
    origin: "Mombasa Port", destination: "Arusha Construction Site", status: "in_transit",
    vehicleId: "VH-003", driverId: "DR-003",
    cargo: [
      { id: "CG-05", description: "Construction machinery", weightKg: 31500, volumeM3: 0, declared: true, hazardous: false, unitCount: 4 },
    ],
    totalWeightKg: 31500, totalVolumeM3: 0, pickupDate: "2026-07-31T04:15:00Z",
    estimatedDelivery: "2026-08-01T08:00:00Z", freightCharge: 278000, distanceKm: 410, progress: 65,
    customsCleared: true, insuranceValue: 24500000,
  },
  {
    id: "SH-1004", reference: "NBO-NKR-0731-04", customerId: "CU-004", customerName: "Naivasha Fresh Foods",
    origin: "Nairobi DC", destination: "Nakuru Cold Storage", status: "in_transit",
    vehicleId: "VH-004", driverId: "DR-004",
    cargo: [
      { id: "CG-06", description: "Frozen produce", weightKg: 22100, volumeM3: 56, declared: true, hazardous: false, unitCount: 180 },
    ],
    totalWeightKg: 22100, totalVolumeM3: 56, pickupDate: "2026-07-31T06:00:00Z",
    estimatedDelivery: "2026-07-31T14:00:00Z", freightCharge: 95000, distanceKm: 158, progress: 78,
    customsCleared: true, insuranceValue: 3400000,
  },
  {
    id: "SH-1005", reference: "NBO-NKR-0731-05", customerId: "CU-005", customerName: "Nakuru Agro Mills",
    origin: "Nairobi DC", destination: "Nakuru Distribution", status: "scheduled",
    vehicleId: "VH-006", driverId: "DR-006",
    cargo: [
      { id: "CG-07", description: "Fertilizer bags", weightKg: 8200, volumeM3: 14, declared: true, hazardous: true, unitCount: 164 },
    ],
    totalWeightKg: 8200, totalVolumeM3: 14, pickupDate: "2026-07-31T12:00:00Z",
    estimatedDelivery: "2026-07-31T20:00:00Z", freightCharge: 65000, distanceKm: 158, progress: 0,
    customsCleared: true, insuranceValue: 1200000,
  },
  {
    id: "SH-1006", reference: "MBA-NBO-0730-06", customerId: "CU-001", customerName: "East African Distributors Ltd",
    origin: "Mombasa Port", destination: "Nairobi DC", status: "delivered",
    vehicleId: "VH-003", driverId: "DR-003",
    cargo: [
      { id: "CG-08", description: "Imported vehicle parts", weightKg: 19400, volumeM3: 38, declared: true, hazardous: false, unitCount: 95 },
    ],
    totalWeightKg: 19400, totalVolumeM3: 38, pickupDate: "2026-07-30T04:00:00Z",
    estimatedDelivery: "2026-07-30T18:00:00Z", actualDelivery: "2026-07-30T17:42:00Z", freightCharge: 165000, distanceKm: 484, progress: 100,
    customsCleared: true, insuranceValue: 5600000,
  },
  {
    id: "SH-1007", reference: "NBO-ELD-0730-07", customerId: "CU-006", customerName: "Eldoret Textiles",
    origin: "Nairobi DC", destination: "Eldoret Factory", status: "delayed",
    vehicleId: "VH-008", driverId: "DR-008",
    cargo: [
      { id: "CG-09", description: "Cotton bales", weightKg: 17600, volumeM3: 60, declared: true, hazardous: false, unitCount: 88 },
    ],
    totalWeightKg: 17600, totalVolumeM3: 60, pickupDate: "2026-07-30T08:00:00Z",
    estimatedDelivery: "2026-07-31T02:00:00Z", freightCharge: 145000, distanceKm: 312, progress: 88,
    customsCleared: false, insuranceValue: 2400000,
  },
  {
    id: "SH-1008", reference: "NBO-ARS-0731-08", customerId: "CU-007", customerName: "Arusha Beverages Co",
    origin: "Nairobi DC", destination: "Arusha Distribution Center", status: "draft",
    vehicleId: null, driverId: null,
    cargo: [
      { id: "CG-10", description: "Soda bottles — pallets", weightKg: 14500, volumeM3: 28, declared: true, hazardous: false, unitCount: 24 },
      { id: "CG-11", description: "Undeclared electronics", weightKg: 1800, volumeM3: 6, declared: false, hazardous: false, unitCount: 12 },
    ],
    totalWeightKg: 16300, totalVolumeM3: 34, pickupDate: "2026-08-01T08:00:00Z",
    estimatedDelivery: "2026-08-01T22:00:00Z", freightCharge: 188000, distanceKm: 268, progress: 0,
    customsCleared: false, insuranceValue: 2100000,
  },
];

export const WAREHOUSES: Warehouse[] = [
  { id: "WH-001", name: "Nairobi Distribution Center", location: "Industrial Area, Nairobi", capacityM3: 12000, usedM3: 8640, utilization: 72, zones: 8, dockCount: 12, manager: "Grace Wanjiru" },
  { id: "WH-002", name: "Mombasa Port Storage", location: "Mombasa Port, Kilindini", capacityM3: 18000, usedM3: 13520, utilization: 75, zones: 10, dockCount: 16, manager: "Hassan Ali" },
  { id: "WH-003", name: "Nakuru Cold Storage", location: "Nakuru Industrial Estate", capacityM3: 6000, usedM3: 4250, utilization: 71, zones: 4, dockCount: 6, manager: "Esther Wambui" },
  { id: "WH-004", name: "Eldoret Yard", location: "Eldoret Town", capacityM3: 4500, usedM3: 1980, utilization: 44, zones: 3, dockCount: 4, manager: "David Kiptanui" },
  { id: "WH-005", name: "Arusha Distribution Center", location: "Arusha Industrial Area", capacityM3: 5200, usedM3: 4865, utilization: 94, zones: 4, dockCount: 5, manager: "Joseph Massawe" },
];

export const INVENTORY: InventoryItem[] = [
  { id: "IV-001", sku: "CMT-50KG", name: "Cement 50kg bags", warehouseId: "WH-001", quantity: 1240, unit: "bags", expectedQuantity: 1240, lastCount: "2026-07-29", reorderLevel: 500, unitValue: 850, category: "Construction" },
  { id: "IV-002", sku: "STL-ROD-12", name: "Steel rods 12mm", warehouseId: "WH-001", quantity: 480, unit: "pieces", expectedQuantity: 500, lastCount: "2026-07-29", reorderLevel: 200, unitValue: 1200, category: "Construction" },
  { id: "IV-003", sku: "ELEC-TV-55", name: "55-inch LED TV", warehouseId: "WH-001", quantity: 320, unit: "units", expectedQuantity: 320, lastCount: "2026-07-30", reorderLevel: 100, unitValue: 45000, category: "Electronics" },
  { id: "IV-004", sku: "BEV-SODA-2L", name: "Soda 2L — crate", warehouseId: "WH-001", quantity: 86, unit: "crates", expectedQuantity: 90, lastCount: "2026-07-30", reorderLevel: 50, unitValue: 1800, category: "Beverages" },
  { id: "IV-005", sku: "FRZ-VEG-10", name: "Frozen vegetables 10kg", warehouseId: "WH-003", quantity: 240, unit: "boxes", expectedQuantity: 240, lastCount: "2026-07-30", reorderLevel: 100, unitValue: 3200, category: "Cold Chain" },
  { id: "IV-006", sku: "FRZ-MEAT-20", name: "Frozen beef 20kg", warehouseId: "WH-003", quantity: 95, unit: "boxes", expectedQuantity: 110, lastCount: "2026-07-30", reorderLevel: 50, unitValue: 8500, category: "Cold Chain" },
  { id: "IV-007", sku: "COT-BAL-200", name: "Cotton bales 200kg", warehouseId: "WH-004", quantity: 64, unit: "bales", expectedQuantity: 64, lastCount: "2026-07-28", reorderLevel: 30, unitValue: 28000, category: "Textiles" },
  { id: "IV-008", sku: "FRT-BAG-50", name: "Fertilizer 50kg bags", warehouseId: "WH-001", quantity: 540, unit: "bags", expectedQuantity: 540, lastCount: "2026-07-29", reorderLevel: 200, unitValue: 4200, category: "Agriculture" },
  { id: "IV-009", sku: "MCH-PTY-100", name: "Machinery parts", warehouseId: "WH-002", quantity: 28, unit: "units", expectedQuantity: 30, lastCount: "2026-07-30", reorderLevel: 10, unitValue: 85000, category: "Industrial" },
  { id: "IV-010", sku: "OIL-LUB-20", name: "Lubricant drums 20L", warehouseId: "WH-002", quantity: 145, unit: "drums", expectedQuantity: 145, lastCount: "2026-07-30", reorderLevel: 60, unitValue: 6800, category: "Industrial" },
  { id: "IV-011", sku: "FRZ-FISH-15", name: "Frozen fish 15kg", warehouseId: "WH-003", quantity: 12, unit: "boxes", expectedQuantity: 60, lastCount: "2026-07-30", reorderLevel: 25, unitValue: 5400, category: "Cold Chain" },
  { id: "IV-012", sku: "TXT-FAB-100", name: "Fabric rolls 100m", warehouseId: "WH-004", quantity: 88, unit: "rolls", expectedQuantity: 88, lastCount: "2026-07-28", reorderLevel: 40, unitValue: 14500, category: "Textiles" },
  { id: "IV-013", sku: "BEV-WTR-1L", name: "Water bottles 1L — crate", warehouseId: "WH-005", quantity: 410, unit: "crates", expectedQuantity: 410, lastCount: "2026-07-30", reorderLevel: 200, unitValue: 950, category: "Beverages" },
  { id: "IV-014", sku: "AGR-SEED-25", name: "Seed bags 25kg", warehouseId: "WH-005", quantity: 36, unit: "bags", expectedQuantity: 50, lastCount: "2026-07-30", reorderLevel: 25, unitValue: 3800, category: "Agriculture" },
];

export const STOCKTAKES: StocktakeRecord[] = [
  { id: "ST-001", warehouseId: "WH-001", auditor: "Grace Wanjiru", date: "2026-07-29", itemsScanned: 1240, discrepancies: 12, status: "completed", notes: "12 items short — investigation ongoing" },
  { id: "ST-002", warehouseId: "WH-002", auditor: "Hassan Ali", date: "2026-07-30", itemsScanned: 985, discrepancies: 4, status: "completed", notes: "Minor discrepancies — within tolerance" },
  { id: "ST-003", warehouseId: "WH-003", auditor: "Esther Wambui", date: "2026-07-31", itemsScanned: 347, discrepancies: 0, status: "in_progress" },
  { id: "ST-004", warehouseId: "WH-004", auditor: "David Kiptanui", date: "2026-07-28", itemsScanned: 152, discrepancies: 0, status: "completed" },
  { id: "ST-005", warehouseId: "WH-005", auditor: "Joseph Massawe", date: "2026-08-02", itemsScanned: 0, discrepancies: 0, status: "scheduled" },
];

export const FINANCE_TXNS: FinanceTransaction[] = [
  { id: "FT-001", type: "income", category: "freight_revenue", amount: 185000, currency: "KES", date: "2026-07-31", description: "Shipment NBO-MBA-0731-01 freight", relatedShipmentId: "SH-1001", status: "cleared" },
  { id: "FT-002", type: "income", category: "freight_revenue", amount: 312000, currency: "KES", date: "2026-07-31", description: "Shipment NBO-KLA-0731-02 freight", relatedShipmentId: "SH-1002", status: "pending" },
  { id: "FT-003", type: "income", category: "freight_revenue", amount: 165000, currency: "KES", date: "2026-07-30", description: "Shipment MBA-NBO-0730-06 freight", relatedShipmentId: "SH-1006", status: "cleared" },
  { id: "FT-004", type: "expense", category: "fuel", amount: 84500, currency: "KES", date: "2026-07-31", description: "Diesel refuel — VH-001, VH-002, VH-004", status: "cleared" },
  { id: "FT-005", type: "expense", category: "tolls", amount: 12500, currency: "KES", date: "2026-07-31", description: "Nairobi–Mombasa tolls", status: "cleared" },
  { id: "FT-006", type: "expense", category: "salaries", amount: 480000, currency: "KES", date: "2026-07-31", description: "Driver wages — week 31", status: "cleared" },
  { id: "FT-007", type: "expense", category: "maintenance", amount: 67000, currency: "KES", date: "2026-07-30", description: "VH-007 brake service", relatedVehicleId: "VH-007", status: "cleared" },
  { id: "FT-008", type: "expense", category: "warehouse_lease", amount: 220000, currency: "KES", date: "2026-07-30", description: "Nairobi DC monthly lease", status: "cleared" },
  { id: "FT-009", type: "expense", category: "customs_duties", amount: 98000, currency: "KES", date: "2026-07-30", description: "Import duties — Shipment SH-1006", relatedShipmentId: "SH-1006", status: "cleared" },
  { id: "FT-010", type: "expense", category: "insurance", amount: 145000, currency: "KES", date: "2026-07-30", description: "Fleet insurance premium — August", status: "cleared" },
  { id: "FT-011", type: "income", category: "freight_revenue", amount: 95000, currency: "KES", date: "2026-07-31", description: "Shipment NBO-NKR-0731-04 freight", relatedShipmentId: "SH-1004", status: "pending" },
  { id: "FT-012", type: "expense", category: "utilities", amount: 38000, currency: "KES", date: "2026-07-29", description: "Warehouse electricity + cold chain", status: "cleared" },
  { id: "FT-013", type: "expense", category: "permits", amount: 22000, currency: "KES", date: "2026-07-28", description: "Cross-border permits — Uganda", status: "overdue" },
  { id: "FT-014", type: "income", category: "freight_revenue", amount: 278000, currency: "KES", date: "2026-07-31", description: "Shipment MBA-ARS-0731-03 freight", relatedShipmentId: "SH-1003", status: "pending" },
  { id: "FT-015", type: "expense", category: "fuel", amount: 62000, currency: "KES", date: "2026-07-30", description: "Diesel refuel — VH-003, VH-005", status: "cleared" },
];

export const INTEGRATIONS: Integration[] = [
  { id: "INT-001", name: "Kenya Revenue Authority — Simba", provider: "KRA", category: "customs", endpoint: "https://api.kra.go.ke/simba/v2", status: "connected", lastSync: "2026-07-31T10:42:00Z", description: "Customs declarations, export/import permits, transit bonds", requestsToday: 42, uptime: 99.4 },
  { id: "INT-002", name: "Mombasa Port Terminal", provider: "KPA", category: "customs", endpoint: "https://api.kpa.co.ke/terminals/v1", status: "connected", lastSync: "2026-07-31T10:30:00Z", description: "Container tracking, gate passes, port dues", requestsToday: 18, uptime: 99.9 },
  { id: "INT-003", name: "Total Kenya Fleet Card", provider: "Total Energies", category: "fuel", endpoint: "https://fleet.total.co.ke/api/v1", status: "connected", lastSync: "2026-07-31T11:00:00Z", description: "Fuel card transactions, refuel authorization, consumption reports", requestsToday: 67, uptime: 99.7 },
  { id: "INT-004", name: " weighbridge network", provider: "KeNHA", category: "weighbridge", endpoint: "https://weighbridge.kenha.co.ke/api", status: "syncing", lastSync: "2026-07-31T11:12:00Z", description: "Axle weight readings, overload citations, weighbridge tickets", requestsToday: 24, uptime: 98.2 },
  { id: "INT-005", name: "M-Pesa Business API", provider: "Safaricom", category: "payment", endpoint: "https://api.safaricom.co.ke/mpesa/b2c/v1", status: "connected", lastSync: "2026-07-31T10:58:00Z", description: "Driver payments, supplier disbursements, customer collections", requestsToday: 134, uptime: 99.95 },
  { id: "INT-006", name: "Kenya Police NTSA", provider: "NTSA", category: "toll", endpoint: "https://api.ntsa.go.ke/vehicle/v1", status: "connected", lastSync: "2026-07-31T09:30:00Z", description: "Vehicle inspection status, license verification, traffic log", requestsToday: 12, uptime: 99.1 },
  { id: "INT-007", name: "Jubilee Fleet Insurance", provider: "Jubilee Holdings", category: "insurance", endpoint: "https://api.jubileekenya.com/fleet/v2", status: "connected", lastSync: "2026-07-31T08:00:00Z", description: "Policy status, claims initiation, vehicle coverage", requestsToday: 4, uptime: 100 },
  { id: "INT-008", name: "URA Customs (Uganda)", provider: "URA", category: "customs", endpoint: "https://api.ura.go.ug/customs/v1", status: "error", lastSync: "2026-07-31T07:15:00Z", description: "Cross-border customs clearance for Uganda transit", requestsToday: 6, uptime: 87.3 },
  { id: "INT-009", name: "TRA Customs (Tanzania)", provider: "TRA", category: "customs", endpoint: "https://api.tra.go.tz/customs/v1", status: "connected", lastSync: "2026-07-31T09:45:00Z", description: "Cross-border customs clearance for Tanzania transit", requestsToday: 9, uptime: 99.6 },
  { id: "INT-010", name: "QuickBooks Online", provider: "Intuit", category: "erp", endpoint: "https://quickbooks.api.intuit.com/v3", status: "connected", lastSync: "2026-07-31T06:00:00Z", description: "Accounting sync, ledger entries, financial reporting", requestsToday: 22, uptime: 99.8 },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: "AL-001", type: "overload", severity: "critical", title: "Axle overload detected",
    message: "VH-003 rear axle 18,500 kg exceeds legal limit of 16,000 kg. Citations risk on Mombasa–Arusha corridor.",
    vehicleId: "VH-003", driverId: "DR-003", shipmentId: "SH-1003", timestamp: now - 1000 * 60 * 4,
    acknowledged: false, location: { lat: -3.2, lng: 38.9, place: "Voi, Kenya" },
  },
  {
    id: "AL-002", type: "rollover_risk", severity: "critical", title: "Rollover risk — excessive tilt on corner",
    message: "VH-002 trailer tilt 5.8° while cornering. Speed advisory: reduce to 45 km/h on upcoming curves.",
    vehicleId: "VH-002", driverId: "DR-002", shipmentId: "SH-1002", timestamp: now - 1000 * 60 * 9,
    acknowledged: false, location: { lat: -2.4, lng: 37.5, place: "Emali, Kenya" },
  },
  {
    id: "AL-003", type: "unauthorized_cargo", severity: "critical", title: "Undeclared cargo detected",
    message: "Shipment SH-1008 includes 1,800 kg of undeclared electronics not on manifest. Loading blocked pending verification.",
    shipmentId: "SH-1008", timestamp: now - 1000 * 60 * 18,
    acknowledged: false, location: { lat: -1.2864, lng: 36.8172, place: "Nairobi DC — Bay 4" },
  },
  {
    id: "AL-004", type: "driver_fatigue", severity: "warning", title: "Driver fatigue elevated",
    message: "DR-002 Peter Otieno fatigue index 62%. Recommendation: 30-minute break within 30 minutes.",
    driverId: "DR-002", vehicleId: "VH-002", timestamp: now - 1000 * 60 * 14,
    acknowledged: false,
  },
  {
    id: "AL-005", type: "geofence_breach", severity: "warning", title: "Geofence breach",
    message: "VH-004 exited approved Nairobi–Nakuru corridor. Route deviation 8.2 km.",
    vehicleId: "VH-004", driverId: "DR-004", timestamp: now - 1000 * 60 * 22,
    acknowledged: true, location: { lat: -0.8, lng: 35.6, place: "Naivasha, Kenya" },
  },
  {
    id: "AL-006", type: "maintenance_due", severity: "info", title: "Scheduled maintenance due",
    message: "VH-004 next service due in 5 days. Book brake inspection and tire rotation.",
    vehicleId: "VH-004", timestamp: now - 1000 * 60 * 95,
    acknowledged: false,
  },
  {
    id: "AL-007", type: "tire_pressure", severity: "warning", title: "Tire pressure low — rear outer",
    message: "VH-002 rear outer tire 92 psi (target 110). Risk of blowout at sustained highway speeds.",
    vehicleId: "VH-002", timestamp: now - 1000 * 60 * 32,
    acknowledged: false,
  },
  {
    id: "AL-008", type: "stocktake_discrepancy", severity: "warning", title: "Stocktake discrepancy — Nairobi DC",
    message: "12 items short in Cement 50kg category during physical count. Variance value KES 102,000.",
    timestamp: now - 1000 * 60 * 60 * 2,
    acknowledged: false, location: { lat: -1.31, lng: 36.83, place: "Nairobi DC" },
  },
  {
    id: "AL-009", type: "invoice_overdue", severity: "warning", title: "Overdue invoice — Uganda permits",
    message: "KES 22,000 permit fee past due 4 days. Risk of cross-border shipment delays.",
    timestamp: now - 1000 * 60 * 60 * 24,
    acknowledged: false,
  },
  {
    id: "AL-010", type: "speeding", severity: "info", title: "Speeding event",
    message: "VH-001 recorded 92 km/h in 80 km/h zone near Athi River. Auto-coaching triggered.",
    vehicleId: "VH-001", driverId: "DR-001", timestamp: now - 1000 * 60 * 45,
    acknowledged: true, location: { lat: -1.45, lng: 36.97, place: "Athi River" },
  },
  {
    id: "AL-011", type: "unauthorized_passenger", severity: "critical", title: "Unauthorized passenger detected",
    message: "AI cabin camera flagged 2nd occupant in VH-005 not listed on driver manifest. Verify authorization.",
    vehicleId: "VH-005", driverId: "DR-005", timestamp: now - 1000 * 60 * 12,
    acknowledged: false, location: { lat: -0.3031, lng: 36.08, place: "Nakuru Yard" },
  },
  {
    id: "AL-012", type: "temperature", severity: "warning", title: "Reefer temperature deviation",
    message: "VH-004 reefer -16°C (target -20°C). Risk to frozen cargo integrity.",
    vehicleId: "VH-004", timestamp: now - 1000 * 60 * 28,
    acknowledged: false,
  },
];

export const ROUTE_POINTS = {
  NBO_MBA: [
    { lat: -1.2864, lng: 36.8172, label: "Nairobi DC", time: "05:30" },
    { lat: -1.45, lng: 36.97, label: "Athi River", time: "06:15" },
    { lat: -2.0, lng: 37.3, label: "Salama", time: "07:20" },
    { lat: -2.4, lng: 37.5, label: "Emali", time: "08:30" },
    { lat: -3.0, lng: 38.0, label: "Voi", time: "11:00" },
    { lat: -3.7, lng: 38.8, label: "Mariakani", time: "14:30" },
    { lat: -4.0435, lng: 39.6682, label: "Mombasa Port", time: "17:00" },
  ],
};
