// Dependencies
import * as React from "react";

interface IGeneralObserverProps {
  children?: React.ReactNode;
  /** The height of the placeholder div before the component renders in */
  height?: number;
  /** Fires when IntersectionObserver enters viewport */
  onEnter?: (id?: string) => void;
}

function GeneralObserver({ children, onEnter, height = 0 }: IGeneralObserverProps) {
  const [isChildVisible, setIsChildVisible] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) {
          setIsChildVisible(true);
          onEnter && onEnter();
        }
      },
      {
        root: null,
        rootMargin: "400px",
        threshold: 0,
      }
    );

    if (ref && ref.current) {
      observer.observe(ref.current);
    }
  }, [onEnter, ref]);

  return (
    <div className="general-observer" ref={ref as React.RefObject<HTMLDivElement>}>
      {isChildVisible ? children : <div style={{ height, width: "100%" }} />}
    </div>
  );
}

export default GeneralObserver;
