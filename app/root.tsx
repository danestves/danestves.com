// Dependencies
import { json } from "@remix-run/server-runtime";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import endent from "endent";
import { useTranslation } from "react-i18next";
import { useFathom } from "remix-fathom";
import { Toaster } from "react-hot-toast";
import { useChangeLanguage } from "remix-i18next";
import { PreventFlashOnWrongTheme, Theme, ThemeProvider } from "remix-themes";
import { StructuredData } from "remix-utils";
import type { HandleStructuredData } from "remix-utils";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { CommandPalette } from "./components/command-palette";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { LeftSidebar } from "./components/left-sidebar";
import { RightSidebar } from "./components/right-sidebar";
import { externalLinks } from "./external-links";
import mainStylesheetUrl from "./styles/main.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getEnv } from "./utils/env.server";
import { i18n, i18nStorage } from "./utils/i18n.server";
import { getDomainUrl, removeTrailingSlash } from "./utils/misc";
import { description as seoDescription, getSeo, getSeoMeta } from "./utils/seo";
import { themeSessionResolver } from "./utils/theme.server";
import type { Handle } from "./types";

let [seoMeta, seoLinks] = getSeo();

export const handle: HandleStructuredData<RootLoaderData> & Handle = {
  structuredData() {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Daniel Esteves - @danestves",
        url: externalLinks.self,
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        image: `${externalLinks.self}/hero-mask.png`,
        jobTitle: "Senior Frontend Engineer",
        name: "Daniel Esteves",
        sameAs: [
          externalLinks.github,
          externalLinks.instagram,
          externalLinks.linkedin,
          externalLinks.resume,
          externalLinks.self,
          externalLinks.twitter,
          externalLinks.youtube,
        ],
        url: externalLinks.self,
        worksFor: {
          "@type": "Organization",
          name: "REWORTH",
        },
      },
    ];
  },
  i18n: ["common", "pages"],
  id: "root",
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: mainStylesheetUrl },
    ...seoLinks,
  ];
};

export const meta: MetaFunction = ({ data }) => {
  const { locale } = data as RootLoaderData;

  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    ...seoMeta,
    ...getSeoMeta({
      // @ts-ignore - locale is a valid index
      description: seoDescription[locale as any].join(" "),
      openGraph: {
        images: [
          {
            alt: "Daniel Esteves - @danestves",
            url: `${externalLinks.self}/hero-mask.png`,
            height: 630,
            width: 1200,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        image: {
          alt: "Daniel Esteves - @danestves",
          url: `${externalLinks.self}/hero-mask.png`,
        },
      },
    }),
  };
};

export type RootLoaderData = {
  ENV: ReturnType<typeof getEnv>;
  locale: string;
  requestInfo: {
    origin: string;
    path: string;
  };
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const { getTheme } = await themeSessionResolver(request);

  const headers = new Headers();
  headers.append("Set-Cookie", await i18nStorage.serialize(locale));

  return json<RootLoaderData>(
    {
      ENV: getEnv(),
      locale: locale ?? "en",
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      theme: getTheme() ?? Theme.LIGHT,
    },
    {
      headers,
    }
  );
};

function App() {
  const data = useLoaderData<RootLoaderData>();
  const { i18n } = useTranslation();

  useFathom("VKGOHQVT", {
    excludedDomains: ["localhost"],
    spa: "history",
    url: "https://khonshu.danestves.dev/script.js",
  });

  return (
    <html className={clsx("h-full", data.theme)} dir={i18n.dir()} lang={data.locale}>
      <head>
        <Meta />
        <link href={removeTrailingSlash(`${data.requestInfo.origin}${data.requestInfo.path}`)} rel="canonical" />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />

        <StructuredData />
      </head>
      <body className="h-full bg-white transition duration-500 dark:bg-body-darker">
        <CommandPalette>
          <Header />
          <LeftSidebar />
          <RightSidebar />

          <Outlet />

          <Toaster
            containerClassName="print:hidden"
            toastOptions={{
              className: endent`
                bg-white text-body border border-black border-opacity-5 dark:bg-body-darker dark:text-body-dark dark:border-white dark:border-opacity-5
              `,
              duration: 5000,
              position: "bottom-right",
            }}
          />

          <Footer />
        </CommandPalette>

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
  const data = useLoaderData<RootLoaderData>();

  useChangeLanguage(data.locale);

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="_action/set-theme">
      <App />
    </ThemeProvider>
  );
}
