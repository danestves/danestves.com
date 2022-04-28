// Dependencies
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { HeroSection } from "~/components/sections/hero-section";
import { i18n } from "~/utils/i18n.server";
import { getSeoMeta } from "~/utils/seo";
import { getVideos } from "~/utils/youtube.server";
import type { Handle, Videos } from "~/types";
import { VideosSection } from "~/components/sections/videos-section";
import { useLoaderData } from "@remix-run/react";

export const handle: Handle = {
  i18n: "sections",
};

type LoaderData = {
  videos: Videos;
  seo: {
    title: string;
    description: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const [t, videos] = await Promise.all([i18n.getFixedT(request, "pages"), getVideos()]);

  return json<LoaderData>({
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
    </>
  );
}
