"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  UserCog, Heart, Thermometer, Wind, Clock, Coffee, Siren,
  Activity, Battery, Bell, PhoneCall, Shield, Gauge, TrendingUp,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, KpiCard, StatusBadge } from "@/components/shared/ui";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const FATIGUE_TREND = [
  { hour: "06:00", fatigue: 12, hr: 68 },
  { hour: "08:00", fatigue: 18, hr: 72 },
  { hour: "10:00", fatigue: 24, hr: 70 },
  { hour: "12:00", fatigue: 35, hr: 74 },
  { hour: "14:00", fatigue: 48, hr: 78 },
  { hour: "16:00", fatigue: 62, hr: 82 },
  { hour: "18:00", fatigue: 71, hr: 86 },
  { hour: "20:00", fatigue: 78, hr: 88 },
];

export function DriversModule() {
  const drivers = useLogisticsStore((s) => s.drivers);
  const vehicles = useLogisticsStore((s) => s.vehicles);
  const triggerSOS = useLogisticsStore((s) => s.triggerDriverSOS);

  const onDuty = drivers.filter((d) => d.status === "on_duty");
  const avgComfort = drivers.filter((d) => d.status === "on_duty").reduce((s, d) => s + d.comfortScore, 0) / Math.max(1, onDuty.length);
  const avgSafety = drivers.filter((d) => d.status === "on_duty").reduce((s, d) => s + d.safetyScore, 0) / Math.max(1, onDuty.length);
  const fatigued = drivers.filter((d) => d.fatigue > 60).length;
  const emergency = drivers.filter((d) => d.status === "emergency").length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Driver Comfort & Security"
        description="Cabin environment, biometric monitoring, fatigue scoring, and one-touch SOS. A comfortable, alert driver is the single biggest factor in road safety and on-time delivery."
        action={
          <Button variant="outline" size="sm" className="gap-1">
            <Bell className="h-4 w-4" /> Broadcast Advisory
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <KpiCard label="On Duty" value={onDuty.length} icon={UserCog} accent="sky" sublabel={`of ${drivers.length} drivers`} />
        <KpiCard label="Avg Comfort Score" value={`${avgComfort.toFixed(0)}`} icon={Coffee} accent="emerald" sublabel="Cabin environment index" />
        <KpiCard label="Avg Safety Score" value={`${avgSafety.toFixed(0)}`} icon={Shield} accent="emerald" trend={3} trendLabel="vs last wk" />
        <KpiCard label="Fatigued (>60%)" value={fatigued} icon={Activity} accent={fatigued > 0 ? "amber" : "emerald"} />
        <KpiCard label="Emergency" value={emergency} icon={Siren} accent={emergency > 0 ? "rose" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Driver cards */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Drivers — Live Biometric Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {onDuty.map((d) => {
                const vehicle = vehicles.find((v) => v.id === d.vehicleId);
                const fatigueHigh = d.fatigue > 60;
                const hrHigh = d.heartRate > 90;
                return (
                  <div key={d.id} className="rounded-lg border p-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {d.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                          <span className="font-mono">{vehicle?.plate}</span>
                          <span>·</span>
                          <span>{d.hoursDriving.toFixed(1)}h driving</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={d.status === "emergency" ? "destructive" : "outline"}
                        className="gap-1 shrink-0"
                        onClick={() => triggerSOS(d.id)}
                      >
                        <Siren className="h-3.5 w-3.5" /> SOS
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className={`rounded-md p-2 ${fatigueHigh ? "bg-amber-500/10" : "bg-muted/40"}`}>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Activity className="h-3 w-3" /> Fatigue
                        </div>
                        <div className={`text-sm font-bold ${fatigueHigh ? "text-amber-600" : ""}`}>{d.fatigue}%</div>
                      </div>
                      <div className={`rounded-md p-2 ${hrHigh ? "bg-rose-500/10" : "bg-muted/40"}`}>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Heart className="h-3 w-3" /> HR
                        </div>
                        <div className={`text-sm font-bold ${hrHigh ? "text-rose-600" : ""}`}>{d.heartRate}</div>
                      </div>
                      <div className="rounded-md p-2 bg-muted/40">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Thermometer className="h-3 w-3" /> Cabin
                        </div>
                        <div className="text-sm font-bold">{d.cabinTemp}°C</div>
                      </div>
                      <div className="rounded-md p-2 bg-muted/40">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> Break
                        </div>
                        <div className="text-sm font-bold">{d.hoursSinceBreak.toFixed(1)}h</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Comfort Score</span>
                        <span className="font-medium">{d.comfortScore}/100</span>
                      </div>
                      <Progress value={d.comfortScore} className="h-1.5" />
                    </div>

                    {d.status === "emergency" && (
                      <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-2 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-pulse">
                        <Siren className="h-3.5 w-3.5" />
                        SOS ACTIVE — control room notified, GPS shared, speed governor engaged.
                      </div>
                    )}
                    {fatigueHigh && d.status !== "emergency" && (
                      <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-2 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <Coffee className="h-3.5 w-3.5" />
                        Recommendation: 30-minute rest within 30 minutes. Cabin biometric monitoring active.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Fatigue trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Driver Fatigue Trend — Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={FATIGUE_TREND}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[50, 120]} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="fatigue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Fatigue %" />
                <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} name="Heart Rate" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-[11px]">
              <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-amber-500" /> Fatigue %</span>
              <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-rose-500" /> Heart Rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cabin comfort systems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cabin Comfort & Driver Assistance Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Thermometer, title: "Climate Control", description: "Auto-adjusting HVAC maintains 22-24°C cabin temperature. Heat soak protection activates when cabin exceeds 28°C." },
              { icon: Wind, title: "Air Quality Monitor", description: "CO₂ and PM2.5 sensors trigger fresh-air intake when CO₂ exceeds 1000ppm — preventing drowsiness." },
              { icon: Coffee, title: "Smart Rest Recommendations", description: "AI-driven break suggestions based on fatigue index, time of day, and distance to next safe rest stop." },
              { icon: Heart, title: "Biometric Wearable", description: "Driver wristband tracks HR, HRV, and skin temperature. Anomalies trigger dispatcher check-in within 60 seconds." },
              { icon: Siren, title: "Hard-Wired SOS Button", description: "Single press opens two-way audio with control room, shares live GPS, and engages speed governor to halt vehicle." },
              { icon: PhoneCall, title: "Hands-Free Voice Comms", description: "Voice-activated dispatch channel. No phone handling required while driving — full NTSA compliance." },
              { icon: Shield, title: "Door Lock Telemetry", description: "Cab and cargo door lock status monitored. Remote lock-down available via control room in case of hijack attempt." },
              { icon: Battery, title: "Backup Power", description: "8-hour backup battery for telematics, SOS, and cabin camera — keeps system online even if main battery is disabled." },
              { icon: Gauge, title: "Adaptive Cruise Coaching", description: "Gentle audio cues for harsh braking, sharp cornering, and excessive speed — improves safety score over time." },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{f.title}</span>
                  <Badge variant="outline" className="text-[9px] ml-auto text-emerald-600 border-emerald-500/30">Active</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
