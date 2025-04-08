import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  return rss({
    title: "Daniel Esteves",
    description:
      "Senior Frontend Engineer. Web developer since 16. Passionate about tech, learning, and empowering LATAM through knowledge sharing.",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./blog/*.{md,mdx}")),
  });
}
