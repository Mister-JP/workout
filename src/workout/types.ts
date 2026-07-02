export type PrimaryTab = "playlists" | "library" | "history";

export type MovementRole =
  | "warmup"
  | "glute_extension"
  | "quad_compound"
  | "single_leg"
  | "quad_isolation"
  | "hamstring_hinge"
  | "hamstring_isolation"
  | "glute_accessory"
  | "vertical_pull"
  | "horizontal_pull"
  | "chest_press"
  | "core_flexion"
  | "hanging_core"
  | "mobility";

export type SubstitutionTag =
  | "rack_busy"
  | "low_energy"
  | "knees_sensitive"
  | "want_machines"
  | "want_dumbbells";

export type MediaQualityStatus =
  | "approved_primary"
  | "approved_alternative"
  | "reference_embed"
  | "rejected"
  | "needs_review";

export interface MediaAsset {
  exerciseId: string;
  exerciseName: string;
  role: MovementRole;
  sourceType: "downloaded" | "embed" | "external_reference";
  sourcePlatform:
    | "DVIDS"
    | "Wikimedia"
    | "YouTube"
    | "Mayo Clinic"
    | "MuscleWiki"
    | "ExRx"
    | "other";
  sourceUrl: string;
  licenseNote: string;
  creator: string;
  retrievedAt: string;
  localFile: string;
  posterFile: string;
  durationSeconds: number;
  resolution: string;
  cameraAngle: "side" | "front" | "45_degree" | "other";
  qualityStatus: MediaQualityStatus;
  formReviewNotes: string;
  sets: string;
  repRange: string;
  restSeconds: number;
}

export interface Exercise {
  id: string;
  name: string;
  role: MovementRole;
  muscles: string;
  equipment: string;
  defaultSets: number;
  defaultRepRange: string;
  defaultRestSeconds: number;
  estimatedMinutes: number;
  cues: string[];
  avoid: string[];
  substitutionTags: SubstitutionTag[];
  primaryMediaId: string;
  mediaCandidateIds: string[];
  fallbackReferenceUrl: string;
}

export interface WorkoutBlock {
  id: string;
  role: MovementRole;
  label: string;
  purpose: string;
  exerciseIds: string[];
  selectedExerciseId: string;
  sets: number;
  repRange: string;
  restSeconds: number;
  estimatedMinutes: number;
  optional?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  purpose: string;
  tone: string;
  estimatedDuration: string;
  blocks: WorkoutBlock[];
  featured?: boolean;
}

export interface SetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
  notes: string[];
  freeformNote?: string;
}

export interface BlockSessionLog {
  blockId: string;
  exerciseId: string;
  skipped: boolean;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  playlistId: string;
  playlistName: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  blocks: BlockSessionLog[];
  notes: string[];
}

export interface WorkoutPreferences {
  selectedExercises: Record<string, Record<string, string>>;
  favorites: string[];
  lastWeights: Record<string, number>;
  editedTargets: Record<
    string,
    { sets: number; repRange: string; restSeconds: number }
  >;
  skippedBlocks: Record<string, string[]>;
}

export interface WorkoutHistoryState {
  sessions: WorkoutSession[];
}
