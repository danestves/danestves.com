// Dependencies
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { generateFeed } from "~/utils/feed.server";

export const loader: LoaderFunction = async ({ request }) => {
  const feed = await generateFeed(request);
  const rss = feed.atom1();

  return new Response(rss, {
    headers: {
      "Content-Type": "application/atom+xml",
      "Content-Length": String(Buffer.byteLength(rss)),
    },
  });
};
