import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WorkoutApp } from "./workout/WorkoutApp";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <WorkoutApp />
  </StrictMode>,
);
