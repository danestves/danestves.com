// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { HeroSection } from "~/components/sections/hero-section";
import { PostsSection } from "~/components/sections/posts-section";
import { VideosSection } from "~/components/sections/videos-section";
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";
import { getSeoMeta } from "~/utils/seo";
import { getVideos } from "~/utils/youtube.server";
import type { Handle, Videos } from "~/types";

export const handle: Handle = {
  i18n: "sections",
};

type LoaderData = {
  posts: Array<{
    timestamp: Date;
    frontmatter: Record<string, unknown>;
    slug: string;
    title: string;
  }>;
  videos: Videos;
  seo: {
    title: string;
    description: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const [t, posts, videos] = await Promise.all([
    i18n.getFixedT(request, "pages"),
    getMdxListItems({ contentDirectory: `blog/${locale}`, limit: 3 }),
    getVideos(),
  ]);

  return json<LoaderData>({
    posts: posts.map((post) => ({
      ...post,
      frontmatter: JSON.parse(post.frontmatter),
      // Remove the locale from the slug, we only use it with locale prefixes to be able to
      // use the slug as unique identifier for the blog post on Prisma.
      slug: post.slug.replace(`${locale}-`, ""),
    })),
    videos,
    seo: {
      title: t("index.seo.title"),
      description: t("index.seo.description"),
    },
  });
};

export const meta: MetaFunction = ({ data }) => {
  const dataLoader = data as LoaderData;
  const title = dataLoader.seo.title;

  return {
    ...getSeoMeta({
      title,
      description: dataLoader.seo.description,
    }),
    "og:image:alt": title,
    "twitter:image:alt": title,
  };
};

export default function HomePage() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <HeroSection />
      <VideosSection {...data.videos} />
      <PostsSection posts={data.posts} />
    </>
  );
}
