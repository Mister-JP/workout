import { Maximize2, Play, Pause, ExternalLink } from 'lucide-react';
import { useRef, useState } from 'react';
import { mediaByExerciseId } from '../data/media';
import type { Exercise } from '../types';

interface MediaFrameProps {
  exercise: Exercise;
  compact?: boolean;
  dark?: boolean;
  interactive?: boolean;
}

export const MediaFrame = ({
  exercise,
  compact = false,
  dark = false,
  interactive = true,
}: MediaFrameProps) => {
  const media = mediaByExerciseId.get(exercise.primaryMediaId) ?? mediaByExerciseId.get(exercise.id);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || !media?.localFile) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
      return;
    }
    video.pause();
    setPlaying(false);
  };

  return (
    <div className={`workout-media ${compact ? 'workout-media--compact' : ''} ${dark ? 'workout-media--dark' : ''}`}>
      {media?.localFile && interactive ? (
        <button className="workout-media__button" type="button" onClick={togglePlayback} aria-label={`${playing ? 'Pause' : 'Play'} ${exercise.name} reference`}>
          <video
            ref={videoRef}
            src={media.localFile}
            poster={media.posterFile}
            muted
            loop
            playsInline
            preload="metadata"
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
          <span className="workout-media__control" aria-hidden="true">
            {playing ? <Pause size={compact ? 18 : 30} /> : <Play size={compact ? 18 : 30} fill="currentColor" />}
          </span>
          {!compact && (
            <span className="workout-media__corner" aria-hidden="true">
              <Maximize2 size={18} />
            </span>
          )}
        </button>
      ) : media?.localFile ? (
        <div className="workout-media__button workout-media__button--passive" aria-label={`${exercise.name} reference preview`}>
          <img src={media.posterFile} alt="" loading="lazy" />
          <span className="workout-media__control" aria-hidden="true">
            <Play size={compact ? 18 : 30} fill="currentColor" />
          </span>
        </div>
      ) : (
        <div className="workout-media__fallback" role="img" aria-label={`${exercise.name} reference pending`}>
          <div>
            <span className="workout-media__initial">{exercise.name.slice(0, 1)}</span>
            <strong>{exercise.name}</strong>
            <small>External reference only</small>
          </div>
          {interactive && (
            <a href={exercise.fallbackReferenceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${exercise.name} form reference`}>
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
