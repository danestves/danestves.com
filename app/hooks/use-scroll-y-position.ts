// Internals
import { useScrollPosition } from "./use-scroll-position";

function useScrollYPosition() {
  const { y } = useScrollPosition();

  return y;
}

export { useScrollYPosition };
