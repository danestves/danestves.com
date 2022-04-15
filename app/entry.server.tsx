// Dependencies
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { etag } from "remix-etag";
import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";

let ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  let callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    let { pipe, abort } = renderToPipeableStream(
      <RemixServer context={context} url={request.url} />,
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
