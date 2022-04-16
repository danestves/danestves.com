// Dependencies
import * as React from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

const isBrowser = typeof window !== "undefined";

function getScrollPosition(): ScrollPosition {
  if (!isBrowser) {
    return { x: 0, y: 0 };
  }

  return {
    x: window.scrollX,
    y: window.scrollY,
  };
}

function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = React.useState<ScrollPosition>(() => getScrollPosition());

  React.useEffect(() => {
    let requestRunning: number | null = null;

    function handleScroll() {
      if (isBrowser && requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          setPosition(getScrollPosition());
          requestRunning = null;
        });
      }
    }

    if (isBrowser) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return position;
}

export type { ScrollPosition };
export { useScrollPosition };
