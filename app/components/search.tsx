// Dependencies
import { useTranslation } from "react-i18next";

// Internals
import { SearchIcon } from "./icons/search";

function Search() {
  const { t } = useTranslation("common");

  return (
    <div className="flex items-center space-x-2">
      <div className="lg:rounded-full lg:border lg:border-primary lg:p-2">
        <button
          aria-label={t("components.search.button.label")}
          className="rounded-full bg-primary p-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary"
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
