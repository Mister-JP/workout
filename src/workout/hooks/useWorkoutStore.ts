import { useEffect, useMemo, useState } from "react";
import {
  appendSession,
  defaultHistory,
  defaultPreferences,
  readHistory,
  readPreferences,
  writePreferences,
} from "../lib/storage";
import type {
  WorkoutHistoryState,
  WorkoutPreferences,
  WorkoutSession,
} from "../types";

export const useWorkoutStore = () => {
  const [preferences, setPreferences] =
    useState<WorkoutPreferences>(defaultPreferences);
  const [history, setHistory] = useState<WorkoutHistoryState>(defaultHistory);

  useEffect(() => {
    setPreferences(readPreferences());
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    writePreferences(preferences);
  }, [preferences]);

  const api = useMemo(
    () => ({
      setSelectedExercise: (
        playlistId: string,
        blockId: string,
        exerciseId: string,
      ) => {
        setPreferences((current) => ({
          ...current,
          selectedExercises: {
            ...current.selectedExercises,
            [playlistId]: {
              ...(current.selectedExercises[playlistId] ?? {}),
              [blockId]: exerciseId,
            },
          },
        }));
      },
      toggleFavorite: (exerciseId: string) => {
        setPreferences((current) => {
          const exists = current.favorites.includes(exerciseId);
          return {
            ...current,
            favorites: exists
              ? current.favorites.filter((id) => id !== exerciseId)
              : [...current.favorites, exerciseId],
          };
        });
      },
      updateTarget: (
        blockId: string,
        target: { sets: number; repRange: string; restSeconds: number },
      ) => {
        setPreferences((current) => ({
          ...current,
          editedTargets: {
            ...current.editedTargets,
            [blockId]: target,
          },
        }));
      },
      toggleSkippedBlock: (playlistId: string, blockId: string) => {
        setPreferences((current) => {
          const skipped = current.skippedBlocks[playlistId] ?? [];
          const exists = skipped.includes(blockId);
          return {
            ...current,
            skippedBlocks: {
              ...current.skippedBlocks,
              [playlistId]: exists
                ? skipped.filter((id) => id !== blockId)
                : [...skipped, blockId],
            },
          };
        });
      },
      updateLastWeight: (exerciseId: string, weight: number) => {
        setPreferences((current) => ({
          ...current,
          lastWeights: {
            ...current.lastWeights,
            [exerciseId]: weight,
          },
        }));
      },
      saveSession: (session: WorkoutSession) => {
        const next = appendSession(session);
        setHistory(next);
      },
    }),
    [],
  );

  return { preferences, history, ...api };
};
