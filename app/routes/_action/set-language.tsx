// Dependencies
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

// Internals
import { i18nStorage } from "~/utils/i18n.server";

export const action: ActionFunction = async ({ request }) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const lang = form.get("lang");

  if (lang !== "en" && lang !== "es") {
    return json({
      success: false,
      message: `Language "${lang}" is not supported`,
    });
  }

  return json(
    {
      success: true,
    },
    {
      headers: {
        "Set-Cookie": await i18nStorage.serialize(lang),
      },
    }
  );
};
