// Dependencies
import * as React from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { HeadersFunction, LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { i18n } from "~/utils/i18n.server";
import { useMdxComponent } from "~/utils/mdx";
import { getMdxPage } from "~/utils/mdx.server";
import type { MdxComponent } from "~/types";

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
    <article className="prose prose-zinc dark:prose-invert lg:prose-lg mx-auto min-h-screen max-w-4xl pt-24">
      <Component />
    </article>
  );
}
