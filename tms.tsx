"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Package, Plus, Search, MapPin, Truck, User, Calendar, Scale,
  AlertTriangle, CheckCircle2, Clock, FileText,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, StatusBadge, KpiCard } from "@/components/shared/ui";
import type { ShipmentStatus } from "@/lib/types";

const STATUS_BADGE: Record<ShipmentStatus, { status: "ok" | "warning" | "info" | "neutral" | "critical"; label: string }> = {
  draft: { status: "neutral", label: "Draft" },
  scheduled: { status: "info", label: "Scheduled" },
  dispatched: { status: "info", label: "Dispatched" },
  in_transit: { status: "ok", label: "In Transit" },
  at_warehouse: { status: "info", label: "At Warehouse" },
  delivered: { status: "ok", label: "Delivered" },
  delayed: { status: "warning", label: "Delayed" },
  cancelled: { status: "critical", label: "Cancelled" },
};

export function TmsModule() {
  const shipments = useLogisticsStore((s) => s.shipments);
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const drivers = useLogisticsStore((s) => s.drivers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");

  const filtered = shipments.filter((s) => {
    const matchesSearch = s.reference.toLowerCase().includes(search.toLowerCase()) || s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = shipments.reduce((s, sh) => s + sh.freightCharge, 0);
  const totalWeight = shipments.reduce((s, sh) => s + sh.totalWeightKg, 0);
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const delayed = shipments.filter((s) => s.status === "delayed").length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Transportation Management System"
        description="Plan, dispatch, and track shipments across the East Africa corridor. Manifest verification blocks undeclared cargo before trucks leave the yard."
        action={<Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Shipment</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Shipments" value={shipments.length} icon={Package} accent="sky" />
        <KpiCard label="Freight Booked" value={`KES ${(totalRevenue / 1000).toFixed(0)}K`} icon={FileText} accent="emerald" />
        <KpiCard label="Cargo Moved" value={`${(totalWeight / 1000).toFixed(1)}t`} icon={Scale} accent="default" />
        <KpiCard label="Delayed" value={delayed} icon={Clock} accent="amber" sublabel={`${delivered} delivered`} />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="manifest">Manifest Screening</TabsTrigger>
        </TabsList>

        {/* Active shipments */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {shipments.filter((s) => s.status === "in_transit" || s.status === "dispatched" || s.status === "scheduled").map((s) => {
              const vehicle = vehicles.find((v) => v.id === s.vehicleId);
              const driver = drivers.find((d) => d.id === s.driverId);
              const hasUndeclared = s.cargo.some((c) => !c.declared);
              return (
                <Card key={s.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm">{s.reference}</span>
                          <StatusBadge {...STATUS_BADGE[s.status]} />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{s.customerName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">KES {s.freightCharge.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">{s.distanceKm} km</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{s.origin}</span>
                      </div>
                      <div className="h-px flex-1 bg-muted" />
                      <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
                        <span className="truncate">{s.destination}</span>
                        <MapPin className="h-3 w-3 shrink-0" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{s.progress}%</span>
                      </div>
                      <Progress value={s.progress} className="h-1.5" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      {vehicle && (
                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {vehicle.plate}</span>
                      )}
                      {driver && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {driver.name}</span>
                      )}
                      <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> {(s.totalWeightKg / 1000).toFixed(1)}t</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> ETA {new Date(s.estimatedDelivery).toLocaleDateString()}</span>
                    </div>

                    {hasUndeclared && (
                      <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-2 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Manifest contains undeclared cargo. Loading suspended pending verification.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* All shipments table */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reference or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <div className="flex items-center gap-1">
              <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
              <Button variant={statusFilter === "in_transit" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in_transit")}>In Transit</Button>
              <Button variant={statusFilter === "delivered" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("delivered")}>Delivered</Button>
              <Button variant={statusFilter === "delayed" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("delayed")}>Delayed</Button>
              <Button variant={statusFilter === "draft" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("draft")}>Draft</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                    <TableHead className="text-right">Charge</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs font-medium">{s.reference}</TableCell>
                      <TableCell className="text-xs">{s.customerName}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1">
                          <span>{s.origin}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{s.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge {...STATUS_BADGE[s.status]} /></TableCell>
                      <TableCell className="text-right text-xs">{(s.totalWeightKg / 1000).toFixed(1)}t</TableCell>
                      <TableCell className="text-right text-xs font-medium">KES {s.freightCharge.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Progress value={s.progress} className="h-1.5 w-16" />
                          <span className="text-xs w-8 text-right">{s.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manifest screening */}
        <TabsContent value="manifest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Cargo Manifest Screening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-3 mb-4 text-xs text-amber-800 dark:text-amber-300">
                Every shipment is screened against the declared manifest before dispatch. Items not on the manifest are flagged and loading is blocked until a supervisor authorizes removal or addition.
              </div>
              <div className="space-y-3">
                {shipments.map((s) => {
                  const undeclared = s.cargo.filter((c) => !c.declared);
                  const hazardous = s.cargo.filter((c) => c.hazardous);
                  return (
                    <div key={s.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-mono font-bold text-sm">{s.reference}</span>
                          <span className="text-xs text-muted-foreground ml-2">{s.customerName}</span>
                        </div>
                        {undeclared.length === 0 ? (
                          <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" /> Manifest Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" /> {undeclared.length} Undeclared
                          </Badge>
                        )}
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="h-7 text-xs">Item</TableHead>
                            <TableHead className="h-7 text-xs text-right">Weight</TableHead>
                            <TableHead className="h-7 text-xs text-right">Units</TableHead>
                            <TableHead className="h-7 text-xs">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {s.cargo.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell className="text-xs py-1.5">
                                {c.description}
                                {c.hazardous && <Badge variant="secondary" className="ml-2 text-[9px] py-0 px-1">HAZ</Badge>}
                              </TableCell>
                              <TableCell className="text-xs text-right py-1.5">{c.weightKg.toLocaleString()} kg</TableCell>
                              <TableCell className="text-xs text-right py-1.5">{c.unitCount}</TableCell>
                              <TableCell className="py-1.5">
                                {c.declared ? (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 text-emerald-600 border-emerald-500/30">Declared</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-[9px] py-0 px-1">Undeclared</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
