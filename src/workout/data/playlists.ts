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
    id: 'upper-a-machines-dumbbells',
    name: 'Upper A — Machines + Dumbbells',
    purpose: 'Chest, back, and abs using the equipment you already have.',
    tone: 'Structured upper-body strength with simple swaps.',
    estimatedDuration: '45-50 min',
    featured: true,
    blocks: [
      block('upper-a-warmup', 'Warm-up', 'Easy cardio and shoulder temperature.', ['cross-trainer', 'stationary-bike', 'incline-walk'], 'cross-trainer', 1, '5 min', 0, 5),
      block('upper-a-vertical-pull', 'Vertical Pull', 'Primary back strength on a machine.', ['assisted-chin-up', 'lat-pulldown'], 'assisted-chin-up', 3, '6-10', 90, 10),
      block('upper-a-chest-press', 'Chest Press', 'Stable chest press slot.', ['chest-press-machine', 'dumbbell-bench-press', 'incline-push-up'], 'chest-press-machine', 3, '8-12', 75, 9),
      block('upper-a-row', 'Horizontal Pull', 'Mid-back balance after pressing.', ['seated-cable-row', 'one-arm-dumbbell-row'], 'one-arm-dumbbell-row', 3, '10-12', 75, 9),
      block('upper-a-abs', 'Core Flexion', 'Machine or cable abs.', ['abs-crunch-machine', 'cable-crunch', 'dead-bug'], 'abs-crunch-machine', 3, '10-15', 60, 7),
      block('upper-a-hanging-core', 'Hanging Core', 'Captain chair or hanging core finish.', ['captains-chair-knee-raise', 'hanging-knee-raise', 'reverse-crunch'], 'captains-chair-knee-raise', 2, '8-12', 60, 6),
      block('upper-a-mobility', 'Mobility', 'Open chest and lats.', ['chest-stretch', 'lat-stretch'], 'chest-stretch', 1, '3 min', 0, 3),
    ],
  },
  {
    id: 'upper-b-pull-posture',
    name: 'Upper B — Pull + Posture',
    purpose: 'Back, rear delts, and core without overloading pressing.',
    tone: 'Posture-focused upper day with cable and dumbbell options.',
    estimatedDuration: '40-45 min',
    blocks: [
      block('upper-b-warmup', 'Warm-up', 'Light cardio before pulling.', ['stationary-bike', 'cross-trainer', 'incline-walk'], 'stationary-bike', 1, '5 min', 0, 5),
      block('upper-b-vertical-pull', 'Vertical Pull', 'Lat-focused first pull.', ['lat-pulldown', 'assisted-chin-up'], 'lat-pulldown', 3, '8-10', 90, 10),
      block('upper-b-row', 'Horizontal Pull', 'Controlled row for mid-back.', ['seated-cable-row', 'one-arm-dumbbell-row'], 'seated-cable-row', 3, '10-12', 75, 9),
      block('upper-b-face-pull', 'Horizontal Pull', 'Rear-delt and upper-back accessory.', ['face-pull', 'rear-delt-fly'], 'face-pull', 3, '12-15', 60, 8),
      block('upper-b-core', 'Core Flexion', 'Low-skill core work.', ['dead-bug', 'cable-crunch', 'abs-crunch-machine'], 'dead-bug', 3, '8-12 each side', 45, 7),
      block('upper-b-hanging-core', 'Hanging Core', 'Optional stronger core finish.', ['hanging-knee-raise', 'captains-chair-knee-raise', 'reverse-crunch'], 'hanging-knee-raise', 2, '8-12', 60, 6),
      block('upper-b-mobility', 'Mobility', 'Lat and chest reset.', ['lat-stretch', 'chest-stretch'], 'lat-stretch', 1, '3 min', 0, 3),
    ],
  },
  {
    id: 'upper-c-push-abs',
    name: 'Upper C — Push + Abs',
    purpose: 'Chest strength, light back balance, and a focused ab finish.',
    tone: 'Efficient push day that still protects shoulders.',
    estimatedDuration: '40-45 min',
    blocks: [
      block('upper-c-warmup', 'Warm-up', 'Easy machine warm-up.', ['cross-trainer', 'stationary-bike', 'incline-walk'], 'cross-trainer', 1, '5 min', 0, 5),
      block('upper-c-chest-main', 'Chest Press', 'Main chest strength slot.', ['dumbbell-bench-press', 'chest-press-machine', 'incline-push-up'], 'dumbbell-bench-press', 3, '8-12', 75, 10),
      block('upper-c-chest-backoff', 'Chest Press', 'Lower-stress press variation.', ['chest-press-machine', 'incline-push-up', 'dumbbell-bench-press'], 'chest-press-machine', 2, '10-12', 60, 7),
      block('upper-c-row-balance', 'Horizontal Pull', 'Enough pulling to keep shoulders honest.', ['one-arm-dumbbell-row', 'seated-cable-row'], 'one-arm-dumbbell-row', 3, '10-12', 75, 9),
      block('upper-c-abs-machine', 'Core Flexion', 'Direct abs work.', ['abs-crunch-machine', 'cable-crunch', 'dead-bug'], 'cable-crunch', 3, '10-15', 60, 7),
      block('upper-c-core-finish', 'Hanging Core', 'Core finisher based on station availability.', ['captains-chair-knee-raise', 'hanging-knee-raise', 'reverse-crunch'], 'captains-chair-knee-raise', 2, '8-12', 60, 6),
      block('upper-c-mobility', 'Mobility', 'Chest downshift.', ['chest-stretch', 'lat-stretch'], 'chest-stretch', 1, '3 min', 0, 3),
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
