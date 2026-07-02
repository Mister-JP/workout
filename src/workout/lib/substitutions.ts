import { exercisesById } from '../data/exercises';
import type { SubstitutionTag, WorkoutBlock } from '../types';

const priority: Record<SubstitutionTag, (exerciseId: string) => number> = {
  rack_busy: (exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return 0;
    if (exercise.equipment.toLowerCase().includes('dumbbell')) return 4;
    if (exercise.equipment.toLowerCase().includes('machine')) return 3;
    if (exercise.equipment.toLowerCase().includes('cable')) return 2;
    return 1;
  },
  low_energy: (exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return 0;
    if (exercise.substitutionTags.includes('low_energy')) return 4;
    if (exercise.equipment.toLowerCase().includes('machine')) return 3;
    if (exercise.defaultRestSeconds <= 60) return 2;
    return 1;
  },
  knees_sensitive: (exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return 0;
    if (exercise.substitutionTags.includes('knees_sensitive')) return 4;
    if (exercise.equipment.toLowerCase().includes('machine')) return 2;
    return exercise.role === 'single_leg' ? 1 : 2;
  },
  want_machines: (exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return 0;
    return exercise.equipment.toLowerCase().includes('machine') ? 4 : 1;
  },
  want_dumbbells: (exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return 0;
    return exercise.equipment.toLowerCase().includes('dumbbell') ? 4 : 1;
  },
};

export const getSubstitutionOptions = (block: WorkoutBlock, tag: SubstitutionTag): string[] => {
  return [...block.exerciseIds].sort((a, b) => {
    const scoreDelta = priority[tag](b) - priority[tag](a);
    if (scoreDelta !== 0) return scoreDelta;
    return block.exerciseIds.indexOf(a) - block.exerciseIds.indexOf(b);
  });
};

export const getBestSubstitution = (
  block: WorkoutBlock,
  tag: SubstitutionTag,
  currentExerciseId: string,
): string => {
  const options = getSubstitutionOptions(block, tag);
  return options.find((exerciseId) => exerciseId !== currentExerciseId) ?? currentExerciseId;
};
