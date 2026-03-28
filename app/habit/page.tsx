"use client";

import { useState, useEffect } from "react";
import { FiClock, FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "../lib/client";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OpenModel from "@/app/components/appModel"
const supabase = createSupabaseBrowserClient();

function isWithinTimeRange(taskTime, range = 1) {
  if (!taskTime) return false;

  const now = new Date();

  const [hours, minutes] = taskTime.split(":").map(Number);

  let task = new Date();
  task.setHours(hours, minutes, 0, 0);

  // 🔥 PAST TIME → TOMORROW
  if (task < now) {
    task.setDate(task.getDate() + 1);
  }

  const before = new Date(task.getTime() - range * 60 * 60 * 1000);
  const after = new Date(task.getTime() + range * 60 * 60 * 1000);

  return now >= before && now <= after;
}

export default function MeditationUI() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
   const [isStarted, setIsStarted] = useState(false);
  const [isActiveTime, setIsActiveTime] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("11:00");
  const [timeValue, setTimeValue] = useState(dayjs());
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  useEffect(() => {
  const checkAccess = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { data: habit } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", "Meditating")
      .maybeSingle();

    if (!habit) return;
    if (habit?.is_locked) {
  setIsLocked(true); // 🔥 refresh apramum lock
}
    // 🔥 set correct time from DB
const t = dayjs(habit.scheduled_time, "HH:mm");
setTimeValue(t);

    const taskTime = habit.scheduled_time;

 const today = new Date().toLocaleDateString("en-CA");

// 🔥 check today's log
let { data: log } = await supabase
  .from("habit_logs")
  .select("*")
  .eq("habit_id", habit.id)
  .eq("date", today)
  .maybeSingle();

// 🔥 FIX: if no log → create one
if (!log) {
  const { data: newLog } = await supabase
    .from("habit_logs")
    .insert([
      {
        habit_id: habit.id,
        date: today,
        is_complete: false,
      },
    ])
    .select()
    .single();

  log = newLog;
}

// 🔥 if already started → restore state
if (log && !log.is_complete) {

  // 🔥 ONLY inside time allow
  if (isWithinTimeRange(taskTime)) {
    setIsStarted(true);
    setIsActiveTime(true);
    return;
  }

  // ❌ outside time → tracker
  router.replace("/tracker");
  return;
}

// 🔥 time check
if (!isWithinTimeRange(taskTime)) {
  router.replace("/tracker");
  return;
}

// ✅ allow habit page
setIsActiveTime(true);
  };

  checkAccess();
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === "inhale") return "hold";
        if (prev === "hold") return "exhale";
        return "inhale";
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const breathScale = {
    inhale: 1.1,
    hold: 1.15,
    exhale: 1,
  };


const convertTo24 = () => {
  return timeValue.format("HH:mm");
};

const handleStart = async () => {

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const today = new Date().toLocaleDateString("en-CA");
  const now = new Date().toISOString();

  const { data: existingHabit } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("name", "Meditating")
    .maybeSingle();

  let habitId;

  if (!existingHabit) {
    const { data: newHabit } = await supabase
      .from("habits")
      .insert([
        {
          user_id: user.id,
          name: "Meditating",
          scheduled_time: convertTo24(),
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    habitId = newHabit.id;

    await supabase.from("habit_logs").insert([
      {
        habit_id: habitId,
        date: today,
        is_complete: false,
      },
    ]);
  } else {
    habitId = existingHabit.id;
  }

  // 🔥 FIRST CLICK → JUST START
  // if (!isStarted) {
  //   setIsStarted(true);
  //   return; // ❌ STOP HERE (no redirect)
  // }

  const isValidNow = isWithinTimeRange(convertTo24());

if (!isStarted) {
  setIsStarted(true);
  // 🔥 KEY LOGIC
  if (!isValidNow) {
    router.push("/tracker"); // ❌ only outside time
  }

  return;
}

  // 🔥 SECOND CLICK → COMPLETE
  await supabase
    .from("habit_logs")
    .update({
      is_complete: true,
      completed_time: now,
    })
    .eq("habit_id", habitId)
    .eq("date", today);

  router.push("/tracker"); // ✅ only now redirect
};

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061319] text-white px-4">

      {/* 🔥 CARD */}
      <div className="
        w-full max-w-sm p-8 rounded-3xl text-center space-y-6
        bg-gradient-to-b from-white/5 to-white/0
        backdrop-blur-xl border border-white/10
        shadow-[0_0_40px_rgba(34,197,94,0.15)]
        hover:shadow-[0_0_80px_rgba(34,197,94,0.35)]
        transition-all duration-500
      ">

        {/* 🔥 IMAGE WITH BREATHING + GLOW */}
        <div className="flex justify-center relative">
          <motion.div
            className="
              relative w-48 h-48 flex items-center justify-center rounded-full
              bg-gradient-to-r from-green-500/20 to-emerald-500/20
              border border-green-400/30
              shadow-[0_0_60px_rgba(34,197,94,0.3)]
            "
            animate={{
              scale: breathScale[breathPhase],
              boxShadow: [
                "0 0 40px rgba(34,197,94,0.2)",
                "0 0 100px rgba(34,197,94,0.6)",
                "0 0 40px rgba(34,197,94,0.2)",
              ],
            }}
            transition={{
              scale: { duration: 4, ease: "easeInOut" },
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >

            {/* 🌊 RINGS */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-green-400/30"
                style={{ width: 120 + i * 30, height: 120 + i * 30 }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* 🧘 IMAGE */}
            <motion.img
              src="/guru-meditating.png"
              className="w-32 relative z-10"
              animate={{
                y:
                  breathPhase === "inhale"
                    ? -5
                    : breathPhase === "exhale"
                    ? 5
                    : 0,
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-semibold text-green-400">
            Meditating
          </h1>
          <p className="text-sm text-gray-400">
            Finding inner peace
          </p>
        </div>

        {/* ⏰ TIME PICKER (SINGLE ICON) */}
        <div className="space-y-2 text-left">
          <p className="text-sm text-green-400 flex items-center gap-2">
            <FiClock /> Schedule Time
          </p>

          <div className="relative flex justify-center">
            {/*==============  */}            
<LocalizationProvider dateAdapter={AdapterDayjs}>
<TimePicker
  value={timeValue}
  onChange={(newValue) => setTimeValue(newValue)}
  disabled={isLocked} 
  timeSteps={{ minutes: 1 }}

  slotProps={{
    textField: {
      fullWidth: true,

      InputProps: {
        sx: {
          "& .MuiSvgIcon-root": {
            color: "#4ade80 !important",
          },
        },
      },

      sx: {
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",

        "& .MuiInputBase-root": {
          height: "55px",
          padding: "0 16px",
        },

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(74, 222, 128, 0.2)",
          },

          "&:hover fieldset": {
            borderColor: "rgba(74, 222, 128, 0.4)",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#4ade80 !important",
            boxShadow: "0 0 10px rgba(74, 222, 128, 0.5)",
          },
        },

        "& .MuiPickersSectionList-root": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
        },

        "& .MuiPickersSectionList-root span": {
          fontSize: "18px",
          letterSpacing: "1px",
          fontWeight: 500,
          color: "#fff !important",
        },
      },
    },
  }}
/>
</LocalizationProvider>
           
          </div>
        </div>

        {/* 🚀 BUTTON */}
        <button 
        // onClick={handleStart}
    onClick={() => {
    if (!isStarted) {
      setOpen(true); // 🔥 modal open
    } else {
      handleStart(); // complete
    }
  }}
         className="
          w-full py-4 rounded-full font-medium flex items-center justify-center gap-2
          bg-green-400 text-black text-lg
          shadow-[0_0_25px_rgba(34,197,94,0.4)]
          hover:shadow-[0_0_60px_rgba(34,197,94,0.8)]
          hover:scale-105
          transition-all duration-300
        " >
         {isStarted ? "Complete Task" : "Start Journey"}<FiPlay />
        </button>
<OpenModel
  open={open}
  onClose={() => setOpen(false)}
  title={
    <div className="text-center w-full">
      Task Created
    </div>
  }
  maxWidth="xs"
  actions={
    <div className="flex w-full gap-3">
      <button
        onClick={() => setOpen(false)}
        className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
      >
        Cancel
      </button>

      <button
      onClick={async () => {
  setOpen(false);

  setIsLocked(true); // 🔥 immediate disable

  await handleStart(); // habit create

  // 🔥 DB lock
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (user) {
    await supabase
      .from("habits")
      .update({ is_locked: true })
      .eq("user_id", user.id)
      .eq("name", "Meditating");
  }
}}
        className="flex-1 py-2 rounded-lg bg-green-400 text-black font-medium hover:scale-105 transition"
      >
        Yes Start
      </button>
    </div>
  }
>
  {/* 🔥 CONTENT */}
  <div className="text-center space-y-3">
    <p className="text-gray-300 text-sm">
      Your meditation task has been created.
    </p>

    <p className="text-gray-400 text-sm">
      Please come at your scheduled time 🕒
    </p>

    {/* 🔥 TIME SHOW */}
    <div className="text-green-400 font-semibold text-lg">
      {timeValue.format("hh:mm A")}
    </div>
  </div>
</OpenModel>
      </div>
    </div>
  );
}