// Internals
import { useScrollPosition } from "./use-scroll-position";

function useScrollXPosition() {
  const { x } = useScrollPosition();

  return x;
}

export { useScrollXPosition };
