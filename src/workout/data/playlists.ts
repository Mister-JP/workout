import type { Playlist, WorkoutBlock } from '../types';

const block = (
  id: string,
  label: WorkoutBlock['label'],
  purpose: string,
  exerciseIds: string[],
  selectedExerciseId: string,
  sets: number,
  repRange: string,
  restSeconds: number,
  estimatedMinutes: number,
  optional = false,
): WorkoutBlock => ({
  id,
  role: labelToRole(label),
  label,
  purpose,
  exerciseIds,
  selectedExerciseId,
  sets,
  repRange,
  restSeconds,
  estimatedMinutes,
  optional,
});

const labelToRole = (label: WorkoutBlock['label']): WorkoutBlock['role'] => {
  switch (label) {
    case 'Warm-up':
      return 'warmup';
    case 'Glute Extension':
      return 'glute_extension';
    case 'Quad Compound':
      return 'quad_compound';
    case 'Single-Leg':
      return 'single_leg';
    case 'Quad Isolation':
      return 'quad_isolation';
    case 'Hamstring Hinge':
      return 'hamstring_hinge';
    case 'Hamstring Isolation':
      return 'hamstring_isolation';
    case 'Glute Accessory':
      return 'glute_accessory';
    case 'Vertical Pull':
      return 'vertical_pull';
    case 'Chest Press':
      return 'chest_press';
    case 'Horizontal Pull':
      return 'horizontal_pull';
    case 'Core Flexion':
      return 'core_flexion';
    case 'Hanging Core':
      return 'hanging_core';
    case 'Mobility':
      return 'mobility';
    default:
      return 'mobility';
  }
};

export const playlists: Playlist[] = [
  {
    id: 'lower-a',
    name: 'Lower A — Glutes + Quads',
    purpose: 'Glute drive, quad strength, and a short hip reset.',
    tone: 'Strong lower-body day with a calm finish.',
    estimatedDuration: '50-60 min',
    featured: true,
    blocks: [
      block('lower-a-warmup', 'Warm-up', 'Raise temperature without draining energy.', ['cross-trainer', 'incline-walk', 'stationary-bike'], 'cross-trainer', 1, '6 min', 0, 6),
      block('lower-a-glute-extension', 'Glute Extension', 'Primary glute strength slot.', ['barbell-hip-thrust', 'dumbbell-hip-thrust', 'dumbbell-glute-bridge'], 'barbell-hip-thrust', 4, '8-10', 90, 14),
      block('lower-a-quad-compound', 'Quad Compound', 'Heavy quad pattern with stable setup.', ['leg-press', 'goblet-squat', 'dumbbell-sumo-squat'], 'leg-press', 3, '10-12', 90, 12),
      block('lower-a-single-leg', 'Single-Leg', 'Unilateral glute and quad work.', ['bulgarian-split-squat', 'reverse-lunge', 'dumbbell-step-up'], 'bulgarian-split-squat', 3, '8-10 each side', 75, 12),
      block('lower-a-quad-isolation', 'Quad Isolation', 'Machine accessory based on availability.', ['leg-extension', 'leg-curl'], 'leg-extension', 3, '12-15', 60, 8),
      block('lower-a-glute-accessory', 'Glute Accessory', 'Low-decision glute finisher.', ['hip-abduction-machine', 'cable-kickback', 'frog-pumps'], 'hip-abduction-machine', 3, '12-15', 45, 7),
      block('lower-a-mobility', 'Mobility', 'Downshift hips and glutes.', ['hip-flexor-stretch', 'figure-four-glute-stretch'], 'hip-flexor-stretch', 1, '3 min', 0, 3),
    ],
  },
  {
    id: 'upper-abs',
    name: 'Upper + Abs',
    purpose: 'Back, chest, and simple core work.',
    tone: 'Balanced upper body without clutter.',
    estimatedDuration: '40-45 min',
    blocks: [
      block('upper-warmup', 'Warm-up', 'Easy cross-trainer start.', ['cross-trainer', 'incline-walk', 'stationary-bike'], 'cross-trainer', 1, '5 min', 0, 5),
      block('upper-vertical-pull', 'Vertical Pull', 'Back strength slot.', ['assisted-chin-up', 'lat-pulldown'], 'assisted-chin-up', 3, '6-10', 90, 10),
      block('upper-chest-press', 'Chest Press', 'Horizontal press with stable shoulders.', ['chest-press-machine', 'dumbbell-bench-press', 'incline-push-up'], 'chest-press-machine', 3, '8-12', 75, 9),
      block('upper-row', 'Horizontal Pull', 'Mid-back row pattern.', ['seated-cable-row', 'one-arm-dumbbell-row'], 'seated-cable-row', 3, '10-12', 75, 9),
      block('upper-core-flexion', 'Core Flexion', 'Controlled abs work.', ['abs-crunch-machine', 'cable-crunch', 'dead-bug'], 'abs-crunch-machine', 3, '10-15', 60, 7),
      block('upper-hanging-core', 'Hanging Core', 'Knee-raise or floor core finish.', ['captains-chair-knee-raise', 'hanging-knee-raise', 'reverse-crunch'], 'captains-chair-knee-raise', 3, '8-12', 60, 7),
      block('upper-mobility', 'Mobility', 'Chest and lat downshift.', ['chest-stretch', 'lat-stretch'], 'chest-stretch', 1, '3 min', 0, 3),
    ],
  },
  {
    id: 'lower-b',
    name: 'Lower B — Hamstrings + Glutes',
    purpose: 'Hinge strength, hamstrings, and a glute finish.',
    tone: 'Posterior-chain day with steady machine options.',
    estimatedDuration: '50-55 min',
    blocks: [
      block('lower-b-warmup', 'Warm-up', 'Easy heat before hinging.', ['cross-trainer', 'incline-walk', 'stationary-bike'], 'cross-trainer', 1, '6 min', 0, 6),
      block('lower-b-hinge', 'Hamstring Hinge', 'Primary hamstring and glute hinge.', ['barbell-romanian-deadlift', 'dumbbell-romanian-deadlift', 'cable-pull-through'], 'barbell-romanian-deadlift', 4, '8-10', 90, 14),
      block('lower-b-curl', 'Hamstring Isolation', 'Machine hamstring work.', ['leg-curl'], 'leg-curl', 3, '10-12', 75, 8),
      block('lower-b-single-leg', 'Single-Leg', 'Reverse lunge pattern.', ['reverse-lunge', 'bulgarian-split-squat', 'dumbbell-step-up'], 'reverse-lunge', 3, '8 each side', 75, 10),
      block('lower-b-high-leg-press', 'Quad Compound', 'High-foot leg press or calm squat substitute.', ['leg-press', 'goblet-squat', 'dumbbell-sumo-squat'], 'leg-press', 3, '10-12', 90, 10),
      block('lower-b-hinge-accessory', 'Hamstring Hinge', 'Lighter hinge finisher.', ['dumbbell-sumo-squat', 'cable-pull-through', 'dumbbell-romanian-deadlift'], 'cable-pull-through', 2, '12-15', 60, 7),
      block('lower-b-mobility', 'Mobility', 'Hamstring and glute downshift.', ['hamstring-stretch', 'figure-four-glute-stretch'], 'hamstring-stretch', 1, '3 min', 0, 3),
    ],
  },
  {
    id: 'machine-reset',
    name: 'Machine Reset — Low-Energy, Still Show Up',
    purpose: 'A valid low-decision workout for busy or tired days.',
    tone: 'Still counts. Machines, simple reps, no negotiation.',
    estimatedDuration: '30-40 min',
    blocks: [
      block('reset-warmup', 'Warm-up', 'Longer easy warm-up.', ['cross-trainer', 'incline-walk', 'stationary-bike'], 'cross-trainer', 1, '8 min', 0, 8),
      block('reset-leg-press', 'Quad Compound', 'Stable lower-body effort.', ['leg-press', 'goblet-squat'], 'leg-press', 3, '12', 75, 8),
      block('reset-vertical-pull', 'Vertical Pull', 'Simple back work.', ['lat-pulldown', 'assisted-chin-up'], 'lat-pulldown', 3, '8-10', 75, 7),
      block('reset-chest-press', 'Chest Press', 'Simple press pattern.', ['chest-press-machine', 'incline-push-up'], 'chest-press-machine', 3, '10', 60, 7),
      block('reset-abs', 'Core Flexion', 'Machine or floor core.', ['abs-crunch-machine', 'dead-bug', 'reverse-crunch'], 'abs-crunch-machine', 3, '12-15', 60, 6),
      block('reset-mobility', 'Mobility', 'Optional easy stretch or walk.', ['hip-flexor-stretch', 'hamstring-stretch', 'incline-walk'], 'hip-flexor-stretch', 1, '5 min', 0, 5, true),
    ],
  },
];

export const playlistsById = new Map(playlists.map((playlist) => [playlist.id, playlist]));
