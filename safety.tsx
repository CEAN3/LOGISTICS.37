"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldAlert, ShieldCheck, Scale, TrendingUp, UserX, PackageX,
  Phone, Activity, AlertTriangle, CheckCircle2, Gauge, Wind,
  Cpu, Siren, MapPin, Eye, EyeOff,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, KpiCard, StatusBadge } from "@/components/shared/ui";
import type { AlertType, AlertSeverity } from "@/lib/types";

const SEVERITY_STYLE: Record<AlertSeverity, { status: "info" | "warning" | "critical" | "neutral"; ring: string; bg: string }> = {
  info: { status: "info", ring: "ring-sky-500/30", bg: "bg-sky-500/5" },
  warning: { status: "warning", ring: "ring-amber-500/30", bg: "bg-amber-500/5" },
  critical: { status: "critical", ring: "ring-rose-500/30", bg: "bg-rose-500/5" },
  emergency: { status: "critical", ring: "ring-rose-600/40", bg: "bg-rose-600/10" },
};

const TYPE_ICON: Record<AlertType, any> = {
  overload: Scale,
  rollover_risk: TrendingUp,
  unauthorized_passenger: UserX,
  unauthorized_cargo: PackageX,
  driver_sos: Siren,
  driver_fatigue: Activity,
  geofence_breach: MapPin,
  maintenance_due: Cpu,
  tire_pressure: Wind,
  temperature: Gauge,
  speeding: Gauge,
  stocktake_discrepancy: ShieldAlert,
  invoice_overdue: AlertTriangle,
};

const SAFETY_FEATURES = [
  {
    icon: Scale,
    title: "Overload Prevention",
    description: "Each axle is fitted with pneumatic load cells. Weighbridge data is cross-checked in real time against the manifest. If gross weight exceeds the legal limit (typically 16,000 kg per axle on EA corridors), the dispatcher is alerted and the next weighbridge is pre-notified to issue a citation or re-distribution order.",
    status: "active",
    metric: "Live",
  },
  {
    icon: TrendingUp,
    title: "Rollover Prevention on Corners",
    description: "In-cabin IMU sensors monitor lateral acceleration and trailer tilt angle. When tilt exceeds 5° or lateral G exceeds 0.4g on a curve, the speed governor is automatically engaged to reduce velocity to 45 km/h and the driver receives a haptic + audible warning before the next curve.",
    status: "active",
    metric: "5° threshold",
  },
  {
    icon: UserX,
    title: "Unauthorized Passenger Detection",
    description: "Cabin-mounted AI camera performs facial recognition against the authorized driver manifest. If a second occupant is detected and not on the manifest, the dispatcher is alerted within 5 seconds with a cabin snapshot for verification — preventing stowaways and unauthorized ride-alongs.",
    status: "active",
    metric: "AI vision",
  },
  {
    icon: PackageX,
    title: "Unauthorized Cargo Screening",
    description: "Every shipment manifest is verified against physical cargo before dispatch. Items not on the manifest trigger a loading block. The warehouse supervisor must authorize removal or addition, and the change is logged with full audit trail for customs compliance.",
    status: "active",
    metric: "Manifest-locked",
  },
  {
    icon: Siren,
    title: "Driver SOS Panic Button",
    description: "A hard-wired SOS button in the cabin immediately alerts the control room and shares live GPS with the nearest rapid-response partner. The vehicle speed governor engages, door locks can be triggered remotely, and an audio channel opens for two-way communication.",
    status: "active",
    metric: "1-press",
  },
  {
    icon: Activity,
    title: "Driver Fatigue Monitoring",
    description: "Wearable biometric band tracks heart rate variability, blink rate (via cabin camera), and steering micro-corrections. Fatigue index is computed every 30 seconds. Above 70%, a mandatory 30-minute rest is advised; above 85%, the vehicle's governor limits speed to 60 km/h until a break is logged.",
    status: "active",
    metric: "Continuous",
  },
];

export function SafetyModule() {
  const alerts = useLogisticsStore((s) => s.alerts);
  const acknowledgeAlert = useLogisticsStore((s) => s.acknowledgeAlert);
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const drivers = useLogisticsStore((s) => s.drivers);
  const [filter, setFilter] = useState<AlertSeverity | "all">("all");

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const unack = alerts.filter((a) => !a.acknowledged);
  const critical = unack.filter((a) => a.severity === "critical" || a.severity === "emergency");
  const warnings = unack.filter((a) => a.severity === "warning");

  const overloadedVehicles = vehicles.filter((v) => v.telemetry.loadWeight > v.maxLoadKg);
  const rolloverRiskVehicles = vehicles.filter((v) => v.telemetry.tilt > 5);
  const fatiguedDrivers = drivers.filter((d) => d.fatigue > 60);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Safety & Security Operations"
        description="Six layered defenses: overload prevention, rollover control, unauthorized passenger/cargo screening, driver SOS, fatigue monitoring, and physical stocktaking — all wired to live alerts."
        action={
          <Button variant="outline" size="sm" onClick={() => useLogisticsStore.getState().clearAcknowledged()}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Clear Acknowledged
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <KpiCard label="Critical / SOS" value={critical.length} icon={Siren} accent={critical.length > 0 ? "rose" : "emerald"} sublabel="Requires action" />
        <KpiCard label="Warnings" value={warnings.length} icon={AlertTriangle} accent="amber" />
        <KpiCard label="Overloaded Trucks" value={overloadedVehicles.length} icon={Scale} accent={overloadedVehicles.length > 0 ? "rose" : "emerald"} />
        <KpiCard label="Rollover Risk" value={rolloverRiskVehicles.length} icon={TrendingUp} accent={rolloverRiskVehicles.length > 0 ? "rose" : "emerald"} />
        <KpiCard label="Fatigued Drivers" value={fatiguedDrivers.length} icon={Activity} accent={fatiguedDrivers.length > 0 ? "amber" : "emerald"} />
        <KpiCard label="Safety Score" value="94%" icon={ShieldCheck} accent="emerald" trend={2} trendLabel="vs last wk" />
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Live Alerts ({unack.length})</TabsTrigger>
          <TabsTrigger value="features">Safety Systems</TabsTrigger>
          <TabsTrigger value="overload">Overload Monitor</TabsTrigger>
          <TabsTrigger value="screening">Cargo & Passenger Screening</TabsTrigger>
        </TabsList>

        {/* Live alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All ({alerts.length})</Button>
            <Button variant={filter === "emergency" ? "default" : "outline"} size="sm" onClick={() => setFilter("emergency")} className="text-rose-600">Emergency</Button>
            <Button variant={filter === "critical" ? "default" : "outline"} size="sm" onClick={() => setFilter("critical")}>Critical</Button>
            <Button variant={filter === "warning" ? "default" : "outline"} size="sm" onClick={() => setFilter("warning")}>Warnings</Button>
            <Button variant={filter === "info" ? "default" : "outline"} size="sm" onClick={() => setFilter("info")}>Info</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[560px]">
                <div className="divide-y">
                  {filtered.map((a) => {
                    const Icon = TYPE_ICON[a.type];
                    const style = SEVERITY_STYLE[a.severity];
                    const vehicle = a.vehicleId ? vehicles.find((v) => v.id === a.vehicleId) : null;
                    const driver = a.driverId ? drivers.find((d) => d.id === a.driverId) : null;
                    return (
                      <div key={a.id} className={`p-4 ${style.bg} ${a.acknowledged ? "opacity-50" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 ring-1 ${style.ring} ${style.bg}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm">{a.title}</span>
                                  <StatusBadge status={style.status} label={a.severity} />
                                  <Badge variant="outline" className="text-[10px] capitalize">{a.type.replace(/_/g, " ")}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <span className="font-mono">{new Date(a.timestamp).toLocaleString("en-KE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
                                  </span>
                                  {vehicle && (
                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{vehicle.plate}</span>
                                  )}
                                  {driver && (
                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{driver.name}</span>
                                  )}
                                  {a.location && (
                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.location.place}</span>
                                  )}
                                </div>
                              </div>
                              {!a.acknowledged && (
                                <Button
                                  size="sm"
                                  variant={a.severity === "critical" || a.severity === "emergency" ? "destructive" : "outline"}
                                  onClick={() => acknowledgeAlert(a.id)}
                                >
                                  Acknowledge
                                </Button>
                              )}
                              {a.acknowledged && (
                                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Ack
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="p-12 text-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                      <h3 className="font-medium text-sm">No alerts in this category</h3>
                      <p className="text-xs text-muted-foreground mt-1">All systems operating within normal parameters.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety systems overview */}
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAFETY_FEATURES.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{f.title}</h3>
                        <Badge variant="outline" className="text-[10px] mt-0.5 text-emerald-600 border-emerald-500/30">
                          <ShieldCheck className="h-3 w-3 mr-1" /> {f.status}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{f.metric}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Overload monitor */}
        <TabsContent value="overload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Axle Load Monitor — Live Weight Sensor Readings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-sky-500/10 border border-sky-500/30 p-3 mb-4 text-xs text-sky-800 dark:text-sky-300">
                Each truck's load cells report axle weights every 5 seconds. Gross weight is compared against the vehicle's plated maximum and the corridor's legal axle limit (typically 16,000 kg per axle on EA highways). Overages are reported to KeNHA weighbridges ahead of arrival.
              </div>
              <div className="space-y-3">
                {vehicles.map((v) => {
                  const loadPct = (v.telemetry.loadWeight / v.maxLoadKg) * 100;
                  const isOverloaded = v.telemetry.loadWeight > v.maxLoadKg;
                  const perAxle = v.telemetry.loadWeight / 3; // 3 axles typical
                  const overAxleLimit = perAxle > 16000;
                  return (
                    <div key={v.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-mono font-bold text-sm">{v.plate}</span>
                          <span className="text-xs text-muted-foreground ml-2">{v.id} · {v.type.replace("_", " ")}</span>
                        </div>
                        <StatusBadge
                          status={isOverloaded ? "critical" : loadPct > 85 ? "warning" : "ok"}
                          label={isOverloaded ? "Overloaded" : loadPct > 85 ? "Near Limit" : "Within Limit"}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-1">Load vs Max Capacity</div>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(100, loadPct)} className={`h-2 flex-1 ${isOverloaded ? "[&>div]:bg-rose-500" : loadPct > 85 ? "[&>div]:bg-amber-500" : ""}`} />
                            <span className={`text-xs font-medium ${isOverloaded ? "text-rose-600" : ""}`}>{loadPct.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-1">Per-Axle (avg of 3)</div>
                          <div className={`text-sm font-medium ${overAxleLimit ? "text-rose-600" : ""}`}>
                            {perAxle.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg / 16,000 kg
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-1">Gross Weight</div>
                          <div className={`text-sm font-medium ${isOverloaded ? "text-rose-600" : ""}`}>
                            {v.telemetry.loadWeight.toLocaleString()} kg / {v.maxLoadKg.toLocaleString()} kg
                          </div>
                        </div>
                      </div>
                      {isOverloaded && (
                        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-2 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Overloaded by {(v.telemetry.loadWeight - v.maxLoadKg).toLocaleString()} kg. Next weighbridge notified. Consider cargo redistribution at nearest transit yard.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Screening */}
        <TabsContent value="screening" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Cabin Occupant Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-sky-500/10 border border-sky-500/30 p-3 mb-4 text-xs text-sky-800 dark:text-sky-300">
                  AI cabin cameras continuously verify that only manifest-authorized occupants are in the vehicle. Any unknown person triggers an immediate alert with a snapshot for dispatcher verification.
                </div>
                <div className="space-y-2">
                  {vehicles.filter((v) => v.driverId).map((v) => {
                    const driver = drivers.find((d) => d.id === v.driverId);
                    const hasAlert = alerts.some((a) => a.type === "unauthorized_passenger" && a.vehicleId === v.id && !a.acknowledged);
                    return (
                      <div key={v.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                        <div className={`rounded-full p-1.5 ${hasAlert ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                          {hasAlert ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{v.plate} — {driver?.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {hasAlert ? "Unknown occupant detected — verify" : "Authorized driver only"}
                          </div>
                        </div>
                        <StatusBadge status={hasAlert ? "critical" : "ok"} label={hasAlert ? "Verify" : "Clear"} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <PackageX className="h-4 w-4" />
                  Cargo Manifest Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-sky-500/10 border border-sky-500/30 p-3 mb-4 text-xs text-sky-800 dark:text-sky-300">
                  Every cargo line on a shipment is screened against the declared manifest. Items not declared are blocked from loading until a supervisor authorizes removal or addition.
                </div>
                <div className="space-y-2">
                  {useLogisticsStore.getState().shipments.map((s) => {
                    const undeclared = s.cargo.filter((c) => !c.declared);
                    return (
                      <div key={s.id} className="rounded-lg border p-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-medium">{s.reference}</span>
                          <StatusBadge status={undeclared.length > 0 ? "critical" : "ok"} label={undeclared.length > 0 ? `${undeclared.length} Undeclared` : "Verified"} />
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {s.cargo.length} line items · {s.totalWeightKg.toLocaleString()} kg total
                        </div>
                        {undeclared.length > 0 && (
                          <div className="mt-1 text-[10px] text-rose-600">
                            {undeclared.map((c) => c.description).join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
