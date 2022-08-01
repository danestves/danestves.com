// Dependencies
import { MailIcon } from "@heroicons/react/solid";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { ExternalScriptsFunction, HandleStructuredData } from "remix-utils";

// Internals
import { Input } from "~/components/input";
import { TextArea } from "~/components/textarea";
import { externalLinks } from "~/external-links";
import { i18n } from "~/utils/i18n.server";
import { getSeoMeta } from "~/utils/seo";
import type { Handle } from "~/types";

const scripts: ExternalScriptsFunction = () => {
  return [
    {
      src: "https://kwesforms.com/v2/kwes-script.js",
      defer: true,
    },
  ];
};

export const handle: HandleStructuredData<LoaderData> & Handle & SEOHandle = {
  structuredData(data) {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: data.seo.title,
      description: data.seo.description,
      url: `${externalLinks.self}/contact`,
    };
  },
  getSitemapEntries() {
    return [
      {
        route: "/contact",
        changefreq: "yearly",
        priority: 0.7,
      },
    ];
  },
  i18n: ["errors"],
  scripts,
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
      title: t("contact.seo.title"),
      description: t("contact.seo.description"),
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

export default function ContactPage() {
  const { i18n, t } = useTranslation("pages");

  return (
    <div className="w-full py-32">
      <div className="container mx-auto mt-5 max-w-xl">
        <h1 className="text-center text-[26px] font-black uppercase text-primary-light dark:text-primary">
          {t("contact.seo.title")}{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h1>

        <p className="text-center text-lg text-body dark:text-body-dark">{t("contact.seo.description")}</p>

        <form
          action="https://kwesforms.com/api/foreign/forms/Ey4Jxyw8L77uDlhtt5Un"
          className="kwes-form mt-8 space-y-6"
          lang={i18n.language}
        >
          <Input
            id="name"
            label={t("contact.form.name.label")}
            name="name"
            placeholder={t("contact.form.name.placeholder")}
            rules="required|min:3|max:255"
          />

          <Input
            id="email"
            label={t("contact.form.email.label")}
            name="email"
            placeholder={t("contact.form.email.placeholder")}
            rules="required|email"
            type="email"
          />

          <Input
            id="subject"
            label={t("contact.form.subject.label")}
            name="subject"
            placeholder={t("contact.form.subject.placeholder")}
            rules="required|min:3|max:255"
          />

          <TextArea
            caption={t("contact.form.message.caption")}
            className="resize-none"
            id="message"
            label={t("contact.form.message.label")}
            name="message"
            placeholder={t("contact.form.message.placeholder")}
            rows={6}
            rules="required|min:3|max:320"
          />

          <fieldset className="flex items-center justify-end">
            <button
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              type="button"
            >
              {t("contact.form.submit.label")}
              <MailIcon aria-hidden="true" className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
