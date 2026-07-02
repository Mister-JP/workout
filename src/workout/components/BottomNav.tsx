import { BookOpen, Clock3, PlaySquare } from 'lucide-react';
import type { PrimaryTab } from '../types';

interface BottomNavProps {
  active: PrimaryTab;
  onNavigate: (tab: PrimaryTab) => void;
}

const items: Array<{ id: PrimaryTab; label: string; Icon: typeof PlaySquare }> = [
  { id: 'playlists', label: 'Playlists', Icon: PlaySquare },
  { id: 'library', label: 'Library', Icon: BookOpen },
  { id: 'history', label: 'History', Icon: Clock3 },
];

export const BottomNav = ({ active, onNavigate }: BottomNavProps) => (
  <nav className="workout-tabbar" aria-label="Workout app">
    {items.map(({ id, label, Icon }) => (
      <button
        key={id}
        type="button"
        className={`workout-tabbar__item ${active === id ? 'is-active' : ''}`}
        onClick={() => onNavigate(id)}
        aria-current={active === id ? 'page' : undefined}
      >
        <Icon size={24} strokeWidth={active === id ? 2.6 : 2} />
        <span>{label}</span>
      </button>
    ))}
  </nav>
);
