// Dependencies
import { InformationCircleIcon } from "@heroicons/react/outline";
import endent from "endent";
import { useKBar } from "kbar";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

// Internals
import { SearchIcon } from "./icons/search";

function Search() {
  const kbar = useKBar();
  const { t } = useTranslation("common");

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    kbar.query.toggle();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      kbar.query.toggle();

      toast(
        <span>
          You can also press{" "}
          <kbd className="inline-flex min-h-[2.2em] min-w-[2.2em] items-center justify-center rounded-md border border-b-2 border-gray-300 bg-gray-50 px-2 text-xs dark:border-gray-400/20 dark:bg-black/20">
            Control + K
          </kbd>{" "}
          or{" "}
          <kbd className="inline-flex min-h-[2.2em] min-w-[2.2em] items-center justify-center rounded-md border border-b-2 border-gray-300 bg-gray-50 px-2 text-xs dark:border-gray-400/20 dark:bg-black/20">
            ⌘ + K
          </kbd>{" "}
          to open the menu!
        </span>,
        {
          className: endent`
          bg-white text-body border border-black border-opacity-5 dark:bg-body-darker dark:text-body-dark dark:border-white dark:border-opacity-5
        `,
          icon: "💬",
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="lg:rounded-full lg:border lg:border-primary lg:p-2">
        <button
          aria-label={t("components.search.button.label")}
          className="rounded-full bg-primary p-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary"
          onClick={onClick}
          onKeyDown={onKeyDown}
          type="button"
        >
          <SearchIcon className="h-5 w-5 text-white dark:text-body-darker" />
        </button>
      </div>
      <span className="sr-only text-xs font-semibold text-body dark:text-body-dark lg:not-sr-only">
        {t("components.search.button.label")}
      </span>
    </div>
  );
}

export { Search };
