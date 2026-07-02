import { CalendarDays, ChevronRight, Clock3, Star } from 'lucide-react';
import { exercisesById } from '../data/exercises';
import { completedBlockCount, formatDuration, workingSetCount } from '../lib/session';
import type { WorkoutSession } from '../types';
import { MediaFrame } from './MediaFrame';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  onOpenPlaylist: (playlistId: string) => void;
}

const isThisWeek = (date: Date) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return date >= start;
};

const mostPlayed = (sessions: WorkoutSession[]): string => {
  const counts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.playlistName] = (acc[session.playlistName] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None yet';
};

export const HistoryView = ({ sessions, onOpenPlaylist }: HistoryViewProps) => {
  const thisWeek = sessions.filter((session) => isThisWeek(new Date(session.completedAt)));
  const totalSeconds = thisWeek.reduce((total, session) => total + session.durationSeconds, 0);

  return (
    <section className="workout-screen">
      <header className="workout-hero">
        <h1>History</h1>
        <p>Completed workouts and notes</p>
      </header>

      <div className="history-summary">
        <div>
          <CalendarDays size={22} />
          <span>This week</span>
          <strong>{thisWeek.length}</strong>
          <small>workouts</small>
        </div>
        <div>
          <Clock3 size={22} />
          <span>Time trained</span>
          <strong>{formatDuration(totalSeconds)}</strong>
        </div>
        <div>
          <Star size={22} />
          <span>Most played</span>
          <strong>{mostPlayed(sessions)}</strong>
        </div>
      </div>

      <div className="history-list">
        {sessions.length === 0 && (
          <div className="history-empty">
            <strong>No completed workouts yet</strong>
            <p>Finish a workout and it will appear here with sets, notes, and useful progression hints.</p>
          </div>
        )}
        {sessions.map((session) => {
          const firstExerciseId = session.blocks.find((block) => block.sets.length > 0)?.exerciseId;
          const exercise = firstExerciseId ? exercisesById.get(firstExerciseId) : undefined;
          return (
            <button
              key={session.id}
              type="button"
              className="history-row"
              onClick={() => onOpenPlaylist(session.playlistId)}
            >
              {exercise ? (
                <MediaFrame exercise={exercise} compact interactive={false} />
              ) : (
                <div className="history-row__blank" />
              )}
              <span>
                <strong>{session.playlistName}</strong>
                <small>
                  {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
                    new Date(session.completedAt),
                  )}{' '}
                  · {formatDuration(session.durationSeconds)} · {completedBlockCount(session.blocks)}/
                  {session.blocks.length} blocks
                </small>
                <em>{workingSetCount(session)} working sets logged</em>
              </span>
              <ChevronRight size={23} />
            </button>
          );
        })}
      </div>
    </section>
  );
};
