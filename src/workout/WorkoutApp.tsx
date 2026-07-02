import { BottomNav } from "./components/BottomNav";
import { ActiveWorkoutView } from "./components/ActiveWorkoutView";
import { ExerciseDetailView } from "./components/ExerciseDetailView";
import { HistoryView } from "./components/HistoryView";
import { LibraryView } from "./components/LibraryView";
import { PlaylistDetailView } from "./components/PlaylistDetailView";
import { PlaylistsView } from "./components/PlaylistsView";
import { playlistsById } from "./data/playlists";
import { useHashRoute } from "./hooks/useHashRoute";
import { useWorkoutStore } from "./hooks/useWorkoutStore";
import type { PrimaryTab } from "./types";
import "./styles/workout.css";

export const WorkoutApp = () => {
  const { route, setRoute } = useHashRoute();
  const {
    preferences,
    history,
    setSelectedExercise,
    toggleFavorite,
    toggleSkippedBlock,
    updateTarget,
    updateLastWeight,
    saveSession,
  } = useWorkoutStore();

  const activeTab: PrimaryTab =
    route.screen === "library" ||
    route.screen === "history" ||
    route.screen === "playlists"
      ? route.screen
      : "playlists";

  const routeToTab = (tab: PrimaryTab) => setRoute({ screen: tab });
  const openPlaylist = (playlistId: string) =>
    setRoute({ screen: "playlist", playlistId });
  const startPlaylist = (playlistId: string) =>
    setRoute({ screen: "active", playlistId });

  if (route.screen === "playlist") {
    return (
      <PlaylistDetailView
        playlistId={route.playlistId}
        preferences={preferences}
        onBack={() => setRoute({ screen: "playlists" })}
        onStart={() => startPlaylist(route.playlistId)}
        onSelectExercise={(blockId, exerciseId) =>
          setSelectedExercise(route.playlistId, blockId, exerciseId)
        }
        onOpenExercise={(exerciseId) =>
          setRoute({
            screen: "exercise",
            exerciseId,
            playlistId: route.playlistId,
          })
        }
        onUpdateTarget={(blockId, target) => updateTarget(blockId, target)}
        onToggleSkippedBlock={(blockId) =>
          toggleSkippedBlock(route.playlistId, blockId)
        }
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (route.screen === "exercise") {
    const playlist = route.playlistId
      ? playlistsById.get(route.playlistId)
      : undefined;
    const block = playlist?.blocks.find((item) =>
      item.exerciseIds.includes(route.exerciseId),
    );
    return (
      <ExerciseDetailView
        exerciseId={route.exerciseId}
        block={block}
        favoriteIds={preferences.favorites}
        onBack={() =>
          route.playlistId
            ? setRoute({ screen: "playlist", playlistId: route.playlistId })
            : setRoute({ screen: "library" })
        }
        onSelectExercise={(exerciseId) => {
          if (playlist && block) {
            setSelectedExercise(playlist.id, block.id, exerciseId);
            setRoute({ screen: "playlist", playlistId: playlist.id });
            return;
          }
          setRoute({ screen: "library" });
        }}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (route.screen === "active") {
    return (
      <ActiveWorkoutView
        playlistId={route.playlistId}
        preferences={preferences}
        onExit={() => setRoute({ screen: "history" })}
        onSwapExercise={(exerciseId) =>
          setRoute({
            screen: "exercise",
            exerciseId,
            playlistId: route.playlistId,
          })
        }
        onSaveSession={saveSession}
        onUpdateLastWeight={updateLastWeight}
      />
    );
  }

  return (
    <div className="workout-app">
      {route.screen === "library" && (
        <LibraryView
          favoriteIds={preferences.favorites}
          onOpenExercise={(exerciseId) =>
            setRoute({ screen: "exercise", exerciseId })
          }
          onToggleFavorite={toggleFavorite}
        />
      )}
      {route.screen === "history" && (
        <HistoryView
          sessions={history.sessions}
          onOpenPlaylist={openPlaylist}
        />
      )}
      {route.screen === "playlists" && (
        <PlaylistsView
          sessions={history.sessions}
          onOpenPlaylist={openPlaylist}
          onStartPlaylist={startPlaylist}
        />
      )}
      <BottomNav active={activeTab} onNavigate={routeToTab} />
    </div>
  );
};
