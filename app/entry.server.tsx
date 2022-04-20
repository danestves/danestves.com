// Dependencies
import { RemixServer } from "@remix-run/react";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import isbot from "isbot";
import { resolve } from "node:path";
import { renderToPipeableStream } from "react-dom/server";
import { etag } from "remix-etag";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";

// Internals
import { getEnv } from "~/utils/env.server";
import i18nOptions from "~/utils/i18n-options";
import { otherRootRouteHandlers } from "./utils/other-root-routes.server";
import { i18n } from "./utils/i18n.server";

global.ENV = getEnv();

const ABORT_DELAY = 5000;

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
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  const lng = await i18n.getLocale(request);
  const ns = i18n.getRouteNamespaces(context);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18nOptions,
      lng,
      ns,
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={context} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]() {
          let body = new PassThrough();

          headers.set("Content-Type", "text/html");

          // @ts-ignore - We know that the stream is a PassThrough
          let response = new Response(body, {
            status: didError ? 500 : statusCode,
            headers,
          });

          resolve(etag({ request, response }));
          pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
