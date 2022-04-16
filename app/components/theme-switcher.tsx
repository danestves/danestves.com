// Dependencies
import * as React from "react";
import { Switch } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Theme, useTheme } from "remix-themes";

// Internals
import { useMatchesData } from "~/hooks/use-matches-data";
import { MoonIcon } from "./icons/moon";
import { Themed } from "./themed";
import type { RootLoaderData } from "~/root";

function ThemeSwitcher() {
  let { t } = useTranslation("common");
  let [theme] = useTheme();
  const persistTheme = useFetcher();
  const persistThemeRef = React.useRef(persistTheme);
  const data = useMatchesData<RootLoaderData>("root");

  const onChange = (_checked: boolean) => {
    persistThemeRef.current.submit(
      { theme: data?.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK },
      { action: "action/set-theme", method: "post" }
    );
  };

  return (
    <Switch
      aria-label="Toggle dark mode"
      checked={theme === Theme.DARK}
      className="inline-flex rounded-full bg-primary p-2 text-white transition-colors duration-100 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary dark:text-body-darker"
      defaultChecked={theme === Theme.DARK}
      onChange={onChange}
    >
      <MoonIcon className="inline-block h-auto w-[21px]" />

      <span className="sr-only">
        <Themed dark={t("header.switcher.theme.dark")} light={t("header.switcher.theme.light")} />
      </span>
    </Switch>
  );
}

export { ThemeSwitcher };
