"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plug, CheckCircle2, AlertCircle, RefreshCw, ExternalLink,
  Building2, Fuel, Scale, CreditCard, Shield, FileText, Truck,
  Activity, Clock, Zap,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, KpiCard, StatusBadge } from "@/components/shared/ui";
import type { Integration as IntegrationType } from "@/lib/types";

const CATEGORY_ICON: Record<IntegrationType["category"], any> = {
  customs: Building2,
  fuel: Fuel,
  weighbridge: Scale,
  payment: CreditCard,
  fuel_station: Fuel,
  toll: Truck,
  insurance: Shield,
  erp: FileText,
  tax_authority: FileText,
};

const CATEGORY_COLOR: Record<IntegrationType["category"], string> = {
  customs: "#0ea5e9",
  fuel: "#ef4444",
  weighbridge: "#f59e0b",
  payment: "#10b981",
  fuel_station: "#ef4444",
  toll: "#8b5cf6",
  insurance: "#ec4899",
  erp: "#14b8a6",
  tax_authority: "#6366f1",
};

export function IntegrationsModule() {
  const integrations = useLogisticsStore((s) => s.integrations);

  const connected = integrations.filter((i) => i.status === "connected").length;
  const error = integrations.filter((i) => i.status === "error").length;
  const syncing = integrations.filter((i) => i.status === "syncing").length;
  const totalRequests = integrations.reduce((s, i) => s + i.requestsToday, 0);
  const avgUptime = integrations.reduce((s, i) => s + i.uptime, 0) / integrations.length;

  const grouped = integrations.reduce((acc, i) => {
    if (!acc[i.category]) acc[i.category] = [];
    acc[i.category].push(i);
    return acc;
  }, {} as Record<string, IntegrationType[]>);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Local Integrations Hub"
        description="Direct API connections to East African customs authorities, fuel card providers, weighbridge networks, payment gateways, and ERP systems — eliminating manual paperwork and manual data entry."
        action={<Button size="sm" className="gap-1"><Plug className="h-4 w-4" /> Add Integration</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <KpiCard label="Total Integrations" value={integrations.length} icon={Plug} accent="sky" />
        <KpiCard label="Connected" value={connected} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Errors" value={error} icon={AlertCircle} accent={error > 0 ? "rose" : "emerald"} />
        <KpiCard label="Requests Today" value={totalRequests.toLocaleString()} icon={Activity} accent="amber" sublabel="Across all APIs" />
        <KpiCard label="Avg Uptime" value={`${avgUptime.toFixed(1)}%`} icon={Zap} accent="emerald" />
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">All Integrations</TabsTrigger>
          <TabsTrigger value="by_category">By Category</TabsTrigger>
          <TabsTrigger value="sync_log">Recent Sync Activity</TabsTrigger>
        </TabsList>

        {/* Grid */}
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((i) => {
              const Icon = CATEGORY_ICON[i.category];
              const color = CATEGORY_COLOR[i.category];
              return (
                <Card key={i.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15`, color }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold leading-tight">{i.name}</h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{i.provider}</p>
                        </div>
                      </div>
                      <StatusBadge
                        status={i.status === "connected" ? "ok" : i.status === "syncing" ? "info" : i.status === "error" ? "critical" : "neutral"}
                        label={i.status}
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">{i.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-md bg-muted/40 p-2">
                        <div className="text-muted-foreground">Requests Today</div>
                        <div className="font-medium text-sm">{i.requestsToday}</div>
                      </div>
                      <div className="rounded-md bg-muted/40 p-2">
                        <div className="text-muted-foreground">Uptime</div>
                        <div className={`font-medium text-sm ${i.uptime < 95 ? "text-rose-600" : "text-emerald-600"}`}>{i.uptime.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last sync: {new Date(i.lastSync).toLocaleString("en-KE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t">
                      <Button variant="outline" size="sm" className="gap-1 flex-1">
                        <RefreshCw className="h-3.5 w-3.5" /> Sync Now
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* By category */}
        <TabsContent value="by_category" className="space-y-4">
          {Object.entries(grouped).map(([cat, items]) => {
            const Icon = CATEGORY_ICON[cat as IntegrationType["category"]];
            const color = CATEGORY_COLOR[cat as IntegrationType["category"]];
            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="rounded-md p-1.5" style={{ backgroundColor: `${color}15`, color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="capitalize">{cat.replace(/_/g, " ")}</span>
                    <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map((i) => (
                      <div key={i.id} className="rounded-lg border p-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{i.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{i.provider} · {i.requestsToday} requests today</div>
                        </div>
                        <StatusBadge
                          status={i.status === "connected" ? "ok" : i.status === "syncing" ? "info" : i.status === "error" ? "critical" : "neutral"}
                          label={i.status}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Sync log */}
        <TabsContent value="sync_log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent API Sync Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { time: "11:12:42", integration: "KeNHA Weighbridge Network", action: "POST /axle-reading", status: "200 OK", detail: "VH-003 axle weight recorded at Mariakani weighbridge" },
                  { time: "11:08:15", integration: "M-Pesa Business API", action: "POST /b2c/payment", status: "200 OK", detail: "Driver wage disbursement KES 8,500 to DR-001" },
                  { time: "11:00:03", integration: "Total Kenya Fleet Card", action: "GET /transactions", status: "200 OK", detail: "67 fuel transactions synced" },
                  { time: "10:58:21", integration: "M-Pesa Business API", action: "POST /c2b/confirmation", status: "200 OK", detail: "Customer payment KES 185,000 from East African Distributors" },
                  { time: "10:42:11", integration: "KRA Simba Customs", action: "POST /declaration", status: "200 OK", detail: "Export declaration for SH-1001 accepted" },
                  { time: "10:30:00", integration: "Mombasa Port Terminal", action: "GET /gate-pass", status: "200 OK", detail: "Gate pass verified for VH-003 exit" },
                  { time: "09:45:33", integration: "TRA Customs (Tanzania)", action: "POST /transit-bond", status: "200 OK", detail: "Transit bond issued for SH-1003 Arusha routing" },
                  { time: "09:30:18", integration: "NTSA Vehicle Verification", action: "GET /inspection", status: "200 OK", detail: "12 vehicles verified — all up to date" },
                  { time: "08:00:00", integration: "Jubilee Fleet Insurance", action: "GET /policy-status", status: "200 OK", detail: "All 8 vehicles active on policy" },
                  { time: "07:15:42", integration: "URA Customs (Uganda)", action: "POST /clearance", status: "503 Error", detail: "Service unavailable — retry scheduled" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-md border p-2.5 text-xs">
                    <span className="font-mono text-muted-foreground shrink-0">{log.time}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.integration}</span>
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{log.action}</code>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{log.detail}</div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${log.status.includes("Error") ? "text-rose-600 border-rose-500/30" : "text-emerald-600 border-emerald-500/30"}`}>
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
