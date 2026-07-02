import type {
  WorkoutHistoryState,
  WorkoutPreferences,
  WorkoutSession,
} from "../types";

export const preferenceKey = "workout-playlist-preferences-v1";
export const historyKey = "workout-playlist-history-v1";

export const defaultPreferences: WorkoutPreferences = {
  selectedExercises: {},
  favorites: [],
  lastWeights: {},
  editedTargets: {},
  skippedBlocks: {},
};

export const defaultHistory: WorkoutHistoryState = {
  sessions: [],
};

const safeRead = <T>(
  storage: Storage | undefined,
  key: string,
  fallback: T,
): T => {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWrite = <T>(
  storage: Storage | undefined,
  key: string,
  value: T,
): void => {
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

export const readPreferences = (
  storage: Storage | undefined = globalThis.localStorage,
): WorkoutPreferences => ({
  ...defaultPreferences,
  ...safeRead(storage, preferenceKey, defaultPreferences),
});

export const writePreferences = (
  preferences: WorkoutPreferences,
  storage: Storage | undefined = globalThis.localStorage,
): void => {
  safeWrite(storage, preferenceKey, preferences);
};

export const readHistory = (
  storage: Storage | undefined = globalThis.localStorage,
): WorkoutHistoryState => ({
  ...defaultHistory,
  ...safeRead(storage, historyKey, defaultHistory),
});

export const writeHistory = (
  history: WorkoutHistoryState,
  storage: Storage | undefined = globalThis.localStorage,
): void => {
  safeWrite(storage, historyKey, history);
};

export const appendSession = (
  session: WorkoutSession,
  storage: Storage | undefined = globalThis.localStorage,
): WorkoutHistoryState => {
  const history = readHistory(storage);
  const next = {
    sessions: [session, ...history.sessions].slice(0, 100),
  };
  writeHistory(next, storage);
  return next;
};
