// Dependencies
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useFathom } from "remix-fathom";
import { useChangeLanguage } from "remix-i18next";
import { PreventFlashOnWrongTheme, Theme, ThemeProvider } from "remix-themes";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

// Internals
import mainStylesheetUrl from "./styles/main.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getEnv } from "./utils/env.server";
import { i18n, i18nStorage } from "./utils/i18n.server";
import { getDomainUrl } from "./utils/misc";
import { themeSessionResolver } from "./utils/theme.server";
import type { Handle } from "./types";

export const handle: Handle = {
  i18n: "common",
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: mainStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  ENV: ReturnType<typeof getEnv>;
  locale: string;
  requestInfo: {
    origin: string;
    path: string;
  };
  user: Awaited<ReturnType<typeof getUser>>;
  theme: Theme | null;
  country?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const { getTheme } = await themeSessionResolver(request);

  const headers = new Headers();
  headers.append("Set-Cookie", await i18nStorage.serialize(locale));

  return json<LoaderData>(
    {
      ENV: getEnv(),
      locale,
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      user: await getUser(request),
      theme: getTheme() ?? Theme.DARK,
    },
    {
      headers,
    }
  );
};

function App() {
  const data = useLoaderData<LoaderData>();
  const { i18n } = useTranslation();

  useFathom("VKGOHQVT", {
    excludedDomains: ["localhost"],
    spa: "history",
    url: "https://khonshu.danestves.dev/script.js",
  });
  useChangeLanguage(data.locale);

  return (
    <html
      lang={data.locale}
      className={clsx("h-full", data.theme)}
      dir={i18n.dir()}
    >
      <head>
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="h-full bg-white dark:bg-[#292929]">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}
