
// "use client";

// import { useEffect } from "react";
// import { createSupabaseBrowserClient } from "../../lib/client";
// import { useRouter } from "next/navigation";
// import AppLoader from "@/app/components/appLoader";

// export default function CallbackPage() {
//   const supabase = createSupabaseBrowserClient();
//   const router = useRouter();
//   function isWithinTimeRange(taskTime: string, range = 1) {
//   if (!taskTime) return false;

//   const now = new Date();

//   const [hours, minutes] = taskTime.split(":").map(Number);

//   const task = new Date();
//   task.setHours(hours, minutes, 0, 0);

//   const before = new Date(task.getTime() - range * 60 * 60 * 1000);
//   const after = new Date(task.getTime() + range * 60 * 60 * 1000);

//   return now >= before && now <= after;
// }

//   useEffect(() => {
//     const handleAuth = async () => {
//       const params = new URLSearchParams(window.location.search);

//       const code = params.get("code");
//       const flow = params.get("flow");
//       const errorCode = params.get("error_code");

//       console.log("CODE:", code);
//       console.log("FLOW:", flow);
//       console.log("ERROR:", errorCode);

//       // ❌ expired link
//       if (errorCode === "otp_expired") {
//         router.replace("/reset-password?expired=true");
//         return;
//       }

//       if (code) {
//         // exchange session
//         await supabase.auth.exchangeCodeForSession(code);

//         // 🔥 FINAL DECISION
//         if (flow === "reset") {
//           router.replace("/reset-password");
//           return;
//         }
//         // ....
//         const { data: userData } = await supabase.auth.getUser();
//         const user = userData.user;

//         if (!user) {
//           router.replace("/login");
//           return;
//         }

//         // 🔥 check habits
//         const { data: habits } = await supabase
//           .from("habits")
//           .select("id, scheduled_time")
//           .eq("user_id", user.id);

//         if (!habits || habits.length === 0) {
//           router.replace("/habit"); // no habit
//           return;
//         }

//         // 🔥 check any habit is within time
//         const today = new Date().toISOString().split("T")[0];

//         let hasActiveHabit = false;

//         for (const h of habits) {
//           if (!h.scheduled_time) continue;

//           // 🔥 check today's log
//           const { data: log } = await supabase
//             .from("habit_logs")
//             .select("*")
//             .eq("habit_id", h.id)
//             .eq("date", today)
//             .maybeSingle();

//           // ❌ already completed → skip
//           // 🔥 IF COMPLETED → DIRECT TRACKER
//           if (log && log.is_complete) {
//             router.replace("/tracker");
//             return;
//           }

//           // ✅ inside time → allow
//           if (isWithinTimeRange(h.scheduled_time)) {
//             hasActiveHabit = true;
//             break;
//           }
//         }

//         if (hasActiveHabit) {
//           router.replace("/habit");
//         } else {
//           router.replace("/tracker");
//         }
//         // ===

//         return;
//       }

//       // router.replace("/login");
//       // 🔥 NO CODE → check existing session
//       const { data: sessionData } = await supabase.auth.getSession();
//       const user = sessionData.session?.user;

//       if (!user) {
//         router.replace("/login");
//         return;
//       }

//       // 🔥 check habits
//       const { data: habits } = await supabase
//         .from("habits")
//         .select("id, scheduled_time")
//         .eq("user_id", user.id);

//       if (!habits || habits.length === 0) {
//         router.replace("/habit");
//         return;
//       }

//       // 🔥 check time
//       const today = new Date().toISOString().split("T")[0];

//       let hasActiveHabit = false;

//       for (const h of habits) {
//         if (!h.scheduled_time) continue;

//         const { data: log } = await supabase
//           .from("habit_logs")
//           .select("*")
//           .eq("habit_id", h.id)
//           .eq("date", today)
//           .maybeSingle();

//       const isCompleted = log?.is_complete;
// const isInTime = isWithinTimeRange(h.scheduled_time);

// if (!isCompleted && isInTime) {
//   hasActiveHabit = true;
//   break;
// }
//       }

//       if (hasActiveHabit) {
//         router.replace("/habit");
//       } else {
//         router.replace("/tracker");
//       }
//     };

//     handleAuth();
//   }, []);

//   return (
// <AppLoader />
    
//   );
// }




"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useRouter } from "next/navigation";
import AppLoader from "@/app/components/appLoader";

export default function CallbackPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const flow = params.get("flow");
      const errorCode = params.get("error_code");

      // ❌ expired reset link
      if (errorCode === "otp_expired") {
        router.replace("/reset-password?expired=true");
        return;
      }

      if (code) {
        // 🔥 exchange session (VERY IMPORTANT)
        await supabase.auth.exchangeCodeForSession(code);

        // 🔐 reset password flow
        if (flow === "reset") {
          router.replace("/reset-password");
          return;
        }

        // 🔥 get user
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
          router.replace("/login");
          return;
        }

        // 🔥 check if first-time user (no habits)
        const { data: habits } = await supabase
          .from("habits")
          .select("id")
          .eq("user_id", user.id);

        // 🆕 first-time → go to habit page
        if (!habits || habits.length === 0) {
          router.replace("/habit");
          return;
        }

        // 🔁 existing user → go home (home decides next)
        router.replace("/");
        return;
      }

      // fallback (no code)
      router.replace("/login");
    };

    handleAuth();
  }, []);

  return <AppLoader />;
}