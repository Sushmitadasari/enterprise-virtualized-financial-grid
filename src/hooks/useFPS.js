import { useEffect, useState } from "react";

export function useFPS() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();

    function loop(time) {
      frame++;
      if (time >= lastTime + 1000) {
        setFps(frame);
        frame = 0;
        lastTime = time;
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, []);

  return fps;
}