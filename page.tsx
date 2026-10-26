"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DashboardModule } from "@/components/modules/dashboard";
import { TrackingModule } from "@/components/modules/tracking";
import { FleetModule } from "@/components/modules/fleet";
import { TmsModule } from "@/components/modules/tms";
import { WmsModule } from "@/components/modules/wms";
import { FinanceModule } from "@/components/modules/finance";
import { SafetyModule } from "@/components/modules/safety";
import { DriversModule } from "@/components/modules/drivers";
import { IntegrationsModule } from "@/components/modules/integrations";
import { useLogisticsStore } from "@/lib/store";
import { useRealtimeSimulation } from "@/lib/realtime-sim";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeModule = useLogisticsStore((s) => s.activeModule);

  // Detect mobile and auto-collapse sidebar
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Start real-time telemetry simulation
  useRealtimeSimulation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {activeModule === "dashboard" && <DashboardModule />}
          {activeModule === "tracking" && <TrackingModule />}
          {activeModule === "fleet" && <FleetModule />}
          {activeModule === "tms" && <TmsModule />}
          {activeModule === "wms" && <WmsModule />}
          {activeModule === "finance" && <FinanceModule />}
          {activeModule === "safety" && <SafetyModule />}
          {activeModule === "drivers" && <DriversModule />}
          {activeModule === "integrations" && <IntegrationsModule />}
        </main>
      </div>
    </div>
  );
}
