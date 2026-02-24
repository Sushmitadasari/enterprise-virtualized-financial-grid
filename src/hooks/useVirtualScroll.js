import { useState, useRef, useEffect } from "react";

export function useVirtualScroll(data, rowHeight = 40, buffer = 10) {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState([0, 50]);
  const totalHeight = data.length * rowHeight;

  useEffect(() => {
    const container = containerRef.current;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const startIndex = Math.floor(scrollTop / rowHeight);
          const visibleCount = Math.ceil(container.clientHeight / rowHeight);
          const endIndex = startIndex + visibleCount + buffer;

          setVisibleRange([startIndex, endIndex]);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [data.length]);

  return { containerRef, visibleRange, totalHeight };
}