"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Truck, Package, AlertTriangle, Wallet, TrendingUp, Activity,
  ShieldAlert, MapPin, Clock, Boxes, Phone, Zap, Gauge, Flame,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { KpiCard, ModuleHeader, StatusBadge } from "@/components/shared/ui";
import { FleetMap } from "@/components/shared/fleet-map";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const REVENUE_TREND = [
  { day: "Mon", revenue: 485000, expense: 312000 },
  { day: "Tue", revenue: 612000, expense: 348000 },
  { day: "Wed", revenue: 528000, expense: 295000 },
  { day: "Thu", revenue: 745000, expense: 412000 },
  { day: "Fri", revenue: 892000, expense: 458000 },
  { day: "Sat", revenue: 654000, expense: 358000 },
  { day: "Sun", revenue: 412000, expense: 245000 },
];

const SHIPMENT_STATUS = [
  { name: "In Transit", value: 4, color: "#10b981" },
  { name: "Scheduled", value: 1, color: "#f59e0b" },
  { name: "Delivered", value: 1, color: "#0ea5e9" },
  { name: "Delayed", value: 1, color: "#ef4444" },
  { name: "Draft", value: 1, color: "#94a3b8" },
];

export function DashboardModule() {
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const drivers = useLogisticsStore((s) => s.drivers);
  const shipments = useLogisticsStore((s) => s.shipments);
  const alerts = useLogisticsStore((s) => s.alerts);
  const financeTxns = useLogisticsStore((s) => s.financeTxns);
  const warehouses = useLogisticsStore((s) => s.warehouses);
  const setActiveModule = useLogisticsStore((s) => s.setActiveModule);
  const acknowledgeAlert = useLogisticsStore((s) => s.acknowledgeAlert);

  const inTransit = vehicles.filter((v) => v.status === "in_transit").length;
  const activeShipments = shipments.filter((s) => s.status === "in_transit" || s.status === "dispatched").length;
  const totalRevenue = financeTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = financeTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const onDutyDrivers = drivers.filter((d) => d.status === "on_duty").length;
  const unackAlerts = alerts.filter((a) => !a.acknowledged);
  const criticalAlerts = unackAlerts.filter((a) => a.severity === "critical" || a.severity === "emergency");

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Operations Command Center"
        description="Unified view of fleet, shipments, warehouse, finance, and safety. Real-time IoT telemetry flows into every metric below."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3 text-emerald-500" />
              {vehicles.length} Vehicles Tracked
            </Badge>
            <Button onClick={() => setActiveModule("tracking")} variant="default" size="sm">
              <MapPin className="h-4 w-4 mr-1" /> Open Live Map
            </Button>
          </div>
        }
      />

      {/* Critical alerts banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-rose-500/40 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-rose-500/10 p-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                    {criticalAlerts.length} Critical Alerts Require Immediate Attention
                  </h3>
                </div>
                <ScrollArea className="h-[100px] w-full pr-3">
                  <div className="space-y-1.5">
                    {criticalAlerts.slice(0, 5).map((a) => (
                      <div key={a.id} className="flex items-start gap-2 text-xs">
                        <span className="font-mono text-rose-600 dark:text-rose-400 shrink-0">
                          {new Date(a.timestamp).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="font-medium">{a.title}</span>
                        <span className="text-muted-foreground truncate">— {a.message.slice(0, 100)}…</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2 text-[10px] ml-auto shrink-0"
                          onClick={() => acknowledgeAlert(a.id)}
                        >
                          Ack
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setActiveModule("safety")}>
                Open Safety
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <KpiCard label="Active Shipments" value={activeShipments} icon={Package} accent="emerald" trend={12} trendLabel="vs last wk" />
        <KpiCard label="Vehicles In Transit" value={inTransit} unit={`/ ${vehicles.length}`} icon={Truck} accent="sky" sublabel="Real-time GPS tracked" />
        <KpiCard label="On-Duty Drivers" value={onDutyDrivers} unit={`/ ${drivers.length}`} icon={Activity} accent="default" />
        <KpiCard label="Net Profit (Today)" value={`KES ${(netProfit / 1000).toFixed(0)}K`} icon={Wallet} accent="emerald" trend={8} trendLabel="vs yesterday" sublabel={`Rev ${totalRevenue / 1000}K · Exp ${totalExpense / 1000}K`} />
        <KpiCard label="Active Alerts" value={unackAlerts.length} icon={AlertTriangle} accent={criticalAlerts.length > 0 ? "rose" : "amber"} sublabel={`${criticalAlerts.length} critical`} />
        <KpiCard label="Warehouse Util" value={`${Math.round(warehouses.reduce((s, w) => s + w.utilization, 0) / warehouses.length)}%`} icon={Boxes} accent="amber" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Live Fleet Map — East Africa Corridor</CardTitle>
              <Badge variant="outline" className="gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Streaming
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <FleetMap vehicles={vehicles} alerts={alerts} onSelectVehicle={(id) => setActiveModule("tracking")} />
          </CardContent>
        </Card>

        {/* Revenue vs Expense */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Revenue vs Expense — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="url(#exp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active shipments */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">In-Transit Shipments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveModule("tms")}>
                View all →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {shipments.filter((s) => s.status === "in_transit").map((s) => {
                const vehicle = vehicles.find((v) => v.id === s.vehicleId);
                const driver = drivers.find((d) => d.id === s.driverId);
                return (
                  <div key={s.id} className="rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{s.reference}</div>
                        <div className="text-xs text-muted-foreground">{s.customerName}</div>
                      </div>
                      <StatusBadge status="ok" label={`${s.progress}%`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" /> {s.origin}
                      <span className="flex-1 border-t border-dashed border-muted-foreground/30 mx-1" />
                      <MapPin className="h-3 w-3" /> {s.destination}
                    </div>
                    <Progress value={s.progress} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" /> {vehicle?.plate ?? "Unassigned"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {driver?.name ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" /> {(s.totalWeightKg / 1000).toFixed(1)}t
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipment status distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Shipment Status Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={SHIPMENT_STATUS} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {SHIPMENT_STATUS.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
              {SHIPMENT_STATUS.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle telemetry strip */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Vehicle Telemetry Snapshot — Live IoT Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {vehicles.filter((v) => v.status === "in_transit").slice(0, 4).map((v) => (
              <div key={v.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">{v.plate}</span>
                  <StatusBadge status={v.telemetry.tilt > 5 ? "critical" : v.telemetry.fuelLevel < 30 ? "warning" : "ok"} label={v.status.replace("_", " ")} />
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <TelemetryItem icon={Gauge} label="Speed" value={`${v.telemetry.speed} km/h`} />
                  <TelemetryItem icon={Zap} label="Fuel" value={`${v.telemetry.fuelLevel.toFixed(0)}%`} />
                  <TelemetryItem icon={Flame} label="Engine" value={`${v.telemetry.engineTemp}°C`} />
                  <TelemetryItem icon={TrendingUp} label="Tilt" value={`${v.telemetry.tilt}°`} warn={v.telemetry.tilt > 5} />
                  <TelemetryItem icon={Package} label="Load" value={`${(v.telemetry.loadWeight / 1000).toFixed(1)}t`} warn={v.telemetry.loadWeight > v.maxLoadKg} />
                  <TelemetryItem icon={Clock} label="Heading" value={`${v.telemetry.heading}°`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TelemetryItem({ icon: Icon, label, value, warn }: { icon: any; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${warn ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
      <Icon className="h-3 w-3" />
      <span>{label}:</span>
      <span className={`font-medium ${warn ? "" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
