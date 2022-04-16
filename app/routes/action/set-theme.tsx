// Dependencies
import { redirect } from "@remix-run/node";
import { createThemeAction } from "remix-themes";

// Internals
import { themeSessionResolver } from "~/utils/theme.server";

export const action = createThemeAction(themeSessionResolver);

export const loader = () => redirect("/", { status: 404 });

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>;
}
