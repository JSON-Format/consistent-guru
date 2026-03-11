

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Target, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Legend,
} from "recharts";
import { loadData } from "../lib/consistency";
import {
  getDailyBarData,
  getCumulativeLineData,
  getActivityPieData,
  getYearlyProjections,
  getColorForActivity,
} from "../lib/report-utils";
import { getLifeBenefits } from "../lib/benefits";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthlyReport = () => {
  const data = useMemo(() => loadData(), []);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const barData = useMemo(() => getDailyBarData(data.activities, year, month), [data, year, month]);
  const lineData = useMemo(() => getCumulativeLineData(data.activities, year, month), [data, year, month]);
  const pieData = useMemo(() => getActivityPieData(data.activities, year, month), [data, year, month]);
  const projections = useMemo(() => getYearlyProjections(data.activities, year, month), [data, year, month]);

  const totalEntries = barData.reduce((s, d) => s + d.count, 0);
  const activeDays = barData.filter((d) => d.count > 0).length;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const tooltipStyle = {
    backgroundColor: "hsl(220, 18%, 10%)",
    border: "1px solid hsl(220, 15%, 18%)",
    borderRadius: "8px",
    color: "hsl(150, 10%, 92%)",
    fontSize: "12px",
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 selection:bg-primary/30">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Tracker
          </Link>
          <div className="flex items-center justify-between">
            <h1
              className="text-3xl font-bold text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Monthly Report
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth} 
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="min-w-[140px] text-center text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {MONTHS[month]} {year}
              </span>
              <button 
                onClick={nextMonth} 
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {data.activities.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-20 text-center text-muted-foreground"
          >
            <p className="text-lg">No activities tracked yet</p>
            <Link href="/" className="mt-2 inline-block text-sm text-primary hover:underline">
              Add activities to see reports
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: Calendar, label: "Active Days", value: activeDays },
                { icon: Target, label: "Total Entries", value: totalEntries },
                { icon: TrendingUp, label: "Activities", value: data.activities.length },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <Icon size={18} className="mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    {value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="mb-4 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Daily Activity (Bar Chart)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="hsl(152, 60%, 52%)" radius={[4, 4, 0, 0]} name="Entries" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Line Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="mb-4 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Cumulative Progress (Line Graph)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "hsl(150, 10%, 80%)" }} />
                  {data.activities.map((a, i) => (
                    <Line
                      key={a.id}
                      type="monotone"
                      dataKey={a.name}
                      stroke={getColorForActivity(i)}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="mb-4 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Activity Breakdown (Pie Chart)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent = 0 }) =>
  `${name} ${(percent * 100).toFixed(0)}%`
}
                    labelLine={{ stroke: "hsl(220, 10%, 50%)" }}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Yearly Projection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="mb-2 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                🎯 1-Year Consistency Projection
              </h2>
              <p className="mb-5 text-xs text-muted-foreground">
                Based on your {MONTHS[month]} consistency rate, here's what a full year would look like.
              </p>
              <div className="space-y-4">
                {projections.map((p, i) => {
                  const benefits = getLifeBenefits(p.currentMonthRate);
                  return (
                    <div key={p.name} className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getColorForActivity(i) }} />
                        <span className="font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                          {p.name}
                        </span>
                      </div>
                      <div className="mb-3 grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                            {Math.round(p.currentMonthRate * 100)}%
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            This month
                          </div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                            {p.projectedDaysPerYear}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Days/year
                          </div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                            {p.projectedTotalEntries}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Entries/year
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${p.currentMonthRate * 100}%` }} 
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }} 
                          className="h-full rounded-full bg-primary" 
                        />
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{p.motivationalMessage}</p>
                      {/* Life benefits */}
                      <div className="rounded-lg border border-border bg-background/50 p-3">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
                          What 1 year of this brings
                        </div>
                        <ul className="space-y-1">
                          {benefits.map((b, j) => (
                            <li key={j} className="text-xs text-muted-foreground">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReport;