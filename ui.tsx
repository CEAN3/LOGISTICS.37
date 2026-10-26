"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent?: "default" | "emerald" | "amber" | "rose" | "sky";
  sublabel?: string;
}

const ACCENTS = {
  default: "bg-muted/40 text-foreground",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function KpiCard({ label, value, unit, icon: Icon, trend, trendLabel, accent = "default", sublabel }: KpiCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </CardTitle>
          <div className={cn("rounded-md p-1.5", ACCENTS[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {sublabel && <p className="text-[11px] text-muted-foreground mt-1">{sublabel}</p>}
        {typeof trend === "number" && (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                trend >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              )}
            >
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="text-[11px] text-muted-foreground">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status, label }: { status: "ok" | "warning" | "critical" | "info" | "neutral"; label: string }) {
  const styles = {
    ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    critical: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    info: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", styles[status])}>
      {label}
    </span>
  );
}

export function ModuleContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-6 p-4 md:p-6", className)}>{children}</div>;
}

export function ModuleHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
