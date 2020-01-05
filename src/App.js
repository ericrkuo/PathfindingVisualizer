import React from "react";
import "./App.css";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";

function App() {
  document.title = "Pathfinding";
  return (
    <div className="App" id="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
