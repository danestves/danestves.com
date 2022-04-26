// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { HeadersFunction, LinksFunction, LoaderFunction } from "@remix-run/server-runtime";

// Internals
import prismOne from "~/styles/prism-one.css";
import { i18n } from "~/utils/i18n.server";
import { useMdxComponent } from "~/utils/mdx";
import { getMdxPage } from "~/utils/mdx.server";
import type { MdxComponent } from "~/types";

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: prismOne,
    },
  ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "cache-control": loaderHeaders.get("cache-control") ?? "private, max-age=60",
    Vary: "Cookie",
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug;
  invariant(typeof slug === "string", "Slug should be a string, and defined");

  const locale = await i18n.getLocale(request);
  const mdxPage = await getMdxPage({ contentDirectory: `blog/${locale}`, slug: `${locale}-${slug}` });

  console.info({ mdxPage });

  if (!mdxPage) {
    throw json(null, { status: 404 });
  }

  return json<MdxComponent>(mdxPage, {
    headers: { "cache-control": "private, max-age: 60", Vary: "Cookie" },
  });
};

export default function Blog() {
  const data = useLoaderData<MdxComponent>();

  const Component = useMdxComponent(data.code);

  return (
    <main className="w-full py-32">
      <h2 className="text-center text-[26px] font-black uppercase text-primary-700 dark:text-primary">
        Blog{" "}
        <span aria-label="victory hand" role="img">
          ✌️
        </span>
      </h2>

      <div className="container mx-auto mt-5 max-w-[977px]">
        <div className="prose prose-lg max-w-full dark:prose-dark">
          <Component />
        </div>
      </div>
    </main>
  );
}
