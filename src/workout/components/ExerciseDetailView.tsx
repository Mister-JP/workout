import { ArrowLeft, Check, Clock3, Dumbbell, Grid2X2, Heart, Timer } from 'lucide-react';
import { exercisesById, exercisesByRole, roleLabels } from '../data/exercises';
import type { WorkoutBlock } from '../types';
import { MediaFrame } from './MediaFrame';

interface ExerciseDetailViewProps {
  exerciseId: string;
  block?: WorkoutBlock;
  favoriteIds: string[];
  onBack: () => void;
  onSelectExercise: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
}

export const ExerciseDetailView = ({
  exerciseId,
  block,
  favoriteIds,
  onBack,
  onSelectExercise,
  onToggleFavorite,
}: ExerciseDetailViewProps) => {
  const exercise = exercisesById.get(exerciseId);
  if (!exercise) return null;

  const alternatives = (block ? block.exerciseIds : exercisesByRole[exercise.role].map((item) => item.id)).filter(
    (id) => id !== exercise.id,
  );

  return (
    <section className="exercise-detail">
      <header className="detail-topbar">
        <button type="button" onClick={onBack} aria-label="Back">
          <ArrowLeft size={26} />
        </button>
        <strong>{roleLabels[exercise.role]}</strong>
        <button type="button" onClick={() => onToggleFavorite(exercise.id)} aria-label={`Favorite ${exercise.name}`}>
          <Heart size={24} fill={favoriteIds.includes(exercise.id) ? 'currentColor' : 'none'} />
        </button>
      </header>

      <div className="exercise-detail__body">
        <div className="exercise-detail__title">
          <h1>{exercise.name}</h1>
          <p>
            {exercise.muscles} · {exercise.equipment}
          </p>
          <span>Reviewed reference</span>
        </div>

        <MediaFrame exercise={exercise} />

        <div className="detail-stat-grid">
          <div>
            <Grid2X2 size={21} />
            <strong>{block?.sets ?? exercise.defaultSets}</strong>
            <span>sets</span>
          </div>
          <div>
            <Dumbbell size={21} />
            <strong>{block?.repRange ?? exercise.defaultRepRange}</strong>
            <span>reps</span>
          </div>
          <div>
            <Clock3 size={21} />
            <strong>{block?.restSeconds ?? exercise.defaultRestSeconds}</strong>
            <span>sec rest</span>
          </div>
          <div>
            <Timer size={21} />
            <strong>{block?.estimatedMinutes ?? exercise.estimatedMinutes}</strong>
            <span>min</span>
          </div>
        </div>

        <section className="detail-list">
          <h2>Form Cues</h2>
          <ul>
            {exercise.cues.map((cue) => (
              <li key={cue}>
                <Check size={16} /> {cue}
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-list detail-list--avoid">
          <h2>Common Mistakes</h2>
          <ul>
            {exercise.avoid.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="section-row">
            <h2>Alternatives</h2>
          </div>
          <div className="detail-alternatives">
            {alternatives.map((id) => {
              const alternative = exercisesById.get(id);
              if (!alternative) return null;
              return (
                <button key={id} type="button" onClick={() => onSelectExercise(id)}>
                  <MediaFrame exercise={alternative} compact interactive={false} />
                  <strong>{alternative.name}</strong>
                  <span>{alternative.equipment}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="detail-cta">
        <button type="button" className="workout-button workout-button--primary" onClick={() => onSelectExercise(exercise.id)}>
          <Check size={21} /> Use This Exercise
        </button>
      </div>
    </section>
  );
};
