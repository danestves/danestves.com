// Dependencies
import * as React from "react";
import {
  ClipboardIcon,
  CodeIcon,
  ColorSwatchIcon,
  HomeIcon,
  MailIcon,
  PencilIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { useFetcher, useNavigate } from "@remix-run/react";
import * as Fathom from "fathom-client";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar";
import toast from "react-hot-toast";
import { Theme } from "remix-themes";
import type { Action } from "kbar";

// Internals
import { TwitterIcon } from "~/components/icons/twitter";
import { GithubIcon } from "~/components/icons/github";
import { YoutubeIcon } from "~/components/icons/youtube";
import { externalLinks } from "~/external-links";
import { useMatchesData } from "~/hooks/use-matches-data";
import { removeTrailingSlash } from "~/utils/misc";
import { Results } from "./results";
import { Footer } from "./footer";
import type { RootLoaderData } from "~/root";

function CommandPalette({ children }: { children?: React.ReactNode }) {
  const persistTheme = useFetcher();
  const persistLanguage = useFetcher();
  const persistThemeRef = React.useRef(persistTheme);
  const persistLanguageRef = React.useRef(persistLanguage);
  const navigate = useNavigate();
  const rootData = useMatchesData<RootLoaderData>("root");

  const changeTheme = (theme: Theme) => {
    persistThemeRef.current.submit({ theme }, { action: "_action/set-theme", method: "post" });
  };

  const changeLanguage = async (lang: string) => {
    persistLanguageRef.current.submit({ lang }, { action: "_action/set-language", method: "post" });
  };

  // @ts-ignore
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
      id: "light",
      name: "Light",
      keywords: "light",
      parent: "theme",
      perform: () => changeTheme(Theme.LIGHT),
      shortcut: ["l"],
    },
    {
      id: "dark",
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
      id: "en",
      name: "English",
      keywords: "english ingles en",
      parent: "language",
      perform: () => changeLanguage("en"),
      shortcut: ["e"],
    },
    {
      id: "es",
      name: "Español",
      keywords: "spanish español es",
      parent: "language",
      perform: () => changeLanguage("es"),
      shortcut: ["s"],
    },
    {
      id: "copy-to-clipboard",
      name: "Copy URL to clipboard",
      icon: ClipboardIcon,
      keywords: "copy to clipboard copiar",
      perform: async () => {
        await navigator.clipboard.writeText(
          removeTrailingSlash(`${rootData?.requestInfo.origin}${rootData?.requestInfo.path}`)
        );

        toast.success("Copied to clipboard!", {
          className:
            "bg-white text-body border border-black border-opacity-5 dark:bg-body-darker dark:text-body-dark dark:border-white dark:border-opacity-5",
          duration: 3000,
        });
      },
      section: "Utilities",
      shortcut: ["c", "c"],
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
    <>
      {/* @ts-ignore */}
      <KBarProvider
        actions={[...actions]}
        options={{
          animations: {
            enterMs: 250,
            exitMs: 100,
          },
        }}
      >
        <KBarPortal>
          {/* @ts-ignore */}
          <KBarPositioner className="z-30 bg-white/80 backdrop-blur transition-colors duration-500 dark:bg-gray-900/80">
            {/* @ts-ignore */}
            <KBarAnimator className="mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-white ring-1 ring-black ring-opacity-5 drop-shadow-2xl transition duration-200 dark:bg-gray-900 dark:ring-white dark:ring-opacity-5">
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

              <Footer key="kbar-footer" />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        {children}
      </KBarProvider>
    </>
  );
}

export default CommandPalette;