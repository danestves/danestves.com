// Dependencies
import { json } from "@remix-run/server-runtime";
import type { ActionFunction } from "@remix-run/server-runtime";

// Internals
import { upsertViews } from "~/models/content.server";

export const action: ActionFunction = async ({ request }) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const slug = form.get("slug");

  if (!slug) {
    return json(
      {
        success: false,
        message: "No slug provided",
      },
      {
        status: 400,
      }
    );
  }

  return json({
    views: await upsertViews(slug),
  });
};
