// Dependencies
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import endent from "endent";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

// Internals
import { Image } from "~/components/image";
import { getSeoMeta } from "~/utils/seo";

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
};

export const meta: MetaFunction = () => {
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
            url: "https://danestves.com/img/maria/og.jpg",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        image: {
          alt: title,
          url: "https://danestves.com/img/maria/og.jpg",
        },
      },
    }),
    robots: "noindex,nofollow",
    googlebot: "noindex,nofollow",
  };
};

type LoaderData = {
  richtext: Array<Record<string, unknown>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const data = await fetch(`${url.origin}/data/maria.json`).then((res) => res.json());

  return json<LoaderData>({
    richtext: data,
  });
};

export default function MariaPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="pt-32">
      <h1 className="text-center text-4xl font-bold text-primary-light dark:text-primary">Hola, Cariño</h1>

      <div className="container mt-6 max-w-md space-y-4 text-justify">
        {data.richtext?.map((item, index) => {
          switch (item.type) {
            case "h2":
              return (
                <h2
                  className="text-center text-4xl font-bold text-primary-700 dark:text-primary"
                  dangerouslySetInnerHTML={{ __html: item.content as string }}
                  key={index}
                />
              );
            case "hr":
              return <hr key={index} />;
            case "img":
              return (
                <Image
                  {...item}
                  alt="María Emilia Marcano Mora, ¿quieres ser mi novia?"
                  className="h-auto w-full rounded-[18px]"
                  key={index}
                  loading={index !== 2 ? "lazy" : undefined}
                />
              );
            default:
              return (
                <p
                  className="text-body dark:text-body-dark"
                  dangerouslySetInnerHTML={{ __html: item.content as string }}
                  key={index}
                />
              );
          }
        })}
      </div>
    </main>
  );
}
