// Dependencies
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import type { EntryContext } from "@remix-run/node";

export default function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  let markup = renderToString(
    <RemixServer context={context} url={request.url} />
  );

  headers.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers,
  });
}
