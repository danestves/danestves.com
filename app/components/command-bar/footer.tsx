// Dependencies
import * as React from "react";
import clsx from "clsx";
import { KBarContext } from "kbar";

function Footer() {
  const { getState: getQuery } = React.useContext(KBarContext);
  const rawQuery = getQuery().searchQuery;

  return (
    <div className="flex flex-wrap items-center border-t border-gray-500 border-opacity-10 bg-gray-50 py-2.5 px-4 text-xs text-gray-700 transition-colors duration-200 dark:border-opacity-20 dark:bg-gray-800/50 dark:text-gray-200">
      Type{" "}
      <kbd
        className={clsx(
          "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold dark:bg-gray-900 sm:mx-2",
          rawQuery === "?" ? "border-primary-600 text-primary-600" : "border-gray-400 text-gray-900 dark:text-white"
        )}
      >
        ?
      </kbd>{" "}
      for help.
    </div>
  );
}

export { Footer };
