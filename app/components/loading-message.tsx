// Dependencies
import { useEffect, useState } from "react";
import { useTransition } from "@remix-run/react";
import toast from "react-hot-toast";

const LOADER_WORDS = [
  "loading",
  "checking cdn",
  "checking cache",
  "fetching from db",
  "compiling mdx",
  "updating cache",
  "transfer",
];
const ACTION_WORDS = ["packaging", "zapping", "validating", "processing", "calculating", "computing", "computering"];

// we don't want to show the loading indicator on page load
let firstRender = true;

function LoadingMessage() {
  const transition = useTransition();
  const [words, setWords] = useState<Array<string>>([]);
  const [pendingPath, setPendingPath] = useState("");

  useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    if (transition.state === "loading") setWords(LOADER_WORDS);
    if (transition.state === "submitting") setWords(ACTION_WORDS);

    const interval = setInterval(() => {
      setWords(([first, ...rest]) => [...rest, first] as Array<string>);
    }, 2000);

    return () => clearInterval(interval);
  }, [pendingPath, transition.state]);

  useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") {
      // If the transition is idle we want to remove the toast
      // But let's wait a bit to make sure the transition is done
      setTimeout(() => {
        toast.dismiss("loading-message");
      }, 1000);

      return;
    }
    setPendingPath(transition.location.pathname);
  }, [transition]);

  useEffect(() => {
    firstRender = false;
  }, []);

  const action = words[0];
  useEffect(() => {
    if (!firstRender && action && transition.state !== "idle") {
      toast.loading(
        <div className="pointer-events-auto ml-2 rounded-lg">
          <div className="inline-grid w-64">
            <div className="col-start-1 row-start-1 mb-0.5 flex overflow-hidden">
              <span className="font-bold">{action}</span>
            </div>
            <span className="truncate text-body/60 dark:text-body-dark/60">path: {pendingPath}</span>
          </div>
        </div>,
        {
          duration: Infinity,
          id: "loading-message",
          icon: (
            <svg
              className="h-8 w-8 flex-none animate-spin text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          ),
          style: {
            // @ts-expect-error
            "--tw-shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            "--tw-shadow-colored": "0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color)",
            boxShadow: "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
            padding: "16px",
          },
        }
      );
    }
  }, [action, pendingPath, transition.state]);

  return null;
}

export { LoadingMessage };
