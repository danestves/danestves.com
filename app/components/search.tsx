// Dependencies
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

      toast("You can also press ⌘K to open the menu!");
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
