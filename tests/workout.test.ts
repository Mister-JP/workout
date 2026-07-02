import { describe, expect, it } from 'vitest';
import { exercisesById } from '../src/workout/data/exercises';
import { playlists } from '../src/workout/data/playlists';
import { getProgressionSuggestion } from '../src/workout/lib/progression';
import { completedBlockCount, estimatedPlaylistMinutes, workingSetCount } from '../src/workout/lib/session';
import { getBestSubstitution } from '../src/workout/lib/substitutions';
import { appendSession, historyKey, readHistory } from '../src/workout/lib/storage';
import type { WorkoutSession } from '../src/workout/types';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const session: WorkoutSession = {
  id: 'test-session',
  playlistId: 'lower-a',
  playlistName: 'Lower A — Glutes + Quads',
  startedAt: '2026-07-01T10:00:00.000Z',
  completedAt: '2026-07-01T10:50:00.000Z',
  durationSeconds: 3000,
  notes: [],
  blocks: [
    {
      blockId: 'lower-a-glute-extension',
      exerciseId: 'barbell-hip-thrust',
      skipped: false,
      sets: [
        { setNumber: 1, reps: 10, weight: 80, completedAt: '2026-07-01T10:10:00.000Z', notes: [] },
        { setNumber: 2, reps: 10, weight: 80, completedAt: '2026-07-01T10:13:00.000Z', notes: [] },
      ],
    },
    {
      blockId: 'lower-a-quad-compound',
      exerciseId: 'leg-press',
      skipped: true,
      sets: [],
    },
  ],
};

describe('workout playlists', () => {
  it('contains the required default playlist structure', () => {
    expect(playlists.map((playlist) => playlist.name)).toEqual([
      'Lower A — Glutes + Quads',
      'Upper + Abs',
      'Upper A — Machines + Dumbbells',
      'Upper B — Pull + Posture',
      'Upper C — Push + Abs',
      'Lower B — Hamstrings + Glutes',
      'Machine Reset — Low-Energy, Still Show Up',
    ]);
    expect(playlists[0].blocks).toHaveLength(7);
    expect(playlists.find((playlist) => playlist.id === 'machine-reset')?.blocks).toHaveLength(6);
    for (const playlist of playlists) {
      expect(estimatedPlaylistMinutes(playlist)).toBeGreaterThan(25);
      for (const block of playlist.blocks) {
        expect(exercisesById.get(block.selectedExerciseId)).toBeDefined();
        for (const id of block.exerciseIds) {
          expect(exercisesById.get(id), `${playlist.id}:${block.id}:${id}`).toBeDefined();
        }
      }
    }
  });
});

describe('substitutions', () => {
  it('keeps substitutions inside the same workout block', () => {
    const block = playlists[0].blocks[1];
    const next = getBestSubstitution(block, 'rack_busy', 'barbell-hip-thrust');
    expect(block.exerciseIds).toContain(next);
    expect(next).toBe('dumbbell-hip-thrust');
  });
});

describe('local persistence', () => {
  it('appends sessions to local storage history', () => {
    const storage = new MemoryStorage();
    appendSession(session, storage);
    expect(storage.getItem(historyKey)).toContain('test-session');
    expect(readHistory(storage).sessions).toHaveLength(1);
  });
});

describe('session calculations', () => {
  it('counts completed blocks and working sets', () => {
    expect(completedBlockCount(session.blocks)).toBe(1);
    expect(workingSetCount(session)).toBe(2);
  });
});

describe('progression suggestions', () => {
  it('suggests progression only after all sets hit the top of range', () => {
    const log = {
      blockId: 'x',
      exerciseId: 'barbell-hip-thrust',
      skipped: false,
      sets: [
        { setNumber: 1, reps: 10, weight: 80, completedAt: 'x', notes: [] },
        { setNumber: 2, reps: 10, weight: 80, completedAt: 'x', notes: [] },
        { setNumber: 3, reps: 10, weight: 80, completedAt: 'x', notes: [] },
        { setNumber: 4, reps: 10, weight: 80, completedAt: 'x', notes: [] },
      ],
    };

    expect(getProgressionSuggestion({ sets: 4, repRange: '8-10' }, log)).toContain(
      'Consider the smallest available weight increase',
    );
  });
});
