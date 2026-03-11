"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
} from "lucide-react";

import {
  loadData,
  hasMarkedToday,
  getStreak,
  getTodayEntries,
} from "../lib/consistency";

import { getActivityLevel } from "../lib/levels";

export default function DailyReportPage() {
  const data = useMemo(() => loadData(), []);

  const dayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const activities = data.activities.map((a) => {
    const done = hasMarkedToday(a);
    const streak = getStreak(a);
    const todayEntries = getTodayEntries(a);
    const level = getActivityLevel(streak);
    return { ...a, done, streak, todayEntries, level };
  });

  const completed = activities.filter((a) => a.done).length;
  const total = activities.length;
  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/tracker"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Tracker
          </Link>

          <h1
            className="text-4xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Daily Report
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {dayName}
          </p>
        </motion.div>

        {/* Completion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 text-center"
        >
          <div className="relative mx-auto mb-4 h-28 w-28">

            <svg
              className="h-28 w-28 -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--secondary) / 0.4)"
                strokeWidth="8"
              />

              {/* Animated progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{
                  strokeDashoffset:
                    264 - (264 * completionRate) / 100,
                }}
                transition={{ duration: 1 }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {completionRate}%
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {completed} of {total} activities completed today
          </p>
        </motion.div>

        {/* Activity List */}
        <div className="space-y-4">
          {activities.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4"
            >
              {a.done ? (
                <CheckCircle2
                  size={24}
                  className="shrink-0 text-primary"
                />
              ) : (
                <XCircle
                  size={24}
                  className="shrink-0 text-muted-foreground"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold text-foreground"
                    style={{
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {a.name}
                  </span>

                  <span className="rounded-full bg-secondary/60 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {a.level.emoji} {a.level.title}
                  </span>
                </div>

                {a.todayEntries.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {a.todayEntries.map((e, j) => (
                      <span key={j}>
                        {e.time.slice(0, 5)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-primary">
                <Flame size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {a.streak}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {total === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center text-muted-foreground"
          >
            <p className="text-lg">
              No activities tracked yet
            </p>

            <Link
              href="/tracker"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Add activities first
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}