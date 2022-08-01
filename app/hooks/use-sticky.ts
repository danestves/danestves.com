// Dependencies
import { useEffect, useState } from "react";

function useSticky(position = 64) {
  const [isShrunk, setShrunk] = useState(false);

  useEffect(() => {
    setShrunk((isShrunk) => {
      if (!isShrunk && (document.body.scrollTop > position || document.documentElement.scrollTop > position)) {
        return true;
      }

      if (isShrunk && document.body.scrollTop < position && document.documentElement.scrollTop < position) {
        return false;
      }

      return isShrunk;
    });
  }, [position]);

  useEffect(() => {
    function handler() {
      setShrunk((isShrunk) => {
        if (!isShrunk && (document.body.scrollTop > position || document.documentElement.scrollTop > position)) {
          return true;
        }

        if (isShrunk && document.body.scrollTop < position && document.documentElement.scrollTop < position) {
          return false;
        }

        return isShrunk;
      });
    }

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, [position]);

  return isShrunk;
}

export { useSticky };
