// Dependencies
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { generateFeed } from "~/utils/feed.server";

export const loader: LoaderFunction = async ({ request }) => {
  const feed = await generateFeed(request);
  const rss = feed.rss2();

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Content-Length": String(Buffer.byteLength(rss)),
    },
  });
};
