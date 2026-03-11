import { type Activity } from "./consistency";

export interface DailyCount {
  day: string; // "1", "2", ...
  count: number;
}

export interface ActivityBreakdown {
  name: string;
  count: number;
  fill: string;
}

const CHART_COLORS = [
  "hsl(152, 60%, 52%)",
  "hsl(200, 70%, 55%)",
  "hsl(280, 60%, 60%)",
  "hsl(35, 80%, 55%)",
  "hsl(340, 65%, 55%)",
  "hsl(170, 55%, 45%)",
  "hsl(50, 75%, 55%)",
  "hsl(220, 65%, 58%)",
];

export function getMonthDays(year: number, month: number): string[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push(dateStr);
  }
  return days;
}

/** Bar chart: total entries per day of the month */
export function getDailyBarData(activities: Activity[], year: number, month: number): DailyCount[] {
  const days = getMonthDays(year, month);
  return days.map((dateStr) => {
    const dayNum = parseInt(dateStr.split("-")[2], 10);
    let count = 0;
    for (const a of activities) {
      count += a.entries.filter((e) => e.date === dateStr).length;
    }
    return { day: String(dayNum), count };
  });
}

/** Line chart: cumulative streak days per activity over the month */
export interface CumulativeData {
  day: string;
  [activityName: string]: string | number;
}

export function getCumulativeLineData(activities: Activity[], year: number, month: number): CumulativeData[] {
  const days = getMonthDays(year, month);
  return days.map((dateStr) => {
    const dayNum = parseInt(dateStr.split("-")[2], 10);
    const row: CumulativeData = { day: String(dayNum) };
    for (const a of activities) {
      const daysUpTo = days.slice(0, dayNum);
      const activeDays = daysUpTo.filter((d) => a.entries.some((e) => e.date === d)).length;
      row[a.name] = activeDays;
    }
    return row;
  });
}

/** Pie chart: breakdown of total entries per activity this month */
export function getActivityPieData(activities: Activity[], year: number, month: number): ActivityBreakdown[] {
  const days = getMonthDays(year, month);
  return activities.map((a, i) => ({
    name: a.name,
    count: a.entries.filter((e) => days.includes(e.date)).length,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

/** Monthly completion rate (unique active days / days in month) */
export function getMonthlyCompletionRate(activity: Activity, year: number, month: number): number {
  const days = getMonthDays(year, month);
  const activeDays = new Set(activity.entries.filter((e) => days.includes(e.date)).map((e) => e.date));
  return days.length > 0 ? activeDays.size / days.length : 0;
}

/** 1-year projection based on current month's consistency */
export interface YearlyProjection {
  name: string;
  currentMonthRate: number; // 0-1
  projectedDaysPerYear: number;
  projectedTotalEntries: number;
  motivationalMessage: string;
}

export function getYearlyProjections(activities: Activity[], year: number, month: number): YearlyProjection[] {
  return activities.map((a) => {
    const days = getMonthDays(year, month);
    const activeDays = new Set(a.entries.filter((e) => days.includes(e.date)).map((e) => e.date));
    const totalEntries = a.entries.filter((e) => days.includes(e.date)).length;
    const daysInMonth = days.length;
    const rate = daysInMonth > 0 ? activeDays.size / daysInMonth : 0;
    const projectedDays = Math.round(rate * 365);
    const avgEntriesPerDay = activeDays.size > 0 ? totalEntries / activeDays.size : 0;
    const projectedEntries = Math.round(projectedDays * avgEntriesPerDay);

    let msg: string;
    if (rate >= 0.9) msg = "🔥 Incredible! You're on track for elite-level consistency!";
    else if (rate >= 0.7) msg = "💪 Strong pace! Keep pushing for daily streaks.";
    else if (rate >= 0.5) msg = "📈 Good start! More consistency will compound your results.";
    else if (rate >= 0.2) msg = "🌱 Building momentum. Try to show up more often!";
    else msg = "⏳ Just getting started. Every day counts!";

    return {
      name: a.name,
      currentMonthRate: rate,
      projectedDaysPerYear: projectedDays,
      projectedTotalEntries: projectedEntries,
      motivationalMessage: msg,
    };
  });
}

export function getColorForActivity(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
