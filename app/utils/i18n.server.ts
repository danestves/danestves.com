// Dependencies
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";

export let i18n = new RemixI18Next({
  detection: {
    fallbackLanguage: "en",
    supportedLanguages: ["en", "es"],
  },
  // This is the configuration for i18next used when translating messages server
  // side only
  i18next: {
    backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
  },
  backend: Backend,
});
