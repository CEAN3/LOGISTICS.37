"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, MapPin, Truck, Package, Boxes, Wallet,
  ShieldAlert, UserCog, Plug, TruckIcon, ChevronLeft, Menu,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import type { ModuleKey } from "@/lib/types";

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Command Center", icon: LayoutDashboard, description: "Unified KPIs & alerts" },
  { key: "tracking", label: "Live Tracking", icon: MapPin, description: "Real-time fleet map" },
  { key: "fleet", label: "Fleet Control", icon: Truck, description: "Trucks & trailers" },
  { key: "tms", label: "Transportation (TMS)", icon: Package, description: "Shipments & dispatch" },
  { key: "wms", label: "Warehouse (WMS)", icon: Boxes, description: "Inventory & stocktaking" },
  { key: "finance", label: "Finance (ERP)", icon: Wallet, description: "Income, expenses, P&L" },
  { key: "safety", label: "Safety & Security", icon: ShieldAlert, description: "Overload, rollover, screening" },
  { key: "drivers", label: "Driver Comfort", icon: UserCog, description: "Fatigue, comfort, SOS" },
  { key: "integrations", label: "Local Integrations", icon: Plug, description: "Customs, fuel, payments" },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const activeModule = useLogisticsStore((s) => s.activeModule);
  const setActiveModule = useLogisticsStore((s) => s.setActiveModule);
  const alerts = useLogisticsStore((s) => s.alerts);
  const unackAlerts = alerts.filter((a) => !a.acknowledged && a.severity !== "info").length;

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0",
        collapsed ? "w-[68px]" : "w-72",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          <TruckIcon className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">TransAfrica</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Logistics Command</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto h-8 w-8 shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;
          const showBadge = item.key === "safety" && unackAlerts > 0;
          return (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && (
                <div className="flex flex-1 flex-col items-start gap-0.5 min-w-0">
                  <span className="font-medium truncate">{item.label}</span>
                  <span className="text-[10px] opacity-70 truncate">{item.description}</span>
                </div>
              )}
              {showBadge && (
                <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unackAlerts}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t p-3">
          <div className="rounded-lg bg-muted/50 p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">System Status</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All subsystems online. Real-time IoT pipeline streaming.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
