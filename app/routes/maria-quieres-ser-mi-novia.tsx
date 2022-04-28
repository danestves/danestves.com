// Dependencies
import clsx from "clsx";
import endent from "endent";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import type { MetaFunction } from "@remix-run/server-runtime";

// Internals
import { Image } from "~/components/image";
import { getSeoMeta } from "~/utils/seo";
import data from "public/maria-data.json";

export let handle: SEOHandle = {
  getSitemapEntries: () => null,
};

export let meta: MetaFunction = () => {
  let title = "María Emilia Marcano Mora, ¿quieres ser mi novia?";
  let description = endent`
    Hola cariño, hice este regalo porque quiero expresarte a mi manera lo que yo siento por ti.
  `;

  return {
    ...getSeoMeta({
      title: title,
      description: description,
      openGraph: {
        images: [
          {
            alt: title,
            url: "https://danestves.com/maria/og.jpg",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        image: {
          alt: title,
          url: "https://danestves.com/maria/og.jpg",
        },
      },
    }),
    robots: "noindex,nofollow",
    googlebot: "noindex,nofollow",
  };
};

export default function MariaPage() {
  return (
    <main className="pt-32">
      <h1 className="text-center text-4xl font-bold text-primary-light dark:text-primary">Hola, Cariño</h1>

      <div className="container mt-6 max-w-md space-y-4 text-justify">
        {data.map((item, index) => {
          switch (item.type) {
            case "h2":
              return (
                <h2
                  className="text-center text-4xl font-bold text-primary-700 dark:text-primary"
                  dangerouslySetInnerHTML={{ __html: item.content! }}
                  key={index}
                />
              );
            case "hr":
              return <hr key={index} />;
            case "img":
              return <Image {...item} className={clsx("h-auto w-full rounded-[18px]", item.className)} key={index} />;
            default:
              return (
                <p
                  className="text-body dark:text-body-dark"
                  dangerouslySetInnerHTML={{ __html: item.content! }}
                  key={index}
                />
              );
          }
        })}
      </div>
    </main>
  );
}
