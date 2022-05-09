// Dependencies
import { RemixBrowser } from "@remix-run/react";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";

// Internals
import i18nOptions from "~/utils/i18n-options";

Sentry.init({
  dsn: window.ENV.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...i18nOptions,
      backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
      detection: {
        order: ["htmlTag"],
        caches: [],
      },
      ns: getInitialNamespaces(),
    })
    .then(() => {
      return hydrateRoot(
        document,
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>
      );
    });
}
