// Dependencies
import { json, redirect } from "@remix-run/server-runtime";
import type { ActionFunction } from "@remix-run/server-runtime";

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

export const loader = () => redirect("/", { status: 404 });

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>;
}
