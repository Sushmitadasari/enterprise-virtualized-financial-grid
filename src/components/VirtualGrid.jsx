import React, { useMemo } from "react";
import { useVirtualScroll } from "../hooks/useVirtualScroll";
import GridRow from "./GridRow";

const ROW_HEIGHT = 40;

export default function VirtualGrid({ data }) {
  const { containerRef, visibleRange, totalHeight } =
    useVirtualScroll(data, ROW_HEIGHT);

  const [start, end] = visibleRange;

  const visibleRows = useMemo(
    () => data.slice(start, end),
    [data, start, end]
  );

  return (
    <div
      ref={containerRef}
      data-test-id="grid-scroll-container"
      style={{
        height: "600px",
        overflowY: "scroll",
        position: "relative"
      }}
    >
      <div style={{ height: totalHeight }} />

      <div
        data-test-id="grid-row-window"
        style={{
          position: "absolute",
          top: 0,
          transform: `translateY(${start * ROW_HEIGHT}px)`
        }}
      >
        {visibleRows.map((row, index) => (
          <GridRow
            key={row.id}
            row={row}
            rowIndex={start + index}
          />
        ))}
      </div>
    </div>
  );
}