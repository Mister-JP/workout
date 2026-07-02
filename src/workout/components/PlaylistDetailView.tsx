import { ArrowLeft, Box, Clock3, MoreHorizontal, Play } from "lucide-react";
import { playlistsById } from "../data/playlists";
import type { WorkoutPreferences } from "../types";
import { ExerciseBlockCard } from "./ExerciseBlockCard";

interface PlaylistDetailViewProps {
  playlistId: string;
  preferences: WorkoutPreferences;
  onBack: () => void;
  onStart: () => void;
  onSelectExercise: (blockId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
  onUpdateTarget: (
    blockId: string,
    target: { sets: number; repRange: string; restSeconds: number },
  ) => void;
  onToggleSkippedBlock: (blockId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
}

export const PlaylistDetailView = ({
  playlistId,
  preferences,
  onBack,
  onStart,
  onSelectExercise,
  onOpenExercise,
  onUpdateTarget,
  onToggleSkippedBlock,
  onToggleFavorite,
}: PlaylistDetailViewProps) => {
  const playlist = playlistsById.get(playlistId);
  if (!playlist) return null;

  return (
    <section className="playlist-detail">
      <header className="detail-topbar">
        <button type="button" onClick={onBack} aria-label="Back">
          <ArrowLeft size={26} />
        </button>
        <strong>{playlist.name}</strong>
        <button type="button" aria-label="More playlist actions">
          <MoreHorizontal size={26} />
        </button>
      </header>

      <div className="playlist-detail__intro">
        <h1>{playlist.name}</h1>
        <p>{playlist.purpose}</p>
        <div>
          <span>
            <Box size={18} /> {playlist.blocks.length} blocks
          </span>
          <span>
            <Clock3 size={18} /> {playlist.estimatedDuration}
          </span>
        </div>
        <button type="button" className="workout-button workout-button--ghost">
          Edit
        </button>
      </div>

      <div className="exercise-timeline">
        {playlist.blocks.map((block, index) => {
          const edited = preferences.editedTargets[block.id];
          const effectiveBlock = edited ? { ...block, ...edited } : block;
          const selectedExerciseId =
            preferences.selectedExercises[playlist.id]?.[block.id] ??
            block.selectedExerciseId;
          const isSkipped = (
            preferences.skippedBlocks[playlist.id] ?? []
          ).includes(block.id);
          return (
            <ExerciseBlockCard
              key={block.id}
              playlistId={playlist.id}
              block={effectiveBlock}
              index={index}
              selectedExerciseId={selectedExerciseId}
              favoriteIds={preferences.favorites}
              isSkipped={isSkipped}
              onSelectExercise={(exerciseId) =>
                onSelectExercise(block.id, exerciseId)
              }
              onOpenExercise={onOpenExercise}
              onUpdateTarget={(target) => onUpdateTarget(block.id, target)}
              onToggleSkipped={() => onToggleSkippedBlock(block.id)}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
      </div>

      <div className="playlist-detail__start">
        <button
          type="button"
          className="workout-button workout-button--primary"
          onClick={onStart}
        >
          <Play size={20} fill="currentColor" /> Start Workout
        </button>
      </div>
    </section>
  );
};
