// Dependencies
import { generateRobotsTxt, generateSitemap } from "@balavishnuvj/remix-seo";
import type { EntryContext } from "@remix-run/server-runtime";

type Handler = (request: Request, remixContext: EntryContext) => Promise<Response | null> | null;

export const otherRootRoutes: Record<string, Handler> = {
  "/robots.txt": async (request) => {
    const url = new URL(request.url);

    return generateRobotsTxt(
      [
        {
          type: "userAgent",
          value: "*",
        },
        {
          type: "allow",
          value: "/",
        },
        {
          type: "disallow",
          value: "/maria-quieres-ser-mi-novia",
        },
        {
          type: "sitemap",
          value: url.origin + "/sitemap.xml",
        },
      ],
      {
        appendOnDefaultPolicies: false,
      }
    );
  },
  "/sitemap.xml": async (request, context) => {
    const url = new URL(request.url);

    return generateSitemap(request, context, {
      siteUrl: url.origin,
      headers: {
        "Cache-Control": `public, max-age=${60 * 5}`,
      },
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
