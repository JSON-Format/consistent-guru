

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Clock,
  Flame,
  BarChart3,
  CalendarDays,
  Trophy,
} from "lucide-react";

import {
  loadData,
  addActivity,
  deleteActivity,
  markActivity,
  hasMarkedToday,
  getStreak,
  getLast30Days,
  getTodayEntries,
  type TrackerData,
  type Activity,
} from "../lib/consistency";

import { getActivityLevel } from "../lib/levels";

/* =========================
   Activity Card
========================= */

const ActivityCard = ({
  activity,
  onMark,
  onDelete,
}: {
  activity: Activity;
  onMark: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const done = hasMarkedToday(activity);
  const streak = getStreak(activity);
  const last30 = getLast30Days();
  const todayEntries = getTodayEntries(activity);
  const uniqueDates = new Set(activity.entries.map((e) => e.date));
  const level = getActivityLevel(streak);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2
            className="text-lg sm:text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {activity.name}
          </h2>

          <span className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {level.emoji} {level.title}
          </span>
        </div>

        <button
          onClick={() => onDelete(activity.id)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Checkbox + Stats */}
      <div className="mb-6 flex items-center">
        {/* Checkbox */}
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => !done && onMark(activity.id)}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded border transition-all duration-300 ${
              done
                ? "bg-primary border-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                : "border-primary/60 bg-transparent hover:border-primary"
            }`}
          >
            {done && (
              <svg
                className="h-4 w-4 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <span
            className={`text-sm font-medium ${
              done ? "text-primary" : "text-muted-foreground"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {done ? "Completed today ✓" : "Mark as done"}
          </span>
        </div>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <div
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {streak}
            </div>
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <Flame size={10} />
              streak
            </div>
          </div>

          <div className="text-center">
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {activity.entries.length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              total
            </div>
          </div>
        </div>
      </div>

      {/* Today Entries */}
      {todayEntries.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground opacity-70">
            <Clock size={10} />
            Today
          </div>

          <div className="flex flex-wrap gap-2">
            {todayEntries.map((entry, i) => (
              <span
                key={i}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
              >
                {entry.time.slice(0, 5)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 30 Day Grid */}
      <div className="mt-4 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2">
        {last30.map((day) => (
          <div
            key={day}
            title={day}
            className={`h-7 w-full rounded transition-all duration-300 ${
              uniqueDates.has(day)
                ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
                : "bg-[hsl(0_0%_100%/0.12)]"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* =========================
   Tracker Page
========================= */

export default function TrackerPage() {
  const [data, setData] = useState<TrackerData>(loadData);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleMark = useCallback((id: string) => {
    setData({ ...markActivity(id) });
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm("Delete this activity?")) {
      setData({ ...deleteActivity(id) });
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    setData({ ...addActivity(newName) });
    setNewName("");
    setShowAdd(false);
  }, [newName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background px-4 py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stay Consistent
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Track your daily habits. Every press counts.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/daily-report"
              className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary"
            >
              <CalendarDays size={16} /> Daily Report
            </Link>

            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary"
            >
              <BarChart3 size={16} /> Monthly Report
            </Link>

            <Link
              href="/levels"
              className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary"
            >
              <Trophy size={16} /> Levels
            </Link>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {data.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onMark={handleMark}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add Activity */}
        <div className="mt-10">
          {showAdd ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Activity name..."
                className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus size={18} /> Add Activity
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}