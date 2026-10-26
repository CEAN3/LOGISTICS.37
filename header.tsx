"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Search, Activity, Radio } from "lucide-react";
import { useLogisticsStore } from "@/lib/store";

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Command Center",
  tracking: "Live Tracking",
  fleet: "Fleet Control",
  tms: "Transportation Management",
  wms: "Warehouse Management",
  finance: "Finance & ERP",
  safety: "Safety & Security",
  drivers: "Driver Comfort & Safety",
  integrations: "Local Integrations",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const activeModule = useLogisticsStore((s) => s.activeModule);
  const alerts = useLogisticsStore((s) => s.alerts);
  const setActiveModule = useLogisticsStore((s) => s.setActiveModule);
  const liveTracking = useLogisticsStore((s) => s.liveTrackingEnabled);
  const toggleLiveTracking = useLogisticsStore((s) => s.toggleLiveTracking);

  const unackCount = alerts.filter((a) => !a.acknowledged && a.severity !== "info").length;
  const criticalCount = alerts.filter((a) => !a.acknowledged && (a.severity === "critical" || a.severity === "emergency")).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold leading-tight">{MODULE_LABELS[activeModule]}</h1>
        <span className="text-[11px] text-muted-foreground" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <Button
            variant={liveTracking ? "default" : "outline"}
            size="sm"
            onClick={toggleLiveTracking}
            className="gap-1.5"
          >
            <Radio className={`h-3.5 w-3.5 ${liveTracking ? "animate-pulse" : ""}`} />
            {liveTracking ? "Live" : "Paused"}
          </Button>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Activity className="h-3 w-3" />
              {criticalCount} Critical
            </Badge>
          )}
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setActiveModule("safety")}
        >
          <Bell className="h-4 w-4" />
          {unackCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unackCount}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          suppressHydrationWarning
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            OA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium leading-tight">Operations Admin</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Nairobi Control</span>
          </div>
        </div>
      </div>
    </header>
  );
}
