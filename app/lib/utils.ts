// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export function getSmartStreak(activity: any) {
  const logs = activity.habit_logs
    .filter((l: any) => l.is_complete)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date);

    if (logDate.toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}