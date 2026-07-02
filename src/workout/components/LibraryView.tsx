import { Bookmark, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { exercises } from '../data/exercises';
import { mediaByExerciseId } from '../data/media';
import type { Exercise } from '../types';
import { MediaFrame } from './MediaFrame';

interface LibraryViewProps {
  favoriteIds: string[];
  onOpenExercise: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
}

type LibraryTab = 'exercises' | 'playlists' | 'mobility' | 'saved';

const tabs: Array<{ id: LibraryTab; label: string }> = [
  { id: 'exercises', label: 'Exercises' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'saved', label: 'Saved' },
];

const matchesTab = (exercise: Exercise, tab: LibraryTab, favoriteIds: string[]) => {
  if (tab === 'mobility') return exercise.role === 'mobility';
  if (tab === 'saved') return favoriteIds.includes(exercise.id);
  return true;
};

export const LibraryView = ({ favoriteIds, onOpenExercise, onToggleFavorite }: LibraryViewProps) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<LibraryTab>('exercises');

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return exercises.filter((exercise) => {
      const searchable = `${exercise.name} ${exercise.muscles} ${exercise.equipment}`.toLowerCase();
      return matchesTab(exercise, tab, favoriteIds) && (!needle || searchable.includes(needle));
    });
  }, [favoriteIds, query, tab]);

  return (
    <section className="workout-screen">
      <header className="workout-hero">
        <h1>Library</h1>
        <p>Your vetted exercise clips</p>
      </header>

      <div className="library-search">
        <label>
          <Search size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search exercises, muscles, equipment..."
          />
        </label>
        <button type="button" aria-label="Filter library">
          <Filter size={22} />
        </button>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Library sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="library-list">
        {filtered.map((exercise) => {
          const media = mediaByExerciseId.get(exercise.primaryMediaId) ?? mediaByExerciseId.get(exercise.id);
          return (
            <article key={exercise.id} className="library-row">
              <button type="button" className="library-row__open" onClick={() => onOpenExercise(exercise.id)}>
                <MediaFrame exercise={exercise} compact interactive={false} />
                <span>
                  <strong>{exercise.name}</strong>
                  <small>
                    {exercise.muscles} · {exercise.equipment}
                  </small>
                  <em>{media?.localFile ? 'Local clip' : 'External reference'}</em>
                </span>
              </button>
              <button
                type="button"
                className="library-row__save"
                onClick={() => onToggleFavorite(exercise.id)}
                aria-label={`${favoriteIds.includes(exercise.id) ? 'Unsave' : 'Save'} ${exercise.name}`}
              >
                <Bookmark size={23} fill={favoriteIds.includes(exercise.id) ? 'currentColor' : 'none'} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
