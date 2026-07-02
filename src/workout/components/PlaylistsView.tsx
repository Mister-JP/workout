import { playlists } from '../data/playlists';
import type { WorkoutSession } from '../types';
import { PlaylistCard } from './PlaylistCard';

interface PlaylistsViewProps {
  sessions: WorkoutSession[];
  onOpenPlaylist: (playlistId: string) => void;
  onStartPlaylist: (playlistId: string) => void;
}

export const PlaylistsView = ({ sessions, onOpenPlaylist, onStartPlaylist }: PlaylistsViewProps) => (
  <section className="workout-screen">
    <header className="workout-hero">
      <h1>Playlists</h1>
      <p>Your saved workout flows</p>
    </header>

    <div className="playlist-list">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          sessions={sessions}
          onOpen={() => onOpenPlaylist(playlist.id)}
          onStart={() => onStartPlaylist(playlist.id)}
        />
      ))}
    </div>
  </section>
);
