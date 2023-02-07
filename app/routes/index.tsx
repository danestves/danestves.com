// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";

// Internals
import { HeroSection } from "~/components/sections/hero-section";
import { PostsSection } from "~/components/sections/posts-section";
import { VideosSection } from "~/components/sections/videos-section";
import { i18n } from "~/utils/i18n.server";
import { getMdxListItems } from "~/utils/mdx.server";
import { getSeoMeta } from "~/utils/seo";
import type { Handle, Video } from "~/types";

export const handle: Handle & SEOHandle = {
  getSitemapEntries() {
    return [
      {
        route: "",
        changefreq: "weekly",
        priority: 1,
      },
    ];
  },
  i18n: "sections",
};

type LoaderData = {
  posts: Array<{
    timestamp: Date;
    frontmatter: Record<string, unknown>;
    slug: string;
    title: string;
  }>;
  videos: Array<Video>;
  seo: {
    title: string;
    description: string;
  };
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const locale = await i18n.getLocale(request);
  const [t, posts, videos] = await Promise.all([
    i18n.getFixedT(request, "pages"),
    getMdxListItems({ contentDirectory: `blog/${locale}`, limit: 3 }),
    fetch(`https://${url.host}/data/youtube.json`).then((res) => res.json()),
  ]);

  return json({
    posts: posts.map((post) => {
      const frontmatter = JSON.parse(post.frontmatter);

      return {
        ...post,
        frontmatter: {
          ...frontmatter,
          published_at: new Date(frontmatter.published_at),
        },
        // Remove the locale from the slug, we only use it with locale prefixes to be able to
        // use the slug as unique identifier for the blog post on Prisma.
        slug: post.slug.replace(`${locale}-`, ""),
      };
    }),
    videos: videos.map((video: Record<string, string>) => ({
      ...video,
      published_at: new Date(video.published_at),
    })),
    seo: {
      title: t("index.seo.title"),
      description: t("index.seo.description"),
    },
  });
}

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
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <HeroSection />
      <VideosSection videos={data.videos} />
      <PostsSection posts={data.posts as any} />
    </>
  );
}
