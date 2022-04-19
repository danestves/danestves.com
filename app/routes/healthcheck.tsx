// Dependencies
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { prisma } from "~/utils/db.server";

// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
export const loader: LoaderFunction = async ({ request }) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);

    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      prisma.content.count(),
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
