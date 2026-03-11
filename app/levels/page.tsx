"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

import { loadData, getStreak } from "../lib/consistency";
import {
  LEVELS,
  getActivityLevel,
  getNextLevel,
  getLevelProgress,
} from "../lib/levels";

export default function Levels() {
  const data = useMemo(() => loadData(), []);

  const activities = data.activities.map((a) => {
    const streak = getStreak(a);
    const level = getActivityLevel(streak);
    const next = getNextLevel(streak);
    const progress = getLevelProgress(streak);

    return { ...a, streak, level, next, progress };
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8 selection:bg-primary/30">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/tracker"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Tracker
          </Link>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Achievement Levels
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Build streaks to unlock higher levels of mastery
          </p>
        </motion.div>

        {/* Level Tier Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
        >
          {LEVELS.map((l) => (
            <div
              key={l.level}
              className="rounded-xl border border-border bg-card p-3 text-center"
            >
              <div className="text-2xl">{l.emoji}</div>
              <div className="mt-1 text-xs font-bold text-foreground">
                {l.title}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {l.minStreak}+ days
              </div>
            </div>
          ))}
        </motion.div>

        {/* Activities Section */}
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center text-muted-foreground"
          >
            <p className="text-lg">No activities yet</p>

            <Link
              href="/tracker"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Add activities to start leveling up
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {activities.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 sm:p-5"
              >
                {/* Title Row */}
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    {a.name}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {a.streak} day streak
                  </span>
                </div>

                {/* Milestones */}
                <div className="mb-4 grid grid-cols-5 gap-2 sm:flex sm:items-center sm:gap-3" style={{justifyContent:"space-around"}}>
                  {LEVELS.map((l) => {
                    const unlocked = a.streak >= l.minStreak;

                    return (
                      <div
                        key={l.level}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base transition-all ${
                            unlocked
                              ? "border-primary bg-primary/20"
                              : "border-border bg-secondary/30"
                          }`}
                        >
                          {unlocked ? (
                            l.emoji
                          ) : (
                            <Lock size={12} className="text-muted-foreground" />
                          )}
                        </div>

                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            unlocked
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {l.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Section */}
                <div className="mb-2">
                  <div className="mb-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
                    <span>
                      {a.level.emoji} {a.level.title}
                    </span>

                    <span>
                      {a.next
                        ? `${a.next.emoji} ${a.next.title} (${a.next.minStreak} days)`
                        : "Max level!"}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {a.level.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}