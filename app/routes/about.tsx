// Dependencies
import { DocumentTextIcon } from "@heroicons/react/outline";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import type { HandleStructuredData } from "remix-utils";

// Internals
import { Link } from "~/components/link";
import { LinkedInIcon } from "~/components/icons/linkedin";
import { HeroSection } from "~/components/sections/hero-section";
import { externalLinks } from "~/external-links";
import { i18n } from "~/utils/i18n.server";
import { getSeoMeta } from "~/utils/seo";
import type { Handle } from "~/types";

export const handle: HandleStructuredData<LoaderData> & Handle = {
  structuredData(data) {
    return {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: data.seo.title,
      description: data.seo.description,
      url: `${externalLinks.self}/about`,
    };
  },
  i18n: ["pages", "sections"],
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
      title: t("about.seo.title"),
      description: t("about.seo.description"),
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

export default function AboutPage() {
  const { t } = useTranslation("pages");

  return (
    <>
      <HeroSection />

      <div className="container max-w-[977px] space-y-4">
        <h2 className="text-secondary-darker text-center text-[26px] font-black uppercase text-primary">
          {t("about.title")}{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h2>
        <p
          className="text-lg text-body dark:text-body-dark"
          dangerouslySetInnerHTML={{
            __html: t("about.paragraphs", { joinArrays: "<br /><br />" }),
          }}
        ></p>
        <div className="flex justify-center space-x-4">
          <Link
            className="text-secondary-darker inline-flex min-w-[100px] items-center rounded-md border border-primary bg-transparent py-2 px-4 text-body transition-colors duration-100 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:bg-primary hover:text-white dark:text-body-dark dark:hover:text-body-darker"
            to={externalLinks.linkedin}
          >
            {t("about.buttons.0")}
            <LinkedInIcon className="ml-2 -mr-1 inline h-auto w-5" />
          </Link>
          <Link
            className="text-secondary-darker inline-flex min-w-[100px] items-center rounded-md border border-transparent bg-primary py-2 px-4 text-white transition duration-100 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:brightness-105 dark:text-body-darker dark:hover:bg-primary-600"
            to={externalLinks.resume}
          >
            {t("about.buttons.1")}
            <DocumentTextIcon className="ml-2 -mr-1 inline h-auto w-5" />
          </Link>
        </div>
      </div>
    </>
  );
}
