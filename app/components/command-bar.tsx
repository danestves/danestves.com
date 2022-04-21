// Dependencies
import * as React from "react";
import {
  ChevronRightIcon,
  CodeIcon,
  ColorSwatchIcon,
  HomeIcon,
  MailIcon,
  PencilIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { useFetcher, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  KBarResults,
  useMatches,
  useRegisterActions,
} from "kbar";
import { Theme } from "remix-themes";
import type { Action, ActionImpl } from "kbar";

// Internals
import { externalLinks } from "~/external-links";
import { TwitterIcon } from "./icons/twitter";
import { GithubIcon } from "./icons/github";
import { YoutubeIcon } from "./icons/youtube";

type RenderParams<T = ActionImpl | string> = {
  item: T;
  active: boolean;
};

function RenderResults() {
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

type ServerAction = Omit<Action, "perform"> & {
  link: string;
};

function LoadCustomActions() {
  const [customActions, setCustomActions] = React.useState<Action[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadContent = async () => {
      const contentActions = await fetch("/api/kbar");
      const { actions } = (await contentActions.json()) as {
        actions: ServerAction[];
      };

      const newActions: Action[] = actions.map(({ link, ...props }) => ({
        ...props,
        perform: async () => navigate(link),
      }));

      setCustomActions(newActions);
    };

    if (!customActions.length) {
      loadContent().catch((error) => {
        const message = error instanceof Error ? error.message : (error as string);

        console.error(message);
      });
    }
  }, [customActions.length, navigate]);

  useRegisterActions(customActions, [customActions]);

  return null;
}

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
  ];

  return (
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

            <div className="p-2">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

export { CommandBar };

// typeof item === "string" ? (
//         <h2 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-200">{item}</h2>
//       ) : (
//         <div
//           className={clsx(
//             "flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm",
//             active ? "bg-gray-800 text-white" : "text-gray-400"
//           )}
//         >
//           {(item.icon as (props: React.SVGProps<SVGSVGElement>) => JSX.Element) ? (
//             <item.icon className="mr-2 h-4 w-4" />
//           ) : null}
//           <div className="flex items-center gap-1">
//             {item.parent && (
//               <>
//                 <span
//                   className={`text-md transition-colors ${
//                     active ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
//                   }`}
//                 >
//                   {item.ancestors.find((ancestor) => ancestor.id === (item as ActionImpl).parent)?.name}
//                 </span>
//                 <span className="text-gray-400 dark:text-gray-500">
//                   <ChevronRightIcon className="h-5 w-5" />
//                 </span>
//               </>
//             )}
//             <span className="text-md line-clamp-1 text-gray-900 dark:text-white">{item.name}</span>
//           </div>
//           {item.shortcut && (
//             <div
//               className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${
//                 active ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-800"
//               }`}
//             >
//               <span
//                 className={`font-mono text-sm font-medium leading-normal transition-colors ${
//                   active ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
//                 }`}
//               >
//                 {item.shortcut}
//               </span>
//             </div>
//           )}
//           {item.icon && <ExternalLinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
//         </div>
//       ),
