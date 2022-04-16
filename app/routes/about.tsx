// Dependencies
import { DocumentTextIcon } from "@heroicons/react/outline";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";

// Internals
import { LinkedInIcon } from "~/components/icons/linkedin";
import { HeroSection } from "~/components/sections/hero-section";
import { externalLinks } from "~/external-links";
import { i18n } from "~/utils/i18n.server";
import type { Handle } from "~/types";

export const handle: Handle = {
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

  return json({
    seo: {
      title: t("about.seo.title"),
      description: t("about.seo.description"),
    },
  });
};

export const meta: MetaFunction = ({ data }) => {
  const dataLoader = data as LoaderData;

  return {
    title: dataLoader.seo.title,
    description: dataLoader.seo.description,
  };
};

export default function AboutPage() {
  const { t } = useTranslation("pages");

  return (
    <>
      <HeroSection />

      <div className="container max-w-[977px] space-y-4">
        <h1 className="text-secondary-darker text-center text-[26px] font-black uppercase text-secondary">
          {t("about.title")}{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h1>
        <p
          className="text-lg text-body dark:text-body-dark"
          dangerouslySetInnerHTML={{
            __html: t("about.paragraphs", { joinArrays: "<br /><br />" }),
          }}
        ></p>
        <div className="flex justify-center space-x-4">
          <a
            className="text-secondary-darker inline-flex min-w-[100px] items-center rounded-md border border-primary bg-transparent py-2 px-4 text-body transition-colors duration-100 hover:bg-primary hover:text-white dark:text-body-dark dark:hover:text-body-darker"
            href={externalLinks.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("about.buttons.0")}
            <LinkedInIcon className="ml-2 -mr-1 inline h-auto w-5" />
          </a>
          <a
            className="text-secondary-darker inline-flex min-w-[100px] items-center rounded-md border border-transparent bg-primary py-2 px-4 text-white transition duration-100 hover:brightness-105 dark:text-body-darker dark:hover:bg-primary-600"
            download
            href={externalLinks.resume}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("about.buttons.1")}
            <DocumentTextIcon className="ml-2 -mr-1 inline h-auto w-5" />
          </a>
        </div>
      </div>
    </>
  );
}
