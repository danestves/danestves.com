// Dependencies
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const blogList = await getMdxListItems({ contentDirectory: "blog" });

  console.info(blogList);

  return json({});
};

export default function BlogPage() {
  return (
    <>
      <>
        <h1>bLOG</h1>
      </>
    </>
  );
}
