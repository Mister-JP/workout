import { ExternalLink, Pause, Play } from "lucide-react";
import { useRef, useState } from 'react';
import { mediaByExerciseId } from '../data/media';
import type { Exercise } from '../types';

interface MediaFrameProps {
  exercise: Exercise;
  compact?: boolean;
  dark?: boolean;
  interactive?: boolean;
}

const getDvidsEmbedUrl = (sourceUrl = "") => {
  const match = sourceUrl.match(/dvidshub\.net\/video\/(\d+)/);
  return match ? `https://www.dvidshub.net/video/embed/${match[1]}` : "";
};

const getYouTubeEmbedUrl = (sourceUrl = "") => {
  const watchMatch = sourceUrl.match(/[?&]v=([^&]+)/);
  const shortMatch = sourceUrl.match(/youtu\.be\/([^?&]+)/);
  const embedId = watchMatch?.[1] ?? shortMatch?.[1] ?? "";
  return embedId
    ? `https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${embedId}&rel=0&modestbranding=1`
    : "";
};

const getEmbedUrl = (sourcePlatform = "", sourceUrl = "") => {
  if (sourcePlatform === "DVIDS") return getDvidsEmbedUrl(sourceUrl);
  if (sourcePlatform === "YouTube") return getYouTubeEmbedUrl(sourceUrl);
  return "";
};

export const MediaFrame = ({
  exercise,
  compact = false,
  dark = false,
  interactive = true,
}: MediaFrameProps) => {
  const media = mediaByExerciseId.get(exercise.primaryMediaId) ?? mediaByExerciseId.get(exercise.id);
  const referenceUrl = media?.sourceUrl || exercise.fallbackReferenceUrl;
  const sourceLabel = media?.sourcePlatform
    ? `${media.sourcePlatform} guide`
    : "Form guide";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const videoSrc = media?.localFile || "";
  const posterSrc = media?.posterFile || "";
  const hasLocalVideo = Boolean(videoSrc && !mediaFailed);
  const embedSrc = !hasLocalVideo
    ? getEmbedUrl(media?.sourcePlatform, media?.sourceUrl)
    : "";
  const hasEmbedVideo = Boolean(embedSrc);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || !media?.localFile) return;
    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setMediaFailed(true);
      }
      return;
    }
    video.pause();
    setPlaying(false);
  };

  return (
    <div className={`workout-media ${compact ? 'workout-media--compact' : ''} ${dark ? 'workout-media--dark' : ''}`}>
      {hasLocalVideo && interactive ? (
        <button className="workout-media__button" type="button" onClick={togglePlayback} aria-label={`${playing ? 'Pause' : 'Play'} ${exercise.name} demo`}>
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setMediaFailed(true)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
          <span className="workout-media__control workout-media__control--mini" aria-hidden="true">
            {playing ? <Pause size={compact ? 18 : 30} /> : <Play size={compact ? 18 : 30} fill="currentColor" />}
          </span>
        </button>
      ) : hasLocalVideo ? (
        <div className="workout-media__button workout-media__button--passive" aria-label={`${exercise.name} reference preview`}>
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setMediaFailed(true)}
          />
        </div>
      ) : hasEmbedVideo ? (
        <iframe
          className="workout-media__embed"
          src={embedSrc}
          title={`${exercise.name} form video`}
          loading="eager"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <div className="workout-media__fallback" role="img" aria-label={`${exercise.name} form guide`}>
          <div>
            <span className="workout-media__initial">{exercise.name.slice(0, 1)}</span>
            <strong>{exercise.name}</strong>
            <small>{sourceLabel}</small>
          </div>
          <span className="workout-media__source-pill">Guide</span>
          {interactive && (
            <a href={referenceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${exercise.name} form reference`}>
              {!compact && <span>Open reference</span>}
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
