// Dependencies
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { HeroSection } from "~/components/sections/hero-section";
import { i18n } from "~/utils/i18n.server";
import { getSeoMeta } from "~/utils/seo";
import type { Handle } from "~/types";

export const handle: Handle = {
  i18n: "sections",
};

type LoaderData = {
  seo: {
    title: string;
    description: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "pages");

  return json<LoaderData>({
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
  return (
    <>
      <HeroSection />
    </>
  );
}
