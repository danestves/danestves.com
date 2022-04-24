// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { HeadersFunction, LoaderFunction } from "@remix-run/server-runtime";

// Internals
import { Link } from "~/components/link";
import { PostCard } from "~/components/post-card";
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? "private, max-age=60",
  Vary: "Cookie",
});

type LoaderData = {
  posts: Array<{
    timestamp: Date;
    frontmatter: Record<string, unknown>;
    slug: string;
    title: string;
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const data = await getMdxListItems({ contentDirectory: `blog/${locale}` });
  const posts = data
    .map((post) => ({
      ...post,
      frontmatter: JSON.parse(post.frontmatter),
      // Remove the locale from the slug, we only use it with locale prefixes to be able to
      // use the slug as unique identifier for the blog post on Prisma.
      slug: post.slug.replace(`${locale}-`, ""),
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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
      <h1 className="text-center text-[26px] font-black uppercase text-primary-700 dark:text-primary">
        Blog{" "}
        <span aria-label="victory hand" role="img">
          ✌️
        </span>
      </h1>

      <div className="container mx-auto mt-5 max-w-[977px]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <PostCard
              as={Link}
              className="block overflow-hidden rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-primary"
              descriptionClassName="line-clamp-3"
              key={post.slug}
              post={post.frontmatter}
              to={`/blog/${post.slug}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
