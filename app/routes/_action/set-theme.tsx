// Dependencies
import { json, redirect } from "@remix-run/server-runtime";
import { isTheme } from "remix-themes";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import type { ActionFunction } from "@remix-run/server-runtime";

// Internals
import { themeSessionResolver } from "~/utils/theme.server";
import type { Handle } from "~/types";

export const handle: SEOHandle & Handle = {
  getSitemapEntries: () => null,
};

export const action: ActionFunction = async ({ request }) => {
  const session = await themeSessionResolver(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme.`,
    });
  }

  session.setTheme(theme);
  return json(
    { success: true },
    {
      headers: { "Set-Cookie": await session.commit() },
    }
  );
};

export const loader = () => redirect("/", { status: 404 });

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>;
}
