// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { HeadersFunction, LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? "private, max-age=60",
  Vary: "Cookie",
});

type LoaderData = {
  posts: Array<{
    timestamp: Date;
    frontmatter: string;
    slug: string;
    title: string;
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const posts = await getMdxListItems({ contentDirectory: `blog/${locale}` });

  return json<LoaderData>(
    {
      posts,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=60",
        Vary: "Cookie",
      },
    }
  );
};

export default function BlogPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="w-full py-32">
      <h1 className="text-center text-[26px] font-black uppercase text-primary">
        Blog{" "}
        <span aria-label="victory hand" role="img">
          ✌️
        </span>
      </h1>

      <div className="container mx-auto mt-5 max-w-[977px]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{JSON.stringify(data, null, 2)}</div>
      </div>
    </main>
  );
}
