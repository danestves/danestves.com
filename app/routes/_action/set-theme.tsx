// Dependencies
import { json } from "@remix-run/server-runtime";
import { isTheme } from "remix-themes";
import type { ActionFunction } from "@remix-run/server-runtime";

// Internals
import { themeSessionResolver } from "~/utils/theme.server";

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
