const STORAGE_KEY = 'consistency-tracker-v2';

export interface Entry {
  date: string;    // YYYY-MM-DD
  time: string;    // HH:MM:SS
  timestamp: number; // epoch ms
}

export interface Activity {
  id: string;
  name: string;
  entries: Entry[];
  createdAt: number;
}

export interface TrackerData {
  activities: Activity[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadData(): TrackerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { activities: [] };
}

function saveData(data: TrackerData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addActivity(name: string): TrackerData {
  const data = loadData();
  data.activities.push({
    id: generateId(),
    name: name.trim(),
    entries: [],
    createdAt: Date.now(),
  });
  saveData(data);
  return data;
}

export function deleteActivity(activityId: string): TrackerData {
  const data = loadData();
  data.activities = data.activities.filter((a) => a.id !== activityId);
  saveData(data);
  return data;
}

export function markActivity(activityId: string): TrackerData {
  const data = loadData();
  const activity = data.activities.find((a) => a.id === activityId);
  if (!activity) return data;

  const now = new Date();
  const entry: Entry = {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    timestamp: now.getTime(),
  };
  activity.entries.push(entry);
  saveData(data);
  return data;
}

export function hasMarkedToday(activity: Activity): boolean {
  const today = getToday();
  return activity.entries.some((e) => e.date === today);
}

export function getStreak(activity: Activity): number {
  if (activity.entries.length === 0) return 0;
  const uniqueDates = [...new Set(activity.entries.map((e) => e.date))].sort().reverse();
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export function getTodayEntries(activity: Activity): Entry[] {
  const today = getToday();
  return activity.entries.filter((e) => e.date === today);
}
