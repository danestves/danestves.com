// Dependencies
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";

// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
export const loader: LoaderFunction = async ({ request }) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  const locale = await i18n.getLocale(request);

  try {
    const url = new URL("/", `http://${host}`);

    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      getMdxListItems({ contentDirectory: `blog/${locale}` }),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);

    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });

    return new Response("ERROR", { status: 500 });
  }
};
