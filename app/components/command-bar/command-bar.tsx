// Dependencies
import * as React from "react";
import { CodeIcon, ColorSwatchIcon, HomeIcon, MailIcon, PencilIcon, TranslateIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { useFetcher, useNavigate } from "@remix-run/react";
import * as Fathom from "fathom-client";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar";
import { Theme } from "remix-themes";
import type { Action } from "kbar";

// Internals
import { TwitterIcon } from "~/components/icons/twitter";
import { GithubIcon } from "~/components/icons/github";
import { YoutubeIcon } from "~/components/icons/youtube";
import { externalLinks } from "~/external-links";
import { Results } from "./results";

function CommandBar({ children }: { children?: React.ReactNode }) {
  const persistTheme = useFetcher();
  const persistLanguage = useFetcher();
  const persistThemeRef = React.useRef(persistTheme);
  const persistLanguageRef = React.useRef(persistLanguage);
  const navigate = useNavigate();

  const changeTheme = (theme: Theme) => {
    persistThemeRef.current.submit({ theme }, { action: "_action/set-theme", method: "post" });
  };

  const changeLanguage = async (lang: string) => {
    persistLanguageRef.current.submit({ lang }, { action: "_action/set-language", method: "post" });
  };

  const actions: Array<Action> = [
    {
      id: "home",
      name: "Home",
      icon: HomeIcon,
      keywords: "home inicio",
      perform: () => navigate("/"),
      section: "Pages",
      shortcut: ["h"],
    },
    {
      id: "blog",
      name: "Blog",
      icon: PencilIcon,
      keywords: "blog blogs post posts",
      section: "Pages",
      shortcut: ["b"],
    },
    {
      id: "contact",
      name: "Contact",
      icon: MailIcon,
      keywords: "contact contacto mail",
      perform: () => navigate("/contact"),
      section: "Pages",
      shortcut: ["c"],
    },
    {
      id: "theme",
      name: "Change theme...",
      icon: ColorSwatchIcon,
      keywords: "theme",
      section: "Utilities",
      shortcut: ["t"],
    },
    {
      id: "light-mode",
      name: "Light",
      keywords: "light",
      parent: "theme",
      perform: () => changeTheme(Theme.LIGHT),
      shortcut: ["l"],
    },
    {
      id: "dark-mode",
      name: "Dark",
      keywords: "dark",
      parent: "theme",
      perform: () => changeTheme(Theme.DARK),
      shortcut: ["d"],
    },
    {
      id: "language",
      name: "Change language...",
      icon: TranslateIcon,
      keywords: "language i18n spanish english español ingles en es",
      section: "Utilities",
      shortcut: ["l"],
    },
    {
      id: "en-i18n",
      name: "English",
      keywords: "english ingles en",
      parent: "language",
      perform: () => changeLanguage("en"),
      shortcut: ["e"],
    },
    {
      id: "es-i18n",
      name: "Español",
      keywords: "spanish español es",
      parent: "language",
      perform: () => changeLanguage("es"),
      shortcut: ["s"],
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: TwitterIcon,
      keywords: "twitter",
      perform: () => window.open(externalLinks.twitterFollow, "_blank"),
      section: "Social",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: YoutubeIcon,
      keywords: "youtube",
      perform: () => window.open(externalLinks.youtube, "_blank"),
      section: "Social",
    },
    {
      id: "github",
      name: "GitHub",
      icon: GithubIcon,
      keywords: "github",
      perform: () => window.open(externalLinks.github, "_blank"),
      section: "Social",
    },
    {
      id: "source-code",
      name: "View source code",
      icon: CodeIcon,
      keywords: "source code codigo fuente",
      perform: () => window.open(externalLinks.githubSourceCode, "_blank"),
      section: "Social",
    },
  ].map((action) => {
    const obj = { ...action };

    if (action.perform) {
      obj.perform = async () => {
        action.perform();

        const prefix = action.parent ? `${action.parent}-` : "";
        Fathom.trackGoal(`cmd-${prefix}${action.id}`, 0);
      };
    }

    return obj;
  });

  return (
    <KBarProvider
      actions={[...actions]}
      options={{
        animations: {
          enterMs: 250,
          exitMs: 100,
        },
        enableHistory: true,
      }}
    >
      <KBarPortal>
        <KBarPositioner className="z-30 bg-white/80 backdrop-blur transition-colors duration-500 dark:bg-gray-900/80">
          <KBarAnimator className="mx-auto w-full max-w-xl divide-y divide-gray-500 divide-opacity-10 overflow-hidden rounded-xl bg-white drop-shadow-2xl transition duration-200 dark:divide-opacity-20 dark:bg-gray-900">
            {/* Search */}
            <div className="relative border-b border-gray-500 border-opacity-10 dark:border-opacity-20">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-900 text-opacity-40 transition duration-200 dark:text-gray-500 dark:text-opacity-100"
              />

              <KBarSearch
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder-gray-500 outline-none transition duration-200 focus:ring-0 dark:text-white sm:text-sm"
                placeholder="Search..."
              />
            </div>

            {/* Results */}
            <div className="p-2">
              <Results />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

export default CommandBar;
