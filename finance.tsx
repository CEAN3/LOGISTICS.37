"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Wallet, TrendingUp, TrendingDown, Plus, FileText, DollarSign,
  Receipt, Banknote, AlertCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useLogisticsStore } from "@/lib/store";
import { ModuleHeader, KpiCard, StatusBadge } from "@/components/shared/ui";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { FinanceCategory } from "@/lib/types";

const EXPENSE_BY_CATEGORY: { category: FinanceCategory; label: string; color: string }[] = [
  { category: "fuel", label: "Fuel", color: "#ef4444" },
  { category: "salaries", label: "Salaries", color: "#f59e0b" },
  { category: "maintenance", label: "Maintenance", color: "#8b5cf6" },
  { category: "warehouse_lease", label: "Warehouse", color: "#06b6d4" },
  { category: "customs_duties", label: "Customs", color: "#10b981" },
  { category: "insurance", label: "Insurance", color: "#ec4899" },
  { category: "tolls", label: "Tolls", color: "#6366f1" },
  { category: "utilities", label: "Utilities", color: "#14b8a6" },
  { category: "permits", label: "Permits", color: "#f97316" },
];

const MONTHLY_PNL = [
  { month: "Feb", income: 1840000, expense: 1240000 },
  { month: "Mar", income: 2120000, expense: 1380000 },
  { month: "Apr", income: 1950000, expense: 1320000 },
  { month: "May", income: 2340000, expense: 1480000 },
  { month: "Jun", income: 2180000, expense: 1410000 },
  { month: "Jul", income: 2620000, expense: 1560000 },
];

export function FinanceModule() {
  const txns = useLogisticsStore((s) => s.financeTxns);
  const shipments = useLogisticsStore((s) => s.shipments);

  const income = txns.filter((t) => t.type === "income");
  const expenses = txns.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const margin = (netProfit / totalIncome) * 100;
  const overdue = txns.filter((t) => t.status === "overdue");

  const expenseByCat = EXPENSE_BY_CATEGORY.map((c) => ({
    ...c,
    amount: expenses.filter((t) => t.category === c.category).reduce((s, t) => s + t.amount, 0),
  })).filter((c) => c.amount > 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ModuleHeader
        title="Finance & Enterprise Resource Planning"
        description="Track income, expenses, invoices, and profitability across shipments, fleet, and warehouses. Syncs with local tax authorities and ERP integrations."
        action={<Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Transaction</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <KpiCard label="Total Income" value={`KES ${(totalIncome / 1000).toFixed(0)}K`} icon={TrendingUp} accent="emerald" sublabel={`${income.length} transactions`} />
        <KpiCard label="Total Expense" value={`KES ${(totalExpense / 1000).toFixed(0)}K`} icon={TrendingDown} accent="rose" sublabel={`${expenses.length} transactions`} />
        <KpiCard label="Net Profit" value={`KES ${(netProfit / 1000).toFixed(0)}K`} icon={Wallet} accent={netProfit > 0 ? "emerald" : "rose"} trend={8} trendLabel="vs last month" />
        <KpiCard label="Profit Margin" value={`${margin.toFixed(1)}%`} icon={DollarSign} accent="sky" />
        <KpiCard label="Overdue" value={overdue.length} icon={AlertCircle} accent="amber" sublabel={`KES ${overdue.reduce((s, t) => s + t.amount, 0).toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly P&L */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Profit & Loss — 6 Month Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY_PNL}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseByCat} dataKey="amount" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {expenseByCat.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
              {expenseByCat.slice(0, 6).map((c) => (
                <div key={c.category} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="ml-auto font-medium">{(c.amount / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income ({income.length})</TabsTrigger>
          <TabsTrigger value="expense">Expenses ({expenses.length})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices & Receivables</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txns.slice().sort((a, b) => b.date.localeCompare(a.date)).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs">{t.date}</TableCell>
                      <TableCell className="text-xs font-medium">{t.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground capitalize">{t.category.replace("_", " ")}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                          {t.type === "income" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {t.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={t.status === "cleared" ? "ok" : t.status === "pending" ? "info" : "warning"}
                          label={t.status}
                        />
                      </TableCell>
                      <TableCell className={`text-right font-medium ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "income" ? "+" : "-"} KES {t.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shipment</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {income.map((t) => {
                    const shipment = shipments.find((s) => s.id === t.relatedShipmentId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs">{t.date}</TableCell>
                        <TableCell className="font-mono text-xs">{shipment?.reference ?? "—"}</TableCell>
                        <TableCell className="text-xs">{shipment?.customerName ?? t.description}</TableCell>
                        <TableCell>
                          <StatusBadge status={t.status === "cleared" ? "ok" : t.status === "pending" ? "info" : "warning"} label={t.status} />
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-medium">+ KES {t.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs">{t.date}</TableCell>
                      <TableCell className="text-xs font-medium">{t.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground capitalize">{t.category.replace("_", " ")}</TableCell>
                      <TableCell>
                        <StatusBadge status={t.status === "cleared" ? "ok" : t.status === "pending" ? "info" : "warning"} label={t.status} />
                      </TableCell>
                      <TableCell className="text-right text-rose-600 font-medium">- KES {t.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Outstanding Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shipments.filter((s) => s.status === "delivered" || s.status === "in_transit").map((s) => {
                  const txn = txns.find((t) => t.relatedShipmentId === s.id && t.type === "income");
                  if (!txn) return null;
                  return (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className={`rounded-lg p-2 ${txn.status === "cleared" ? "bg-emerald-500/10 text-emerald-600" : txn.status === "pending" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}>
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium">{s.reference}</span>
                          <StatusBadge status={txn.status === "cleared" ? "ok" : txn.status === "pending" ? "info" : "warning"} label={txn.status} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.customerName} · {s.origin} → {s.destination}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">KES {txn.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">Issued {txn.date}</div>
                      </div>
                      {txn.status !== "cleared" && <Button size="sm" variant="outline">Send Reminder</Button>}
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
