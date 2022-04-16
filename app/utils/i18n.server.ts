// Dependencies
import { createCookie } from "@remix-run/node";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";

export const i18nStorage = createCookie("__danestves_locale", {
  expires: new Date("2222-11-29"),
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: [process.env.SESSION_SECRET!],
  // normally you want this to be `secure: true`
  // but that doesn't work on localhost for Safari
  // https://web.dev/when-to-use-local-https/
  secure: process.env.NODE_ENV === "production",
});

export const i18n = new RemixI18Next({
  detection: {
    fallbackLanguage: "en",
    supportedLanguages: ["en", "es"],
    cookie: i18nStorage,
  },
  i18next: {
    backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
  },
  backend: Backend,
});
