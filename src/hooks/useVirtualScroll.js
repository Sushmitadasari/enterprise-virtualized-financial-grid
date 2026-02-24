import { useState, useRef, useEffect } from "react";

export function useVirtualScroll(data, rowHeight = 40, buffer = 10) {
  const containerRef = useRef(null);

  const [visibleRange, setVisibleRange] = useState([0, 50]);

  const totalHeight = data.length * rowHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const updateVisibleRange = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const startIndex = Math.floor(scrollTop / rowHeight);
      const visibleCount = Math.ceil(containerHeight / rowHeight);

      const endIndex = startIndex + visibleCount + buffer;

      setVisibleRange([
        Math.max(0, startIndex - buffer),
        Math.min(data.length, endIndex)
      ]);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVisibleRange);
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll);

    // initialize on mount
    updateVisibleRange();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [data.length, rowHeight, buffer]);

  return { containerRef, visibleRange, totalHeight };
}