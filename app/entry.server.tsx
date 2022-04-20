// Dependencies
import { RemixServer } from "@remix-run/react";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { EntryContext } from "@remix-run/node";

// Internals
import { getEnv } from "~/utils/env.server";
import { otherRootRouteHandlers } from "./utils/other-root-routes.server";
import { i18n } from "./utils/i18n.server";

global.ENV = getEnv();

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  for (const handler of otherRootRouteHandlers) {
    const otherRouteResponse = await handler(request, context);

    if (otherRouteResponse) return otherRouteResponse;
  }

  const instance = createInstance();
  const lng = await i18n.getLocale(request);
  const ns = i18n.getRouteNamespaces(context);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      supportedLngs: ["es", "en"],
      defaultNS: "common",
      fallbackLng: "en",
      react: { useSuspense: true },
      lng,
      ns,
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  const markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={context} url={request.url} />
    </I18nextProvider>
  );

  headers.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers: headers,
  });
}
