// Dependencies
import { generateRobotsTxt, generateSitemap } from "@balavishnuvj/remix-seo";
import type { EntryContext } from "@remix-run/server-runtime";

type Handler = (
  request: Request,
  remixContext: EntryContext
) => Promise<Response | null> | null;

export const otherRootRoutes: Record<string, Handler> = {
  "/robots.txt": async () => {
    return generateRobotsTxt([
      {
        type: "disallow",
        value: "*",
      },
      {
        type: "sitemap",
        value: process.env.SELF_URL! + "/sitemap.xml",
      },
    ]);
  },
  "/sitemap.xml": async (request, context) => {
    return generateSitemap(request, context, {
      headers: {
        "Cache-Control": `public, max-age=${60 * 5}`,
      },
      siteUrl: process.env.SELF_URL!,
    });
  },
};

export const otherRootRouteHandlers: Array<Handler> = [
  ...Object.entries(otherRootRoutes).map(([path, handler]) => {
    return (request: Request, remixContext: EntryContext) => {
      if (new URL(request.url).pathname !== path) return null;

      return handler(request, remixContext);
    };
  }),
];
