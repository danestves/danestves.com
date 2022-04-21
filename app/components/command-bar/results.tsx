// Dependencies
import * as React from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { KBarResults, useMatches } from "kbar";
import type { ActionImpl } from "kbar";

type RenderParams<T = ActionImpl | string> = {
  item: T;
  active: boolean;
};

function Results() {
  const { results } = useMatches();

  const onRender = React.useCallback(({ active, item }: RenderParams) => {
    if (typeof item === "string") {
      return <h2 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-200">{item}</h2>;
    }

    const Icon = item?.icon as unknown as string | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);

    return (
      <div className="text-sm text-gray-700 dark:text-gray-400">
        <div
          className={clsx(
            "flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm transition duration-200",
            active && "bg-gray-800 bg-opacity-5 text-gray-900 dark:bg-opacity-100 dark:text-white"
          )}
        >
          {Icon && typeof Icon !== "string" && (
            <Icon
              className={clsx(
                "h-5 w-5 flex-none text-gray-900 text-opacity-40 transition duration-200 dark:text-gray-500",
                active ? "text-opacity-90 dark:text-white dark:text-opacity-100" : "text-gray-500"
              )}
            />
          )}

          {item.parent ? (
            <>
              <span
                className={clsx(
                  "transition-colors duration-200",
                  active ? "text-gray-600 dark:text-gray-500" : "text-gray-500 dark:text-gray-700"
                )}
              >
                {item.ancestors.find((ancestor) => ancestor.id === (item as ActionImpl).parent)?.name}
              </span>

              <ChevronRightIcon
                className={clsx(
                  "h-5 w-5 transition-colors duration-200",
                  active ? "text-gray-600 dark:text-gray-500" : "text-gray-500 dark:text-gray-700"
                )}
              />
            </>
          ) : null}

          <span className={clsx("flex-auto truncate", Icon && "ml-3")}>{item.name}</span>

          {item.shortcut ? (
            <span className="ml-3 flex-none text-xs font-semibold text-gray-500 dark:text-gray-400">
              <kbd className="font-sans">{item.shortcut}</kbd>
            </span>
          ) : null}
        </div>
      </div>
    );
  }, []);

  return <KBarResults items={results} onRender={onRender} />;
}

export { Results };
