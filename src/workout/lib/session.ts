import { playlistsById } from '../data/playlists';
import type { BlockSessionLog, Playlist, WorkoutSession } from '../types';

export const formatDuration = (seconds: number): string => {
  const minutes = Math.max(0, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours} h ${remainder} m`;
};

export const completedBlockCount = (blocks: BlockSessionLog[]): number =>
  blocks.filter((block) => !block.skipped && block.sets.length > 0).length;

export const skippedBlockCount = (blocks: BlockSessionLog[]): number =>
  blocks.filter((block) => block.skipped).length;

export const workingSetCount = (session: WorkoutSession): number =>
  session.blocks.reduce((total, block) => total + block.sets.length, 0);

export const mostTimeSpentExercise = (session: WorkoutSession): string => {
  const playlist = playlistsById.get(session.playlistId);
  if (!playlist) return '';

  const completedIds = new Set(session.blocks.map((block) => block.blockId));
  const longest = playlist.blocks
    .filter((block) => completedIds.has(block.id))
    .sort((a, b) => b.estimatedMinutes - a.estimatedMinutes)[0];

  const sessionBlock = longest ? session.blocks.find((block) => block.blockId === longest.id) : undefined;
  return sessionBlock?.exerciseId ?? '';
};

export const estimatedPlaylistMinutes = (playlist: Playlist): number =>
  playlist.blocks.reduce((total, block) => total + block.estimatedMinutes, 0);

export const createSessionId = (startedAt = new Date()): string =>
  `session-${startedAt.toISOString()}-${Math.random().toString(16).slice(2)}`;
