import { Box, Clock3, Edit3, Play, ChevronRight } from 'lucide-react';
import { exercisesById } from '../data/exercises';
import { mediaByExerciseId } from '../data/media';
import type { Playlist, WorkoutSession } from '../types';
import { MediaFrame } from './MediaFrame';

interface PlaylistCardProps {
  playlist: Playlist;
  sessions: WorkoutSession[];
  onOpen: () => void;
  onStart: () => void;
}

const formatLastCompleted = (playlist: Playlist, sessions: WorkoutSession[]): string => {
  const last = sessions.find((session) => session.playlistId === playlist.id);
  if (!last) return 'Not completed yet';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
    new Date(last.completedAt),
  );
};

export const PlaylistCard = ({ playlist, sessions, onOpen, onStart }: PlaylistCardProps) => {
  const previewExerciseId =
    playlist.blocks
      .map((block) => block.selectedExerciseId)
      .find((exerciseId) => mediaByExerciseId.get(exerciseId)?.localFile) ??
    playlist.blocks[1]?.selectedExerciseId ??
    playlist.blocks[0].selectedExerciseId;
  const firstExercise = exercisesById.get(previewExerciseId);

  return (
    <article className={`playlist-card ${playlist.featured ? 'playlist-card--featured' : ''}`}>
      <button className="playlist-card__open" type="button" onClick={onOpen} aria-label={`Open ${playlist.name}`}>
        <div className="playlist-card__media-grid" aria-hidden="true">
          {firstExercise ? <MediaFrame exercise={firstExercise} compact interactive={false} /> : null}
          {playlist.blocks.slice(2, 4).map((block) => {
            const exercise = exercisesById.get(block.selectedExerciseId);
            return exercise ? (
              <MediaFrame key={block.id} exercise={exercise} compact interactive={false} />
            ) : null;
          })}
        </div>
        <div className="playlist-card__body">
          {playlist.featured && <span className="playlist-card__featured">Featured</span>}
          <h2>{playlist.name}</h2>
          <p>{playlist.purpose}</p>
          <div className="playlist-card__meta">
            <span>
              <Box size={17} /> {playlist.blocks.length} blocks
            </span>
            <span>
              <Clock3 size={17} /> {playlist.estimatedDuration}
            </span>
          </div>
          <small>Last: {formatLastCompleted(playlist, sessions)}</small>
        </div>
        {!playlist.featured && <ChevronRight className="playlist-card__chevron" size={24} aria-hidden="true" />}
      </button>
      {playlist.featured && (
        <div className="playlist-card__actions">
          <button type="button" className="workout-button workout-button--primary" onClick={onStart}>
            <Play size={18} fill="currentColor" /> Start
          </button>
          <button type="button" className="workout-button workout-button--ghost" onClick={onOpen}>
            <Edit3 size={18} /> Edit
          </button>
        </div>
      )}
    </article>
  );
};
