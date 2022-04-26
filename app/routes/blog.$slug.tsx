// Dependencies
import Giscus from "@giscus/react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { useTheme } from "remix-themes";
import invariant from "tiny-invariant";
import type { Theme } from "@giscus/react";
import type { HeadersFunction, LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import type { HandleStructuredData } from "remix-utils";

// Internals
import { GithubIcon } from "~/components/icons/github";
import { ShareIcon } from "~/components/icons/share";
import { TwitterIcon } from "~/components/icons/twitter";
import { Image } from "~/components/image";
import { externalLinks } from "~/external-links";
import { useShare } from "~/hooks/use-share";
import prismOne from "~/styles/prism-one.css";
import { formatDate } from "~/utils/date";
import { i18n } from "~/utils/i18n.server";
import { useMdxComponent } from "~/utils/mdx";
import { getMdxPage } from "~/utils/mdx.server";
import { getSeoMeta } from "~/utils/seo";
import type { RootLoaderData } from "~/root";
import type { Handle, MdxComponent } from "~/types";
import { Views } from "~/components/views";

export const handle: HandleStructuredData<LoaderData> & Handle = {
  structuredData(data) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      author: {
        "@type": "Person",
        name: "Daniel Esteves",
        url: externalLinks.self,
      },
      datePublished: new Date(data.frontmatter.published_at!).toISOString(),
      description: data?.frontmatter?.seo?.description,
      headline: data?.frontmatter?.seo?.title,
      image: `https://cdn.flyyer.io/v2/danestves/_/_/posts/${data?.slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        id: `${externalLinks.self}/blog/${data.slug}`,
      },
    };
  },
  i18n: "blog",
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: prismOne,
    },
  ];
};

export const meta: MetaFunction = ({ data, parentsData }) => {
  const loaderData = data as LoaderData;
  const parentData = parentsData?.root as RootLoaderData;

  return {
    ...getSeoMeta({
      title: loaderData.title,
      description: loaderData.frontmatter.seo?.description,
      openGraph: {
        type: "article",
      },
    }),
    "flyyer:content": loaderData.frontmatter.seo?.description!,
    "flyyer:date": new Date(loaderData.frontmatter.published_at!).toISOString(),
    "flyyer:image": `${parentData.requestInfo.origin}${loaderData.frontmatter.cover}`,
    "flyyer:locale": parentData.locale,
    "flyyer:title": loaderData?.title,
    "og:image:alt": loaderData.frontmatter.seo?.title,
    "twitter:image:alt": loaderData.frontmatter.seo?.title,
  };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "cache-control": loaderHeaders.get("cache-control") ?? "private, max-age=60",
    Vary: "Cookie",
  };
};

type LoaderData = MdxComponent & {
  share: {
    url: string;
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug;
  invariant(typeof slug === "string", "Slug should be a string, and defined");

  const locale = await i18n.getLocale(request);
  const mdxPage = await getMdxPage({ contentDirectory: `blog/${locale}`, slug: `${locale}-${slug}` });

  if (!mdxPage) {
    throw json(null, { status: 404 });
  }

  const url = new URL(request.url);

  return json<LoaderData>(
    {
      ...mdxPage,
      share: {
        url: url.toString(),
      },
    },
    {
      headers: { "cache-control": "private, max-age: 60", Vary: "Cookie" },
    }
  );
};

export default function Blog() {
  const data = useLoaderData<LoaderData>();
  const { i18n, t } = useTranslation("blog");
  const [theme] = useTheme();

  const { canShare, hasShared, share } = useShare({
    title: data.frontmatter.seo?.title as string,
    text: data.frontmatter.seo?.description as string,
    url: data.share.url,
  });

  const Component = useMdxComponent(data.code);

  return (
    <main className="w-full py-32">
      <h2 className="text-center text-[26px] font-black uppercase text-primary-700 dark:text-primary">
        Blog{" "}
        <span aria-label="victory hand" role="img">
          ✌️
        </span>
      </h2>

      <div className="container mx-auto mt-5 max-w-[977px]">
        <div className="mb-6 grid grid-cols-12 items-center gap-y-5 md:gap-10">
          <div className="col-span-12 md:col-span-7">
            <Image
              alt={data.frontmatter.title}
              className="flex aspect-video overflow-hidden rounded-[18px] bg-primary/50 shadow"
              height={1080}
              responsive={[
                {
                  size: {
                    width: 656,
                    height: 370,
                  },
                  maxWidth: 656,
                },
                {
                  size: {
                    width: 480,
                    height: 270,
                  },
                  maxWidth: 480,
                },
              ]}
              src={data.frontmatter.cover}
              width={1920}
            />

            <div className="relative -mt-10 flex items-end space-x-4 px-6">
              <Image
                alt="Daniel Esteves"
                className="relative h-20 w-20 overflow-hidden rounded-full bg-black/10 drop-shadow-lg dark:bg-white/10"
                height={1080}
                responsive={[
                  {
                    size: {
                      width: 160,
                      height: 160,
                    },
                    maxWidth: 160,
                  },
                  {
                    size: {
                      width: 80,
                      height: 80,
                    },
                    maxWidth: 80,
                  },
                ]}
                src="/me-transparent.png"
                width={1080}
              />

              <Views slug={data.slug} />

              <div className="absolute right-6 bottom-6 flex flex-1 justify-end">
                <button
                  className="z-10 flex items-center rounded-full bg-secondary py-2 px-3 text-xs font-bold text-black"
                  onClick={share}
                  type="button"
                >
                  <span className="sr-only sm:not-sr-only">
                    {hasShared ? (!canShare ? t("sharer.copied") : t("sharer.shared")) : t("sharer.share")}
                  </span>
                  <ShareIcon aria-hidden="true" className="h-4 w-4 sm:-mr-1 sm:ml-2" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-12 space-y-4 md:col-span-5">
            <h1 className="text-2xl font-bold text-primary">{data.title}</h1>
            <p className="text-xs font-bold text-secondary">
              {t("published")}{" "}
              <time dateTime={new Date(data.frontmatter.published_at!).toISOString()}>
                {formatDate({
                  date: new Date(data.frontmatter.published_at!).toISOString(),
                  formatter: i18n.language === "en" ? "MMMM d, YYYY" : "d MMMM YYYY",
                  locale: i18n.language,
                })}
              </time>
            </p>
            <p className="whitespace-pre-line text-xs font-bold text-[#B5B5B5] dark:text-[#b5b5b5]">
              {data.frontmatter?.seo?.description}
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-full dark:prose-dark">
          <Component />
        </div>

        <div className="mt-6 flex justify-end">
          <div className="flex items-center space-x-6">
            <a
              className="inline-flex items-center font-semibold text-primary hover:underline hover:underline-offset-8"
              href={`https://twitter.com/intent/tweet?url=${data.share?.url}&text=${t("bottomShare.twitter.href", {
                title: data?.title,
                username: "danestves",
              })}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("bottomShare.twitter.label")}
              <TwitterIcon className="h-5 w-5 sm:-mr-1 sm:ml-2" />
            </a>
            <a
              className="inline-flex items-center font-semibold text-primary hover:underline hover:underline-offset-8"
              href={`https://github.com/danestves/danestves.com/edit/main/content/blog/${i18n.language}/${i18n.language}-${data.slug}.mdx`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("bottomShare.github")} <GithubIcon className="h-5 w-5 sm:-mr-1 sm:ml-2" />
            </a>
          </div>
        </div>

        <hr className="my-6 dark:border-[#494949]" />

        <Giscus
          category="Comments"
          categoryId="DIC_kwDODBPThs4CBCeF"
          id="comments"
          inputPosition="top"
          lang={i18n.language}
          loading="lazy"
          mapping="pathname"
          reactionsEnabled="1"
          repo="danestves/danestves.dev"
          repoId="481753482"
          theme={theme as Theme}
        />
      </div>
    </main>
  );
}
