"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Truck, Wrench, Fuel, Calendar, Cpu, Gauge, Package,
  Plus, Search, MapPin, Activity, AlertCircle,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, StatusBadge, KpiCard } from "@/components/shared/ui";
import type { VehicleStatus } from "@/lib/types";

const STATUS_COLORS: Record<VehicleStatus, "ok" | "warning" | "info" | "neutral" | "critical"> = {
  in_transit: "ok",
  loading: "info",
  unloading: "info",
  idle: "neutral",
  maintenance: "warning",
  offline: "critical",
};

export function FleetModule() {
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const trailers = useLogisticsStore((s) => s.trailers);
  const [search, setSearch] = useState("");

  const filtered = vehicles.filter(
    (v) => v.plate.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCapacity = vehicles.reduce((s, v) => s + v.maxLoadKg, 0);
  const totalUtilized = vehicles.reduce((s, v) => s + v.telemetry.loadWeight, 0);
  const inMaintenance = vehicles.filter((v) => v.status === "maintenance").length;
  const avgFuel = vehicles.reduce((s, v) => s + v.telemetry.fuelLevel, 0) / vehicles.length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Fleet Control Center"
        description="Manage trucks and trailers. Track maintenance schedules, fuel efficiency, sensor health, and axle loads in one place."
        action={<Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Vehicle</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Trucks" value={vehicles.length} icon={Truck} accent="sky" sublabel={`${vehicles.filter(v => v.status === "in_transit").length} active`} />
        <KpiCard label="Total Trailers" value={trailers.length} icon={Package} accent="default" sublabel={`${trailers.filter(t => t.status === "attached").length} attached`} />
        <KpiCard label="Avg Fleet Fuel" value={`${avgFuel.toFixed(0)}%`} icon={Fuel} accent="emerald" sublabel="Across all vehicles" />
        <KpiCard label="In Maintenance" value={inMaintenance} icon={Wrench} accent="amber" sublabel="Scheduled services" />
      </div>

      <Tabs defaultValue="trucks">
        <TabsList>
          <TabsTrigger value="trucks">Trucks ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="trailers">Trailers ({trailers.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
        </TabsList>

        {/* Trucks tab */}
        <TabsContent value="trucks" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by plate or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} of {vehicles.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((v) => {
              const loadPct = (v.telemetry.loadWeight / v.maxLoadKg) * 100;
              const isOverloaded = v.telemetry.loadWeight > v.maxLoadKg;
              return (
                <Card key={v.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{v.plate}</span>
                          <StatusBadge status={STATUS_COLORS[v.status]} label={v.status.replace("_", " ")} />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{v.id} · {v.type.replace("_", " ")} · {v.depot}</div>
                      </div>
                      <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <div className="text-muted-foreground">Speed</div>
                        <div className="font-medium">{v.telemetry.speed} km/h</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fuel</div>
                        <div className="font-medium">{v.telemetry.fuelLevel.toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Engine</div>
                        <div className="font-medium">{v.telemetry.engineTemp}°C</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Load</span>
                        <span className={`font-medium ${isOverloaded ? "text-rose-600" : ""}`}>
                          {(v.telemetry.loadWeight / 1000).toFixed(1)}t / {(v.maxLoadKg / 1000).toFixed(1)}t ({loadPct.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={Math.min(100, loadPct)} className={`h-1.5 ${isOverloaded ? "[&>div]:bg-rose-500" : ""}`} />
                      {isOverloaded && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-rose-600 dark:text-rose-400">
                          <AlertCircle className="h-3 w-3" /> Overloaded by {(v.telemetry.loadWeight - v.maxLoadKg).toLocaleString()} kg
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {v.installedSensors.slice(0, 4).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[9px] py-0 px-1.5">{s}</Badge>
                      ))}
                      {v.installedSensors.length > 4 && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5">+{v.installedSensors.length - 4}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Trailers tab */}
        <TabsContent value="trailers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {trailers.map((t) => {
              const loadPct = (t.currentLoadKg / t.maxLoadKg) * 100;
              const attachedVehicle = vehicles.find((v) => v.id === t.attachedVehicleId);
              return (
                <Card key={t.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{t.plate}</span>
                          <StatusBadge
                            status={t.status === "attached" ? "ok" : t.status === "loading" ? "info" : t.status === "maintenance" ? "warning" : "neutral"}
                            label={t.status}
                          />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{t.id} · {t.type.replace("_", " ")} · {t.axleCount} axles</div>
                      </div>
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Current Load</span>
                        <span className="font-medium">{(t.currentLoadKg / 1000).toFixed(1)}t / {(t.maxLoadKg / 1000).toFixed(1)}t</span>
                      </div>
                      <Progress value={loadPct} className="h-1.5" />
                    </div>
                    {attachedVehicle ? (
                      <div className="text-[11px] flex items-center gap-1.5">
                        <Truck className="h-3 w-3" />
                        <span className="text-muted-foreground">Attached to:</span>
                        <span className="font-mono font-medium">{attachedVehicle.plate}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic">Not attached</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Maintenance tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vehicles
                  .slice()
                  .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                  .map((v) => {
                    const due = new Date(v.nextMaintenance);
                    const daysUntil = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const urgent = daysUntil < 14;
                    return (
                      <div key={v.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className={`rounded-lg p-2 ${urgent ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{v.plate}</span>
                            <span className="text-[11px] text-muted-foreground">{v.id} · {v.type.replace("_", " ")}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Last service: {v.lastMaintenance} · Next: {v.nextMaintenance}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${urgent ? "text-amber-600 dark:text-amber-400" : ""}`}>
                            {daysUntil > 0 ? `${daysUntil} days` : "Overdue"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Odometer {v.telemetry.odometer.toLocaleString()} km</div>
                        </div>
                        <Button variant="outline" size="sm">Schedule</Button>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
