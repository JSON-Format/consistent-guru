import { type Activity } from "./consistency";

export interface Level {
  level: number;
  title: string;
  emoji: string;
  minStreak: number;
  description: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: "Guru", emoji: "🧘", minStreak: 0, description: "The journey begins. Show up every day." },
  { level: 2, title: "Master", emoji: "⚔️", minStreak: 7, description: "7-day streak. Discipline is forming." },
  { level: 3, title: "Sage", emoji: "📜", minStreak: 21, description: "21-day streak. Habits are taking root." },
  { level: 4, title: "Enlightened", emoji: "✨", minStreak: 50, description: "50-day streak. You've transcended." },
  { level: 5, title: "Ascendant", emoji: "🔱", minStreak: 100, description: "100-day streak. Legendary consistency." },
];

export function getActivityLevel(streak: number): Level {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (streak >= l.minStreak) current = l;
  }
  return current;
}

export function getNextLevel(streak: number): Level | null {
  for (const l of LEVELS) {
    if (streak < l.minStreak) return l;
  }
  return null;
}

export function getLevelProgress(streak: number): number {
  const current = getActivityLevel(streak);
  const next = getNextLevel(streak);
  if (!next) return 100;
  const range = next.minStreak - current.minStreak;
  const progress = streak - current.minStreak;
  return Math.round((progress / range) * 100);
}
