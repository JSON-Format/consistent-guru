
"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  function isWithinTimeRange(taskTime, range = 1) {
  if (!taskTime) return false;

  const now = new Date();

  const [hours, minutes] = taskTime.split(":").map(Number);

  let task = new Date();
  task.setHours(hours, minutes, 0, 0);

  // 🔥 past → tomorrow
  if (task < now) {
    task.setDate(task.getDate() + 1);
  }

  const before = new Date(task.getTime() - range * 60 * 60 * 1000);
  const after = new Date(task.getTime() + range * 60 * 60 * 1000);

  return now >= before && now <= after;
} 

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const flow = params.get("flow");
      const errorCode = params.get("error_code");

      console.log("CODE:", code);
      console.log("FLOW:", flow);
      console.log("ERROR:", errorCode);

      // ❌ expired link
      if (errorCode === "otp_expired") {
        router.replace("/reset-password?expired=true");
        return;
      }

      if (code) {
        // exchange session
        await supabase.auth.exchangeCodeForSession(code);

        // 🔥 FINAL DECISION
        if (flow === "reset") {
          router.replace("/reset-password");
          return;
        } 
        // ....
        const { data: userData } = await supabase.auth.getUser();
const user = userData.user;

if (!user) {
  router.replace("/login");
  return;
}

// 🔥 check habits
const { data: habits } = await supabase
  .from("habits")
 .select("id, scheduled_time")
  .eq("user_id", user.id);

if (!habits || habits.length === 0) {
  router.replace("/habit"); // no habit
  return;
}

// 🔥 check any habit is within time
const today = new Date().toLocaleDateString("en-CA");

let hasActiveHabit = false;

for (const h of habits) {
  if (!h.scheduled_time) continue;

  // 🔥 check today's log
  const { data: log } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", h.id)
    .eq("date", today)
    .maybeSingle();

  // ❌ already completed → skip
 // 🔥 IF COMPLETED → DIRECT TRACKER
if (log && log.is_complete) {
  router.replace("/tracker");
  return;
}

  // ✅ inside time → allow
  if (isWithinTimeRange(h.scheduled_time)) {
    hasActiveHabit = true;
    break;
  }
}

if (hasActiveHabit) {
  router.replace("/habit");
} else {
  router.replace("/tracker");
}
        // ===

        return;
      }

      // router.replace("/login");
      // 🔥 NO CODE → check existing session
const { data: sessionData } = await supabase.auth.getSession();
const user = sessionData.session?.user;

if (!user) {
  router.replace("/login");
  return;
}

// 🔥 check habits
const { data: habits } = await supabase
  .from("habits")
  .select("id, scheduled_time")
  .eq("user_id", user.id);

if (!habits || habits.length === 0) {
  router.replace("/habit");
  return;
}

// 🔥 check time
const today = new Date().toLocaleDateString("en-CA");

let hasActiveHabit = false;

for (const h of habits) {
  if (!h.scheduled_time) continue;

  const { data: log } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", h.id)
    .eq("date", today)
    .maybeSingle();

  // ❌ skip completed
  // 🔥 IF COMPLETED → DIRECT TRACKER
if (log && log.is_complete) {
  router.replace("/tracker");
  return;
}
  // ✅ allow only valid time
  if (isWithinTimeRange(h.scheduled_time)) {
    hasActiveHabit = true;
    break;
  }
}

if (hasActiveHabit) {
  router.replace("/habit");
} else {
  router.replace("/tracker");
}
    };

    handleAuth();
  }, []);

 return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">

    {/* Animated background particles with your color scheme */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-pulse delay-700"></div>
    </div>

    {/* Main container with card styling */}
    <div className="relative flex flex-col items-center gap-8 rounded-2xl border border-border bg-card/50 p-12 shadow-2xl backdrop-blur-sm">

      {/* 🔥 Enhanced Logo with glow effects */}
      <div className="relative group">
        {/* Glow layers using your primary color */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse"></div>
        
        {/* Logo container with floating animation */}
        <div className="relative animate-float">
          <img
            src="/guru-meditate.png"
            alt="Guru"
            className="relative z-10 h-24 w-24 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Orbiting rings with primary color */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border border-primary/10 animate-spin-slower"></div>
        </div>
      </div>

      {/* 🔄 Enhanced Spinner with multiple rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer rings */}
        <div className="absolute h-16 w-16 rounded-full border-4 border-primary/10 animate-ping"></div>
        <div className="absolute h-14 w-14 rounded-full border-4 border-primary/20 animate-pulse"></div>
        
        {/* Main spinner */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-spin border-t-transparent border-r-transparent"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-spin-slow border-b-transparent border-l-transparent"></div>
        </div>
        
        {/* Inner dot */}
        <div className="absolute h-3 w-3 animate-pulse rounded-full bg-primary"></div>
      </div>

      {/* ✨ Enhanced Text with animations */}
      <div className="space-y-2 text-center">
        <p className="font-display text-lg font-medium text-primary animate-gradient">
          Authenticating...
        </p>
        
        {/* Loading dots with primary color */}
        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60"></div>
        </div>
        
        {/* Subtle status message using muted foreground */}
        <p className="mt-4 animate-pulse font-body text-xs text-muted-foreground">
          Securing your session
        </p>
      </div>

      {/* Progress bar alternative design */}
      <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-2/3 animate-progress rounded-full bg-primary"></div>
      </div>

    </div>
  </div>
);
}