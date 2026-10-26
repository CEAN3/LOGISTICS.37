"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Truck, MapPin, Gauge, Zap, Flame, TrendingUp, Package, Clock,
  Radio, Navigation, Activity, X, Cpu, Wind, AlertTriangle,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, StatusBadge } from "@/components/shared/ui";
import { FleetMap } from "@/components/shared/fleet-map";

export function TrackingModule() {
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const drivers = useLogisticsStore((s) => s.drivers);
  const shipments = useLogisticsStore((s) => s.shipments);
  const alerts = useLogisticsStore((s) => s.alerts);
  const liveTracking = useLogisticsStore((s) => s.liveTrackingEnabled);
  const toggleLiveTracking = useLogisticsStore((s) => s.toggleLiveTracking);
  const selectedVehicleId = useLogisticsStore((s) => s.selectedVehicleId);
  const setSelectedVehicleId = useLogisticsStore((s) => s.setSelectedVehicleId);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const selectedDriver = selectedVehicle?.driverId ? drivers.find((d) => d.id === selectedVehicle.driverId) : null;
  const selectedShipment = selectedVehicle?.currentShipmentId ? shipments.find((s) => s.id === selectedVehicle.currentShipmentId) : null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Real-Time Fleet Tracking"
        description="Live GPS, IoT telemetry, geofencing, and route monitoring. Telemetry updates every 2 seconds via the on-vehicle gateway."
        action={
          <Button variant={liveTracking ? "default" : "outline"} onClick={toggleLiveTracking} className="gap-2">
            <Radio className={`h-4 w-4 ${liveTracking ? "animate-pulse" : ""}`} />
            {liveTracking ? "Streaming Live" : "Paused"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardContent className="p-2">
            <FleetMap
              vehicles={vehicles}
              alerts={alerts}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
              selectedVehicleId={selectedVehicleId}
              height={560}
            />
          </CardContent>
        </Card>

        {/* Vehicle list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Fleet ({vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[510px] pr-3">
              <div className="space-y-2">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicleId === v.id;
                  const hasAlert = alerts.some((a) => a.vehicleId === v.id && !a.acknowledged && a.severity === "critical");
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicleId(isSelected ? null : v.id)}
                      className={`w-full text-left rounded-lg border p-3 transition-all hover:bg-muted/40 ${
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold">{v.plate}</span>
                          {hasAlert && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                        </div>
                        <StatusBadge
                          status={v.status === "in_transit" ? "ok" : v.status === "maintenance" || v.status === "offline" ? "neutral" : "info"}
                          label={v.status.replace("_", " ")}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{v.telemetry.speed} km/h</span>
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{v.telemetry.fuelLevel.toFixed(0)}%</span>
                        <span className="flex items-center gap-1"><Package className="h-3 w-3" />{(v.telemetry.loadWeight / 1000).toFixed(1)}t</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle detail panel */}
      {selectedVehicle && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {selectedVehicle.plate} — {selectedVehicle.type.replace("_", " ")} · {selectedVehicle.depot}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedVehicleId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Telemetry */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Telemetry</h4>
                <div className="grid grid-cols-2 gap-2">
                  <TelemetryItem icon={Navigation} label="Position" value={`${selectedVehicle.telemetry.lat.toFixed(4)}, ${selectedVehicle.telemetry.lng.toFixed(4)}`} />
                  <TelemetryItem icon={Gauge} label="Speed" value={`${selectedVehicle.telemetry.speed} km/h`} />
                  <TelemetryItem icon={Clock} label="Heading" value={`${selectedVehicle.telemetry.heading}°`} />
                  <TelemetryItem icon={Zap} label="Fuel" value={`${selectedVehicle.telemetry.fuelLevel.toFixed(1)}%`} warn={selectedVehicle.telemetry.fuelLevel < 30} />
                  <TelemetryItem icon={Flame} label="Engine Temp" value={`${selectedVehicle.telemetry.engineTemp}°C`} warn={selectedVehicle.telemetry.engineTemp > 95} />
                  <TelemetryItem icon={TrendingUp} label="Tilt" value={`${selectedVehicle.telemetry.tilt}°`} warn={selectedVehicle.telemetry.tilt > 5} />
                  <TelemetryItem icon={Activity} label="Lateral G" value={`${selectedVehicle.telemetry.gForce}g`} warn={selectedVehicle.telemetry.gForce > 0.4} />
                  <TelemetryItem icon={Package} label="Load" value={`${(selectedVehicle.telemetry.loadWeight / 1000).toFixed(2)}t`} warn={selectedVehicle.telemetry.loadWeight > selectedVehicle.maxLoadKg} />
                  <TelemetryItem icon={Wind} label="Cabin Temp" value={`${selectedVehicle.telemetry.cabinTemp}°C`} />
                  <TelemetryItem icon={Cpu} label="Tires" value={selectedVehicle.telemetry.tirePressure.slice(0, 3).map((p) => `${p}`).join("/")} />
                </div>
              </div>

              {/* Driver & Shipment */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Driver & Assignment</h4>
                {selectedDriver && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {selectedDriver.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{selectedDriver.name}</div>
                        <div className="text-[11px] text-muted-foreground">{selectedDriver.phone}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="text-muted-foreground">Fatigue</div>
                        <div className="font-medium">{selectedDriver.fatigue}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Heart Rate</div>
                        <div className="font-medium">{selectedDriver.heartRate} bpm</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Driving Time</div>
                        <div className="font-medium">{selectedDriver.hoursDriving.toFixed(1)}h</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Since Break</div>
                        <div className="font-medium">{selectedDriver.hoursSinceBreak.toFixed(1)}h</div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedShipment && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{selectedShipment.reference}</span>
                      <Badge variant="outline" className="text-[10px]">{selectedShipment.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <MapPin className="h-3 w-3" /> {selectedShipment.origin}
                      <span className="flex-1 border-t border-dashed mx-1" />
                      <MapPin className="h-3 w-3" /> {selectedShipment.destination}
                    </div>
                    <Progress value={selectedShipment.progress} className="h-1.5" />
                  </div>
                )}
              </div>

              {/* Sensors */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Installed Sensors</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVehicle.installedSensors.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-[11px] space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Max Load</span><span className="font-medium">{selectedVehicle.maxLoadKg.toLocaleString()} kg</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Current Load</span><span className={`font-medium ${selectedVehicle.telemetry.loadWeight > selectedVehicle.maxLoadKg ? "text-rose-600" : ""}`}>{selectedVehicle.telemetry.loadWeight.toLocaleString()} kg</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Load Utilization</span><span className="font-medium">{((selectedVehicle.telemetry.loadWeight / selectedVehicle.maxLoadKg) * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fuel Efficiency</span><span className="font-medium">{selectedVehicle.fuelEfficiency} L/100km</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Odometer</span><span className="font-medium">{selectedVehicle.telemetry.odometer.toLocaleString()} km</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Next Service</span><span className="font-medium">{selectedVehicle.nextMaintenance}</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TelemetryItem({ icon: Icon, label, value, warn }: { icon: any; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-md border p-2 ${warn ? "border-rose-500/40 bg-rose-500/5" : ""}`}>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className={`text-sm font-medium ${warn ? "text-rose-600 dark:text-rose-400" : ""}`}>{value}</div>
    </div>
  );
}
