// Dependencies
import { Feed } from "feed";

// Internals
import { i18n } from "./i18n.server";
import { getMdxListItems } from "./mdx.server";
import { getDomainUrl } from "./misc";

export async function generateFeed(request: Request) {
  const locale = await i18n.getLocale(request);
  const baseUrl = getDomainUrl(request);
  const blogUrl = `${baseUrl}/blog`;

  const posts = await getMdxListItems({ contentDirectory: `blog/${locale}` });

  const feed = new Feed({
    copyright: `Copyright © ${new Date().getFullYear()}, Daniel Esteves`,
    id: blogUrl,
    title: "Daniel Esteves Blog",
    author: {
      email: "me@danestves.com",
      link: baseUrl,
      name: "Daniel Esteves",
    },
    description: "Blog posts by Daniel Esteves",
    favicon: `${baseUrl}/favicon.ico`,
    feedLinks: {
      atom: `${blogUrl}/atom.xml`,
      json: `${blogUrl}.json`,
      rss: `${blogUrl}/rss.xml`,
    },
    generator: "@danestves",
    language: locale,
    link: blogUrl,
  });

  posts.forEach((post) => {
    const frontmatter = JSON.parse(post.frontmatter);

    feed.addItem({
      date: post.timestamp,
      link: `${blogUrl}/${post.slug}`,
      title: post.title,
      author: [
        {
          email: "me@danestves.com",
          link: baseUrl,
          name: "Daniel Esteves",
        },
      ],
      description: frontmatter?.seo?.description,
      guid: `${blogUrl}/${post.slug}`,
      id: `${blogUrl}/${post.slug}`,
      image: `${baseUrl}/${frontmatter?.cover}`,
      published: new Date(frontmatter.published_at),
    });
  });

  return feed;
}
