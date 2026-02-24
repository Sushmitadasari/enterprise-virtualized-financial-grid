import React from "react";
import { useFPS } from "../hooks/useFPS";

export default function DebugPanel({ renderedCount, scrollPosition, total }) {
  const fps = useFPS();

  return (
    <div
      data-test-id="debug-panel"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        background: "black",
        color: "lime",
        padding: 10,
        fontSize: 12
      }}
    >
      <div data-test-id="debug-fps">FPS: {fps}</div>
      <div data-test-id="debug-rendered-rows">
        Rendered Rows: {renderedCount}
      </div>
      <div data-test-id="debug-scroll-position">
        Row {scrollPosition} / {total}
      </div>
    </div>
  );
}