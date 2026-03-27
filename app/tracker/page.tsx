"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/app/components/appToast";
import OpenModel from "@/app/components/appModel"
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Plus,
  Trash2,
  Clock,
  Flame,
  BarChart3,
  CalendarDays,
  Trophy,
} from "lucide-react";

import { createSupabaseBrowserClient } from "../lib/client";
const supabase = createSupabaseBrowserClient();
import { getActivityLevel } from "../lib/levels";

/* =========================
   Activity Card
========================= */
const getLocalDate = (date = new Date()) => {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
};


const celebrate = () => {
  // center burst
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
  });

  // side blasts
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });

  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });
};

const getToday = () => getLocalDate();
const getMonthGrid = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (string | null)[] = [];

  // empty boxes
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // actual dates
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    days.push(getLocalDate(d));
  }

  return days;
};

const hasMarkedToday = (activity: any) => {
  return activity.habit_logs?.some(
    (l: any) => l.date === getToday() && l.is_complete
  );
};


// 🔥 MISS COUNT
const getMissCount = (completedDates) => {
  const set = new Set(completedDates);

  let miss = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDate(d);

    if (!set.has(dateStr)) {
      miss++;
    } else {
      break;
    }
  }

  return miss;
};

// 🔥 ADVANCED DECAY
const applyAdvancedDecay = (prevStreak, missCount, currentStreak) => {

  // 🔥 MASTER CASE
  if (prevStreak >= 7 && prevStreak < 21) {
    return 1 + (currentStreak - 1);
  }

  let base = 0;

  if (prevStreak >= 100) base = 50;
  else if (prevStreak >= 50) base = 21;
  else if (prevStreak >= 21) base = 7;
  else base = 1; // 🔥 default min

  // 🔥 MULTI MISS
  if (missCount >= 2) {
    if (base === 50) base = 21;
    else if (base === 21) base = 7;
    else if (base === 7) base = 1;
  }

  // 🔥 HARD RESET PREVENT
  if (missCount >= 3) {
    return 1 + (currentStreak - 1);
  }

  return Math.max(1, base + (currentStreak - 1));
};



const getSmartStreak = (activity) => {
  const completedDates = activity.habit_logs
    .filter((l) => l.is_complete)
    .map((l) => l.date);

  const completedSet = new Set(completedDates); // 🔥 fast

  const getDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return getLocalDate(d);
  };

  // 🔥 CURRENT STREAK
  let streak = 0;
  let i = 0;

  while (i < 365) {
    const date = getDate(i);

    if (completedSet.has(date)) {
      streak++;
      i++;
    } else break;
  }

  // 🔥 PREVIOUS STREAK
  let prevStreak = 0;
  let j = i + 1;

  while (j < 365) {
    const date = getDate(j);

    if (completedSet.has(date)) {
      prevStreak++;
      j++;
    } else break;
  }

  // 🔥 MISS COUNT
  let missCount = 0;
  let k = 0;

  while (k < 365) {
    const date = getDate(k);

    if (!completedSet.has(date)) {
      missCount++;
      k++;
    } else break;
  }

  if (streak === 0) {
    return 0;
  }

  return applyAdvancedDecay(prevStreak, missCount, streak);
};


const getTodayEntries = (activity: any) => {
  return activity.habit_logs?.filter(
    (l: any) => l.date === getToday()
  );
};

type Activity = {
  id: string;
  name: string;
  habit_logs: {
    id: string;
    date: string;
    is_complete: boolean;
    completed_time?: string;
  }[];
};

const ActivityCard = ({
  activity,
  onMark,
  onDelete,
}: {
  activity: Activity;
  onMark: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  console.log(activity.habit_logs);
  const done = hasMarkedToday(activity);
  const [currentDate, setCurrentDate] = useState(new Date());


const goPrevMonth = () => {
  setCurrentDate((prev) => {
    const d = new Date(prev);
    d.setMonth(d.getMonth() - 1);
    return d;
  });
};

const goNextMonth = () => {
  setCurrentDate((prev) => {
    const d = new Date(prev);
    d.setMonth(d.getMonth() + 1);
    return d;
  });
};
//   const streak = useMemo(() => {
//   return getSmartStreak(activity);
// }, [activity.habit_logs.length]);
const streak = getSmartStreak(activity);
 const calendarDays = useMemo(() => {
  return getMonthGrid(currentDate);
}, [currentDate]);
  const todayEntries = getTodayEntries(activity);
  const level = getActivityLevel(streak);

  return (

    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: -30 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {/* <div className="flex items-center gap-3">
          <h2
            className="text-lg sm:text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {activity.name}
          </h2>

          <span className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {level.emoji} {level.title}
          </span>
        </div> */}
        <div className="flex items-center gap-3">
  <div>
    <h2
      className="text-lg sm:text-xl font-bold text-foreground"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {activity.name}
    </h2>

    {/* 🔥 ADD THIS EXACTLY HERE */}
    <p className="text-xs text-gray-400 mt-1">
      ⏰ {activity.scheduled_time || "Not set"} 
    </p>
  </div>

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
          onClick={() => {
  // if (!done) {
  //   celebrate(); // 🎉 confetti
  //   onMark(activity.id);
 

  if (!done) {
    onMark(activity.id);
  
  }  
}}
        >
          {/* <div
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
          </div> */}

          {/* <span
            className={`text-sm font-medium ${
              done ? "text-primary" : "text-muted-foreground"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {done ? "Completed today ✓" : "Mark as done"}
          </span> */}
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
              {activity.habit_logs.filter((log) => log.is_complete).length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              total
            </div>
          </div>
        </div>
      </div>

      {/* Today Entries */}
      {todayEntries.some((e) => e.is_complete) && (
  <div className="mb-6">
    <div className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground opacity-70">
      <Clock size={10} />
      Today
    </div>

    <div className="flex flex-wrap gap-2">
      {todayEntries
        .filter((e) => e.is_complete) // 🔥 only completed
        .map((entry, i) => (
          <span
            key={i}
            className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
          >
            {entry.completed_time
              ? new Date(entry.completed_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        ))}
    </div>
  </div>
)}

      {/* 30 Day Grid */}
      <div className="mt-4">
      
  {/* Month Header */}
<div className="flex items-center justify-between mb-3">
  <button onClick={goPrevMonth} className="px-3 py-1 bg-secondary rounded">
    ◀
  </button>

  <h3 className="text-sm text-muted-foreground">
    {currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}
  </h3>

  <button onClick={goNextMonth} className="px-3 py-1 bg-secondary rounded">
    ▶
  </button>
</div>

{/* Calendar Grid */}
<AnimatePresence mode="wait">
  <motion.div
    key={currentDate.toISOString()}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.25 }}
    className="grid grid-cols-7 gap-2"
  >
    {calendarDays.map((day, index) => {
  if (!day) return <div key={index} />;

  const log = activity.habit_logs.find((l) => l.date === day);

  return (
    <div
      key={day}
      title={day}
      className={`h-8 w-full rounded flex items-center justify-center text-[10px] ${
        log?.is_complete
          ? "bg-primary text-primary-foreground"
          : "bg-[hsl(0_0%_100%/0.12)] text-muted-foreground"
      }${day === getToday() ? "ring-1 ring-primary" : ""}`}
    >
      {new Date(day).getDate()}
    </div>
  );
})}
  </motion.div>
</AnimatePresence>
    
      </div>
    </motion.div>
  );
};

/* =========================
   Tracker Page
========================= */

export default function TrackerPage() {
  
const [activities, setActivities] = useState<any[]>([]);
const router = useRouter();
const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const handleDelete = (id: string) => {
  setDeleteId(id);
};
const isWithinTime = (scheduledTime: string) => {
  if (!scheduledTime) return true;

  const now = new Date();

  const [h, m] = scheduledTime.split(":").map(Number);

  let task = new Date();
  task.setHours(h, m, 0, 0);

  // 🔥 PAST → TOMORROW
  if (task < now) {
    task.setDate(task.getDate() + 1);
  }

  const before = new Date(task.getTime() - 60 * 60 * 1000);
  const after = new Date(task.getTime() + 60 * 60 * 1000);

  return now >= before && now <= after;
};

const handleMark = async (habitId: string) => {

   const habit = activities.find((h) => h.id === habitId);

  // 🔥 TIME CHECK
  if (habit?.scheduled_time && !isWithinTime(habit.scheduled_time)) {
    showToast.error("⏰ You can mark only within your scheduled time!");
    return;
  }

const today = getToday();
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", habitId)
    .eq("date", today)
    .maybeSingle();

  if (existing?.is_complete) {
  showToast.info("Already done today 😄");
  return;
}

  const now = new Date().toISOString();

  // ✅ CASE 1: ROW EXISTS → UPDATE (🔥 THIS WAS MISSING)
  // if (existing) {
  //   // UI update
  //   setActivities((prev) =>
  //     prev.map((h) =>
  //       h.id === habitId
  //         ? {
  //             ...h,
  //             habit_logs: h.habit_logs.map((log: any) =>
  //               log.date === today
  //                 ? {
  //                     ...log,
  //                     is_complete: true,
  //                     completed_time: now,
  //                   }
  //                 : log
  //             ),
  //           }
  //         : h
  //     )
  //   );

  //   // DB update
  //   await supabase
  //     .from("habit_logs")
  //     .update({
  //       is_complete: true,
  //       completed_time: now,
  //     })
  //     .eq("id", existing.id);
  // }

  if (existing) {
  // 🔥 ONLY UPDATE (no duplicate)
  await supabase
    .from("habit_logs")
    .update({
      is_complete: true,
      completed_time: now,
    })
    .eq("id", existing.id);

  setActivities((prev) =>
    prev.map((h) =>
      h.id === habitId
        ? {
            ...h,
            habit_logs: h.habit_logs.map((log) =>
              log.id === existing.id
                ? { ...log, is_complete: true, completed_time: now }
                : log
            ),
          }
        : h
    )
  );
}
  // ✅ CASE 2: NO ROW → INSERT
 else if (!existing) {
    setActivities((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              habit_logs: [
                ...h.habit_logs,
                {
                  id: Math.random().toString(),
                  date: today,
                  is_complete: true,
                  completed_time: now,
                },
              ],
            }
          : h
      )
    );

    await supabase.from("habit_logs").insert([
      {
        habit_id: habitId,
        date: today,
        is_complete: true,
        completed_time: now,
      },
    ]);
  }


  // 🔥 GET ALL LOGS
const { data: logs } = await supabase
  .from("habit_logs")
  .select("*")
  .eq("habit_id", habitId);

// 🔥 CALCULATE STREAK
const completedDates = logs
  .filter((l) => l.is_complete)
  .map((l) => l.date)
  .sort()
  .reverse();

// const streak = getSmartStreak({
//   habit_logs: logs,
// });
const streak = getSmartStreak({
  habit_logs: logs,
}) || 0;

// 🔥 GET LEVELS
const { data: levels } = await supabase
  .from("levels")
  .select("*")
  .order("days", { ascending: true });

let newLevel = levels[0];

for (let lvl of levels) {
  if (streak >= lvl.days) {
    newLevel = lvl;
  }
}

// 🔥 UPDATE HABIT LEVEL
await supabase
  .from("habits")
  .update({ level: newLevel.id })
  .eq("id", habitId);
  showToast.success("Completed today ✅");
  celebrate();
};



// const handleDelete = async (id: string) => {
//   // if (!confirm("Delete this activity?")) return;

//     if (typeof window !== "undefined") {
//     if (!window.confirm("Delete this activity?")) return;
//   }


//   // ⚡ remove from UI
//   setActivities((prev) => prev.filter((h) => h.id !== id));

//   // 🧠 if temp id → skip DB
//   if (id.length < 20) return; // 🔥 temp id check

//   // 🔥 DB delete
//   const { error } = await supabase
//     .from("habits")
//     .delete()
//     .eq("id", id);

//   if (error) {
//     console.log("DELETE ERROR:", error);
//      showToast.error("Delete failed ❌");
//     loadHabits();
//   }
// };

const confirmDelete = async () => {
  if (!deleteId) return;

  setDeleteLoading(true);

  // UI remove
  setActivities((prev) => prev.filter((h) => h.id !== deleteId));

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", deleteId);

  if (error) {
    showToast.error("Delete failed ❌");
    loadHabits(); // rollback
  } else {
    showToast.success("Habit deleted 🗑️");
  }

  setDeleteLoading(false);
  setDeleteId(null);
};


const handleAdd = async () => {
  if (!newName.trim()) return;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  // if (!user) return;

  if (!user) {
  setLoading(false); // 🔥 important
  return;
}

  const name = newName.trim();

  // 🔥 UI duplicate check
  const alreadyExists = activities.some(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    showToast.error("Habit already exists ⚠️");
    return;
  }



  setNewName("");
  setShowAdd(false);

  // 🔥 DB INSERT
  const { data, error } = await supabase
    .from("habits")
    .insert([
      {
        user_id: user.id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  // 🔥 DB duplicate safety
  if (error) {
    if (error.code === "23505") {
      showToast.error("Habit already exists ⚠️");

    } else {
       showToast.error("Insert failed ❌");
    }
    return;
  }
const today = getToday();
  // 🔥 LOG INSERT
  await supabase.from("habit_logs").insert([
    {
      habit_id: data.id,
      date: today,
      is_complete: false,
    },
  ]);

  // ✅ ADD ONLY HERE
  setActivities((prev) => [
    ...prev,
    {
      id: data.id,
      name,
      habit_logs: [
        {
          id: Math.random().toString(),
          date: today,
          is_complete: false,
        },
      ],
    },
  ]);
  showToast.success("Habit added 🔥");
};


// const loadLevels = async () => {
//   const { data } = await supabase
//     .from("levels")
//     .select("*")
//     .order("days", { ascending: true });

//   setLevels(data || []);
// };



const loadHabits = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return;

  const { data } = await supabase
    .from("habits")
    .select(`
      id,
      name,
      scheduled_time,
      habit_logs (
        id,
        date,
        is_complete,
        completed_time
      )
    `)
    .eq("user_id", user.id);

  setActivities(data || []);
   return data || [];
};

// useEffect(() => {
//   loadHabits();
// }, []);

// useEffect(() => {
//   const load = async () => {
//     await loadHabits();
//     setLoading(false);
//   };
//   load();
// }, []);
useEffect(() => {
  const load = async () => {
    const data = await loadHabits();
    setLoading(false);

    // 🔥 ONLY AFTER DATA
    if (!data || data.length === 0) {
      router.push("/habit");
    }
  };

  load();
}, []);

useEffect(() => {
  if (!loading && activities.length === 0) {
    router.push("/habit");
  }
}, [activities, loading]);

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

          {/* <div className="mt-8 flex flex-wrap justify-center gap-3">
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
          </div> */}
        </div>

        {/* Activity List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => (
              <ActivityCard
                // key={activity.id}
                  key={activity.id || activity.name}
                activity={activity}
                onMark={handleMark}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add Activity */}
        {/* <div className="mt-10">
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
                className="flex-1 rounded border border-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <button
                type="submit"
                className="rounded bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded border border-border px-6 py-3 text-sm text-muted-foreground hover:bg-secondary"
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
        </div> */}
      </div>
<OpenModel
  open={!!deleteId}
  onClose={() => setDeleteId(null)}
    maxWidth="sm"  
  title={
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <div>
        <h2 className="text-base font-semibold">Delete Habit</h2>
        <p className="text-xs text-muted-foreground">This action is permanent</p>
      </div>
    </div>
  }
  actions={
    <div className="flex gap-2">
      <button
        onClick={() => setDeleteId(null)}
        className="flex-1 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border hover:bg-secondary/60 transition-all text-sm font-medium"
      >
        Cancel
      </button>

      <button
        onClick={confirmDelete}
        disabled={deleteLoading}
        className="flex-1 px-3 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/80 transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        {deleteLoading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Deleting
          </>
        ) : (
          "Delete"
        )}
      </button>
    </div>
  }
>
  <div className="space-y-3">
    {/* Warning Message */}
    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/15">
      <svg className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        Are you sure? This habit and its progress will be permanently deleted.
      </p>
    </div>

    {/* Quick Info */}
    
  </div>
</OpenModel>
 
    </motion.div>

    
  );
}