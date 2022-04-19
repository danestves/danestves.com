// Dependencies
import { json } from "remix-utils";
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { getContentState } from "~/models/content-state.server";

export const loader: LoaderFunction = async () => {
  const rows = await getContentState();
  const data = rows || {};

  return json(data, {
    headers: {
      "content-length": Buffer.byteLength(JSON.stringify(data)).toString(),
    },
  });
};
