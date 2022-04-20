// Dependencies
import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    defaultNS: "common",
    detection: {
      order: ["htmlTag"],
      caches: [],
    },
    fallbackLng: "en",
    ns: getInitialNamespaces(),
    partialBundledLanguages: true,
    react: { useSuspense: true },
    supportedLngs: ["en", "es"],
  })
  .then(() => {
    return hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>
    );
  });
