import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  ListChecks,
  Pause,
  Play,
  Shuffle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { exercisesById, roleLabels } from "../data/exercises";
import { playlistsById } from "../data/playlists";
import { getProgressionSuggestion } from "../lib/progression";
import { createSessionId } from "../lib/session";
import type {
  BlockSessionLog,
  SetLog,
  WorkoutPreferences,
  WorkoutSession,
} from "../types";
import { MediaFrame } from "./MediaFrame";

interface ActiveWorkoutViewProps {
  playlistId: string;
  preferences: WorkoutPreferences;
  onExit: () => void;
  onSwapExercise: (exerciseId: string) => void;
  onSaveSession: (session: WorkoutSession) => void;
  onUpdateLastWeight: (exerciseId: string, weight: number) => void;
}

const noteOptions = [
  "Felt strong",
  "Too heavy",
  "Increase next time",
  "Equipment busy",
];

export const ActiveWorkoutView = ({
  playlistId,
  preferences,
  onExit,
  onSwapExercise,
  onSaveSession,
  onUpdateLastWeight,
}: ActiveWorkoutViewProps) => {
  const playlist = playlistsById.get(playlistId);
  const [startedAt] = useState(() => new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState<Record<string, BlockSessionLog>>({});
  const [restRemaining, setRestRemaining] = useState(0);
  const [restPaused, setRestPaused] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [freeformNote, setFreeformNote] = useState("");
  const skippedBlockIds = new Set(preferences.skippedBlocks[playlistId] ?? []);
  const activeBlocks =
    playlist?.blocks.filter((block) => !skippedBlockIds.has(block.id)) ?? [];

  const currentBlock = activeBlocks[currentIndex];
  const selectedExerciseId =
    playlist && currentBlock
      ? (preferences.selectedExercises[playlist.id]?.[currentBlock.id] ??
        currentBlock.selectedExerciseId)
      : "";
  const exercise = exercisesById.get(selectedExerciseId);
  const edited = currentBlock
    ? preferences.editedTargets[currentBlock.id]
    : undefined;
  const effectiveBlock =
    currentBlock && edited ? { ...currentBlock, ...edited } : currentBlock;
  const setLog = effectiveBlock ? logs[effectiveBlock.id] : undefined;
  const completedSets = setLog?.sets.length ?? 0;
  const currentSet = Math.min(completedSets + 1, effectiveBlock?.sets ?? 1);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (activeBlocks.length > 0 && currentIndex > activeBlocks.length - 1) {
      setCurrentIndex(activeBlocks.length - 1);
    }
  }, [activeBlocks.length, currentIndex]);

  useEffect(() => {
    if (!exercise) return;
    setWeight(preferences.lastWeights[exercise.id] ?? 0);
    const firstNumber = effectiveBlock?.repRange.match(/\d+/)?.[0];
    setReps(firstNumber ? Number(firstNumber) : 10);
    setSelectedNotes([]);
    setFreeformNote("");
  }, [
    effectiveBlock?.id,
    effectiveBlock?.repRange,
    exercise,
    preferences.lastWeights,
  ]);

  useEffect(() => {
    if (restRemaining <= 0 || restPaused) return undefined;
    const timer = window.setInterval(() => {
      setRestRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [restPaused, restRemaining]);

  const totalLoggedSets = useMemo(
    () =>
      Object.values(logs).reduce(
        (total, block) => total + block.sets.length,
        0,
      ),
    [logs],
  );

  if (!playlist) return null;

  if (activeBlocks.length === 0) {
    return (
      <section className="active-workout active-workout--empty">
        <header className="active-workout__topbar">
          <button type="button" onClick={onExit} aria-label="Exit workout">
            <ArrowLeft size={26} />
          </button>
          <strong>0 / {playlist.blocks.length}</strong>
          <span>Skipped</span>
        </header>
        <div className="active-workout__title">
          <h1>No active blocks</h1>
          <p>
            Include at least one block from the playlist detail screen to start.
          </p>
        </div>
      </section>
    );
  }

  if (!effectiveBlock || !exercise) return null;

  const nextExercise = activeBlocks[currentIndex + 1];
  const nextExerciseId = nextExercise
    ? (preferences.selectedExercises[playlist.id]?.[nextExercise.id] ??
      nextExercise.selectedExerciseId)
    : "";
  const next = exercisesById.get(nextExerciseId);
  const isLastBlock = currentIndex === activeBlocks.length - 1;
  const blockComplete = completedSets >= effectiveBlock.sets;
  const isTimedBlock = /\b(min|sec|seconds|minutes)\b/i.test(
    effectiveBlock.repRange,
  );
  const effortLabel = isTimedBlock ? "Duration" : "Reps";
  const logLabel = isTimedBlock ? "Log Block" : "Log Set";

  const toggleNote = (note: string) => {
    setSelectedNotes((current) =>
      current.includes(note)
        ? current.filter((item) => item !== note)
        : [...current, note],
    );
  };

  const logSet = () => {
    const set: SetLog = {
      setNumber: completedSets + 1,
      reps,
      weight,
      completedAt: new Date().toISOString(),
      notes: selectedNotes,
      freeformNote: freeformNote.trim() || undefined,
    };
    setLogs((current) => ({
      ...current,
      [effectiveBlock.id]: {
        blockId: effectiveBlock.id,
        exerciseId: exercise.id,
        skipped: false,
        sets: [...(current[effectiveBlock.id]?.sets ?? []), set],
      },
    }));
    onUpdateLastWeight(exercise.id, weight);
    setRestRemaining(effectiveBlock.restSeconds);
    setRestPaused(false);
    setSelectedNotes([]);
    setFreeformNote("");
  };

  const goNext = () => {
    setRestRemaining(0);
    setCurrentIndex((index) => Math.min(activeBlocks.length - 1, index + 1));
  };

  const finishWorkout = () => {
    const completedAt = new Date();
    const blocks = playlist.blocks.map((blockItem) => {
      if (skippedBlockIds.has(blockItem.id)) {
        const selectedId =
          preferences.selectedExercises[playlist.id]?.[blockItem.id] ??
          blockItem.selectedExerciseId;
        return {
          blockId: blockItem.id,
          exerciseId: selectedId,
          skipped: true,
          sets: [],
        };
      }

      const selectedId =
        preferences.selectedExercises[playlist.id]?.[blockItem.id] ??
        blockItem.selectedExerciseId;
      return (
        logs[blockItem.id] ?? {
          blockId: blockItem.id,
          exerciseId: selectedId,
          skipped: true,
          sets: [],
        }
      );
    });

    const suggestions = playlist.blocks
      .map((blockItem) => {
        const sessionBlock = blocks.find(
          (item) => item.blockId === blockItem.id,
        );
        if (!sessionBlock) return "";
        const target = preferences.editedTargets[blockItem.id]
          ? { ...blockItem, ...preferences.editedTargets[blockItem.id] }
          : blockItem;
        return getProgressionSuggestion(target, sessionBlock);
      })
      .filter(Boolean);

    const session: WorkoutSession = {
      id: createSessionId(startedAt),
      playlistId: playlist.id,
      playlistName: playlist.name,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationSeconds: Math.round(
        (completedAt.getTime() - startedAt.getTime()) / 1000,
      ),
      blocks,
      notes: suggestions,
    };
    onSaveSession(session);
    onExit();
  };

  return (
    <section className="active-workout">
      <header className="active-workout__topbar">
        <button type="button" onClick={onExit} aria-label="Exit workout">
          <ArrowLeft size={26} />
        </button>
        <strong>
          {currentIndex + 1} / {activeBlocks.length}
        </strong>
        <span>
          <Clock3 size={19} />{" "}
          {restRemaining > 0
            ? `00:${String(restRemaining).padStart(2, "0")}`
            : "Ready"}
        </span>
      </header>

      <div className="active-workout__title">
        <h1>{exercise.name}</h1>
        <p>
          {roleLabels[exercise.role]} · {exercise.equipment}
        </p>
      </div>

      <MediaFrame exercise={exercise} dark />

      <div className="active-stat-panel">
        <div>
          <Dumbbell size={24} />
          <span>Set</span>
          <strong>
            {currentSet} of {effectiveBlock.sets}
          </strong>
        </div>
        <div>
          <ListChecks size={24} />
          <span>{effortLabel}</span>
          <strong>{effectiveBlock.repRange}</strong>
        </div>
        <div>
          <Clock3 size={24} />
          <span>Rest</span>
          <strong>{effectiveBlock.restSeconds} sec</strong>
        </div>
      </div>

      {restRemaining > 0 && (
        <div className="rest-timer" role="status">
          <span>Rest {restRemaining}s</span>
          <button
            type="button"
            onClick={() => setRestPaused((paused) => !paused)}
          >
            {restPaused ? (
              <Play size={18} fill="currentColor" />
            ) : (
              <Pause size={18} />
            )}
            {restPaused ? "Resume" : "Pause"}
          </button>
        </div>
      )}

      <div className="active-inputs">
        <label>
          {effortLabel}
          <input
            type="number"
            min={0}
            value={reps}
            onChange={(event) => setReps(Number(event.target.value))}
          />
        </label>
        <label className={isTimedBlock ? "is-muted" : undefined}>
          Weight
          <div>
            <button
              type="button"
              disabled={isTimedBlock}
              onClick={() => setWeight((value) => Math.max(0, value - 5))}
            >
              -
            </button>
            <input
              type="number"
              min={0}
              disabled={isTimedBlock}
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
            />
            <button
              type="button"
              disabled={isTimedBlock}
              onClick={() => setWeight((value) => value + 5)}
            >
              +
            </button>
          </div>
        </label>
      </div>

      <div className="active-workout__log">
        {blockComplete ? (
          <button
            type="button"
            className="workout-button workout-button--primary"
            onClick={isLastBlock ? finishWorkout : goNext}
          >
            <Check size={22} />{" "}
            {isLastBlock ? "Finish Workout" : "Next Exercise"}
          </button>
        ) : (
          <button
            type="button"
            className="workout-button workout-button--primary"
            onClick={logSet}
          >
            <Check size={22} /> {logLabel}
          </button>
        )}
      </div>

      <div className="session-notes">
        {noteOptions.map((note) => (
          <button
            key={note}
            type="button"
            className={selectedNotes.includes(note) ? "is-selected" : ""}
            onClick={() => toggleNote(note)}
          >
            {note}
          </button>
        ))}
        <label>
          <span>Session note</span>
          <textarea
            value={freeformNote}
            onChange={(event) => setFreeformNote(event.target.value)}
            rows={2}
          />
        </label>
      </div>

      <button
        type="button"
        className="active-next-card"
        onClick={() => (next ? goNext() : finishWorkout())}
      >
        <span>{next ? `Next: ${next.name}` : "Finish after this block"}</span>
        <ChevronRight size={24} />
      </button>

      <details className="progress-drawer">
        <summary>
          <ListChecks size={18} /> Workout progress · {totalLoggedSets} sets
        </summary>
        <ol>
          {playlist.blocks.map((blockItem) => {
            const selectedId =
              preferences.selectedExercises[playlist.id]?.[blockItem.id] ??
              blockItem.selectedExerciseId;
            const item = exercisesById.get(selectedId);
            const skipped = skippedBlockIds.has(blockItem.id);
            return (
              <li
                key={blockItem.id}
                className={
                  blockItem.id === effectiveBlock.id ? "is-current" : ""
                }
              >
                <span>{item?.name}</span>
                <small>
                  {skipped
                    ? "skipped"
                    : `${logs[blockItem.id]?.sets.length ?? 0} sets`}
                </small>
              </li>
            );
          })}
        </ol>
      </details>

      <div className="active-workout__secondary">
        <button
          type="button"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button type="button" onClick={() => onSwapExercise(exercise.id)}>
          <Shuffle size={18} /> Swap
        </button>
        <button type="button" onClick={goNext} disabled={isLastBlock}>
          Next <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
