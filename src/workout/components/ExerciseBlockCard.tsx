import {
  Check,
  Dumbbell,
  Heart,
  Pencil,
  SkipForward,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { exercisesById, roleLabels } from "../data/exercises";
import { getBestSubstitution } from "../lib/substitutions";
import type { SubstitutionTag, WorkoutBlock } from "../types";
import { MediaFrame } from "./MediaFrame";

interface ExerciseBlockCardProps {
  playlistId: string;
  block: WorkoutBlock;
  index: number;
  selectedExerciseId: string;
  favoriteIds: string[];
  isSkipped: boolean;
  onSelectExercise: (exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
  onUpdateTarget: (target: {
    sets: number;
    repRange: string;
    restSeconds: number;
  }) => void;
  onToggleSkipped: () => void;
  onToggleFavorite: (exerciseId: string) => void;
}

const chips: Array<{ tag: SubstitutionTag; label: string }> = [
  { tag: "rack_busy", label: "Rack busy" },
  { tag: "low_energy", label: "Low energy" },
  { tag: "knees_sensitive", label: "Knees sensitive" },
  { tag: "want_machines", label: "Want machines" },
  { tag: "want_dumbbells", label: "Want dumbbells" },
];

export const ExerciseBlockCard = ({
  block,
  index,
  selectedExerciseId,
  favoriteIds,
  isSkipped,
  onSelectExercise,
  onOpenExercise,
  onUpdateTarget,
  onToggleSkipped,
  onToggleFavorite,
}: ExerciseBlockCardProps) => {
  const selected =
    exercisesById.get(selectedExerciseId) ??
    exercisesById.get(block.selectedExerciseId);
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState(block.sets);
  const [repRange, setRepRange] = useState(block.repRange);
  const [restSeconds, setRestSeconds] = useState(block.restSeconds);

  if (!selected) return null;

  const applyTag = (tag: SubstitutionTag) => {
    onSelectExercise(getBestSubstitution(block, tag, selected.id));
  };

  const saveTarget = () => {
    onUpdateTarget({ sets, repRange, restSeconds });
    setEditing(false);
  };

  return (
    <article
      className={isSkipped ? "exercise-block is-skipped" : "exercise-block"}
    >
      <div className="exercise-block__step" aria-hidden="true">
        {index + 1}
      </div>
      <div className="exercise-block__content">
        <div className="exercise-block__header">
          <div>
            <span>{roleLabels[block.role]}</span>
            <h3>{selected.name}</h3>
            <p>
              {sets} sets x {repRange}
              {restSeconds > 0 ? ` · Rest ${restSeconds} sec` : ""}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Favorite ${selected.name}`}
            onClick={() => onToggleFavorite(selected.id)}
          >
            <Heart
              size={22}
              fill={favoriteIds.includes(selected.id) ? "currentColor" : "none"}
            />
          </button>
        </div>

        <button
          type="button"
          className="exercise-block__media"
          onClick={() => onOpenExercise(selected.id)}
        >
          <MediaFrame exercise={selected} compact interactive={false} />
          <span>Open</span>
        </button>

        <div
          className="exercise-block__stats"
          aria-label={`${selected.name} target`}
        >
          <span>
            <Dumbbell size={16} /> {selected.equipment}
          </span>
          <span>
            <Timer size={16} /> Est. {block.estimatedMinutes} min
          </span>
        </div>

        <div
          className="exercise-block__rail"
          aria-label={`${block.label} alternatives`}
        >
          {block.exerciseIds.map((exerciseId) => {
            const exercise = exercisesById.get(exerciseId);
            if (!exercise) return null;
            return (
              <button
                key={exercise.id}
                type="button"
                className={exercise.id === selected.id ? "is-selected" : ""}
                onClick={() => onSelectExercise(exercise.id)}
              >
                <MediaFrame exercise={exercise} compact interactive={false} />
                <span>{exercise.name}</span>
              </button>
            );
          })}
        </div>

        <div className="exercise-block__quick">
          {chips.map((chip) => (
            <button
              key={chip.tag}
              type="button"
              onClick={() => applyTag(chip.tag)}
            >
              <SlidersHorizontal size={15} /> {chip.label}
            </button>
          ))}
        </div>

        <div className="exercise-block__notes">
          <div>
            <strong>Cues</strong>
            <ul>
              {selected.cues.slice(0, 3).map((cue) => (
                <li key={cue}>
                  <Check size={14} /> {cue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Avoid</strong>
            <ul>
              {selected.avoid.slice(0, 2).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        {editing ? (
          <div className="exercise-block__edit">
            <label>
              Sets
              <input
                value={sets}
                min={1}
                max={6}
                type="number"
                onChange={(event) => setSets(Number(event.target.value))}
              />
            </label>
            <label>
              Reps
              <input
                value={repRange}
                onChange={(event) => setRepRange(event.target.value)}
              />
            </label>
            <label>
              Rest
              <input
                value={restSeconds}
                min={0}
                step={15}
                type="number"
                onChange={(event) => setRestSeconds(Number(event.target.value))}
              />
            </label>
            <button
              type="button"
              className="workout-button workout-button--primary"
              onClick={saveTarget}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="exercise-block__actions">
            <button type="button" onClick={() => setEditing(true)}>
              <Pencil size={16} /> Edit sets/reps
            </button>
            <button
              type="button"
              aria-pressed={isSkipped}
              aria-label={
                isSkipped ? `Include ${selected.name}` : `Skip ${selected.name}`
              }
              onClick={onToggleSkipped}
            >
              <SkipForward size={16} /> {isSkipped ? "Include" : "Skip"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
