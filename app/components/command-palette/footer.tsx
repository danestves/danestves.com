// Dependencies
import clsx from "clsx";

type CommandPaletteFooterProps = {
  rawQuery: string;
};

function Footer({ rawQuery }: CommandPaletteFooterProps) {
  return (
    <div className="flex flex-wrap items-center border-t border-gray-500 border-opacity-10 bg-gray-50 py-2.5 px-4 text-xs text-gray-700 transition-colors duration-200 dark:border-opacity-20 dark:bg-gray-800/50 dark:text-gray-200">
      Type{" "}
      <kbd
        className={clsx(
          "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold dark:bg-gray-900 sm:mx-2",
          rawQuery === "#" ? "border-primary-600 text-primary-600" : "border-gray-400 text-gray-900 dark:text-white"
        )}
      >
        #
      </kbd>{" "}
      for blogs and{""}
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
