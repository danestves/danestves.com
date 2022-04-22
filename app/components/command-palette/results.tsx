// Dependencies
import * as React from "react";
import { ChevronRightIcon, ExclamationIcon, SupportIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { KBarResults, NO_GROUP, useKBar, useMatches } from "kbar";
import type { ActionImpl } from "kbar";

type RenderParams<T = ActionImpl | string> = {
  item: T;
  active: boolean;
};

type CommandPaletteResultsProps = {
  rawQuery: string;
};

function Results({ rawQuery }: CommandPaletteResultsProps) {
  const { results } = useMatches();
  const kbar = useKBar();

  React.useEffect(() => {
    if (rawQuery === "#") {
      kbar.query.setCurrentRootAction("blog");
    }
  }, [kbar.query, rawQuery]);

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
                  "h-5 w-5 flex-none transition-colors duration-200",
                  active ? "text-gray-600 dark:text-gray-500" : "text-gray-500 dark:text-gray-700"
                )}
              />
            </>
          ) : null}

          <span className={clsx("flex-auto truncate", Icon && "ml-3")}>{item.name}</span>

          {item?.shortcut?.length ? (
            <span className="inline-flex items-center space-x-1">
              {item.shortcut.map((shortcut, index) => (
                <kbd
                  className="inline-flex min-h-[2.2em] min-w-[2.2em] items-center justify-center rounded-md border border-b-2 border-gray-300 bg-gray-50 px-2 text-xs uppercase dark:border-gray-700 dark:bg-gray-900"
                  key={index}
                >
                  {shortcut}
                </kbd>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    );
  }, []);

  if (rawQuery === "?") {
    return (
      <div className="py-14 px-6 text-center text-sm sm:px-14">
        <SupportIcon aria-hidden="true" className="mx-auto h-6 w-6 text-gray-400" />
        <p className="mt-4 font-semibold text-gray-900 dark:text-gray-200">Help with searching</p>
        <p className="mt-2 text-gray-500">
          Use this tool to quickly search for blogs and projects across my entire website. You can also use the search
          modifiers found in the footer below to limit the results to just users or projects.
        </p>
      </div>
    );
  }

  if (rawQuery !== "?" && !results?.length) {
    return (
      <div className="py-14 px-6 text-center text-sm sm:px-14">
        <ExclamationIcon aria-hidden="true" className="mx-auto h-6 w-6 text-gray-400" />
        <p className="mt-4 font-semibold text-gray-900 dark:text-gray-200">No results found</p>
        <p className="mt-2 text-gray-500">We couldn't find anything with that term. Please try again.</p>
      </div>
    );
  }

  return <KBarResults items={results.filter((i) => i !== NO_GROUP)} onRender={onRender} />;
}

export { Results };
