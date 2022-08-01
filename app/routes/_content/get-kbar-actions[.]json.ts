// Dependencies
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import type { Action } from "kbar";

// Internals
import { getMdxListItems } from "~/utils/mdx.server";
import { i18n } from "~/utils/i18n.server";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const data = await getMdxListItems({ contentDirectory: `blog/${locale}` });

  const posts = data.map((post) => {
    const frontmatter = JSON.parse(post.frontmatter);

    return {
      ...frontmatter.seo,
      // Remove the locale from the slug, we only use it with locale prefixes to be able to
      // use the slug as unique identifier for the blog post on Prisma.
      slug: post.slug.replace(`${locale}-`, ""),
    };
  });

  const actions: Array<Action> = [
    ...posts.map((post): Action & { link?: string } => ({
      id: post.slug,
      name: `${post?.title ?? ""} — ${post?.description ?? ""}`,
      keywords: post?.title,
      link: `/blog/${post?.slug}`,
      parent: "blog",
    })),
  ];

  return json(
    { actions, locale },
    {
      headers: {
        "Content-Length": Buffer.byteLength(JSON.stringify({ actions })).toString(),
      },
    }
  );
};
