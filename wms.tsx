"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Boxes, MapPin, ClipboardCheck, Plus, ScanLine, AlertTriangle,
  CheckCircle2, Package, Warehouse, Search, TrendingDown, TrendingUp,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, StatusBadge, KpiCard } from "@/components/shared/ui";

export function WmsModule() {
  const warehouses = useLogisticsStore((s) => s.warehouses);
  const inventory = useLogisticsStore((s) => s.inventory);
  const stocktakes = useLogisticsStore((s) => s.stocktakes);
  const [selectedWh, setSelectedWh] = useState<string>(warehouses[0]?.id ?? "");

  const wh = warehouses.find((w) => w.id === selectedWh);
  const whInventory = inventory.filter((i) => i.warehouseId === selectedWh);
  const whStocktakes = stocktakes.filter((s) => s.warehouseId === selectedWh);

  const totalCapacity = warehouses.reduce((s, w) => s + w.capacityM3, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.usedM3, 0);
  const lowStock = inventory.filter((i) => i.quantity <= i.reorderLevel);
  const discrepancies = inventory.filter((i) => i.quantity !== i.expectedQuantity);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Warehouse Management System"
        description="Multi-warehouse inventory control with zone-level tracking, automated reorder triggers, and rigorous physical stocktaking to prevent shrinkage."
        action={<Button size="sm" className="gap-1"><ScanLine className="h-4 w-4" /> Start Stocktake</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Warehouses" value={warehouses.length} icon={Warehouse} accent="sky" sublabel={`${warehouses.reduce((s, w) => s + w.zones, 0)} zones`} />
        <KpiCard label="Total Inventory" value={inventory.length} icon={Boxes} accent="default" sublabel={`${inventory.reduce((s, i) => s + i.quantity, 0)} units`} />
        <KpiCard label="Capacity Used" value={`${Math.round((totalUsed / totalCapacity) * 100)}%`} icon={Package} accent="amber" sublabel={`${totalUsed.toLocaleString()} / ${totalCapacity.toLocaleString()} m³`} />
        <KpiCard label="Low Stock Items" value={lowStock.length} icon={AlertTriangle} accent="rose" sublabel="Need reorder" />
      </div>

      <Tabs defaultValue="warehouses">
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="stocktake">Physical Stocktaking</TabsTrigger>
        </TabsList>

        {/* Warehouses tab */}
        <TabsContent value="warehouses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {warehouses.map((w) => (
              <Card
                key={w.id}
                className={`cursor-pointer hover:shadow-md transition-all ${selectedWh === w.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedWh(w.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{w.name}</div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" /> {w.location}
                      </div>
                    </div>
                    <StatusBadge
                      status={w.utilization > 90 ? "critical" : w.utilization > 75 ? "warning" : "ok"}
                      label={`${w.utilization}%`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Space Utilization</span>
                      <span className="font-medium">{w.usedM3.toLocaleString()} / {w.capacityM3.toLocaleString()} m³</span>
                    </div>
                    <Progress value={w.utilization} className={`h-1.5 ${w.utilization > 90 ? "[&>div]:bg-rose-500" : w.utilization > 75 ? "[&>div]:bg-amber-500" : ""}`} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <div className="text-muted-foreground">Zones</div>
                      <div className="font-medium">{w.zones}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Docks</div>
                      <div className="font-medium">{w.dockCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Manager</div>
                      <div className="font-medium truncate">{w.manager.split(" ")[0]}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory tab */}
        <TabsContent value="inventory" className="space-y-4">
          {wh && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Inventory — {wh.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Unit Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whInventory.map((i) => {
                      const variance = i.quantity - i.expectedQuantity;
                      const lowStock = i.quantity <= i.reorderLevel;
                      return (
                        <TableRow key={i.id}>
                          <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                          <TableCell className="text-xs font-medium">{i.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{i.category}</TableCell>
                          <TableCell className="text-right text-xs">{i.quantity} {i.unit}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{i.expectedQuantity}</TableCell>
                          <TableCell className={`text-right text-xs font-medium ${variance < 0 ? "text-rose-600" : variance > 0 ? "text-emerald-600" : ""}`}>
                            {variance > 0 ? "+" : ""}{variance}
                          </TableCell>
                          <TableCell className="text-right text-xs">KES {i.unitValue.toLocaleString()}</TableCell>
                          <TableCell>
                            {lowStock ? (
                              <Badge variant="destructive" className="text-[9px]">Reorder</Badge>
                            ) : variance !== 0 ? (
                              <Badge variant="secondary" className="text-[9px]">Variance</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-500/30">OK</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Stocktake tab */}
        <TabsContent value="stocktake" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Physical Stocktaking Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-sky-500/10 border border-sky-500/30 p-3 mb-4 text-xs text-sky-800 dark:text-sky-300">
                Physical stocktaking is conducted per warehouse on a rotating schedule. Each count is supervised, scanner-verified, and any variance above tolerance triggers an investigation workflow.
              </div>
              <div className="space-y-3">
                {stocktakes.map((st) => {
                  const warehouse = warehouses.find((w) => w.id === st.warehouseId);
                  return (
                    <div key={st.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm">{st.id}</span>
                            <StatusBadge
                              status={st.status === "completed" ? "ok" : st.status === "in_progress" ? "info" : "neutral"}
                              label={st.status.replace("_", " ")}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {warehouse?.name} · {st.date} · Auditor: {st.auditor}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{st.itemsScanned.toLocaleString()} items</div>
                          <div className={`text-xs font-medium ${st.discrepancies > 5 ? "text-rose-600" : st.discrepancies > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                            {st.discrepancies} discrepancies
                          </div>
                        </div>
                      </div>
                      {st.notes && (
                        <div className="text-xs text-muted-foreground italic bg-muted/30 rounded-md p-2">
                          {st.notes}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm"><ScanLine className="h-3.5 w-3.5 mr-1" /> View Scan Log</Button>
                        {st.status === "in_progress" && <Button size="sm">Continue Count</Button>}
                        {st.status === "completed" && st.discrepancies > 0 && (
                          <Button variant="outline" size="sm"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Investigate Variance</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {discrepancies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Active Inventory Discrepancies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Counted</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Value Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discrepancies.map((i) => {
                      const variance = i.quantity - i.expectedQuantity;
                      return (
                        <TableRow key={i.id}>
                          <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                          <TableCell className="text-xs font-medium">{i.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{warehouses.find(w => w.id === i.warehouseId)?.name}</TableCell>
                          <TableCell className="text-right text-xs">{i.quantity}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{i.expectedQuantity}</TableCell>
                          <TableCell className={`text-right text-xs font-medium ${variance < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {variance > 0 ? "+" : ""}{variance}
                          </TableCell>
                          <TableCell className={`text-right text-xs font-medium ${variance < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            KES {(Math.abs(variance) * i.unitValue).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
