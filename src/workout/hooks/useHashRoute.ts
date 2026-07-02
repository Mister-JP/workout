import { useEffect, useState } from 'react';
import type { PrimaryTab } from '../types';

export type WorkoutRoute =
  | { screen: PrimaryTab }
  | { screen: 'playlist'; playlistId: string }
  | { screen: 'exercise'; exerciseId: string; playlistId?: string }
  | { screen: 'active'; playlistId: string };

const parseRoute = (hash: string): WorkoutRoute => {
  const value = hash.replace(/^#\/?/, '');
  const [screen, id, extra] = value.split('/');

  if (screen === 'library' || screen === 'history' || screen === 'playlists') {
    return { screen };
  }
  if (screen === 'playlist' && id) return { screen: 'playlist', playlistId: id };
  if (screen === 'exercise' && id) return { screen: 'exercise', exerciseId: id, playlistId: extra };
  if (screen === 'active' && id) return { screen: 'active', playlistId: id };
  return { screen: 'playlists' };
};

const routeToHash = (route: WorkoutRoute): string => {
  if (route.screen === 'playlist') return `#/playlist/${route.playlistId}`;
  if (route.screen === 'exercise') {
    return `#/exercise/${route.exerciseId}${route.playlistId ? `/${route.playlistId}` : ''}`;
  }
  if (route.screen === 'active') return `#/active/${route.playlistId}`;
  return `#/${route.screen}`;
};

export const useHashRoute = () => {
  const [route, setRouteState] = useState<WorkoutRoute>({ screen: 'playlists' });

  useEffect(() => {
    const update = () => setRouteState(parseRoute(window.location.hash));
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [route]);

  const setRoute = (next: WorkoutRoute) => {
    const hash = routeToHash(next);
    if (window.location.hash === hash) {
      setRouteState(next);
      return;
    }
    window.location.hash = hash;
  };

  return { route, setRoute };
};
