import { readdirSync, readFileSync } from "node:fs";
import { URL } from "node:url";

import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { imageService } from "@unpic/astro/service";
import { defineConfig, envField } from "astro/config";
import Icons from "unplugin-icons/vite";

// The config loads before content collections, so the sitemap reads the two frontmatter keys it needs by hand.
// shortcut: line-based, expects `archived: true` and `pubDate:`/`updatedDate:` as plain YAML lines; switch to a
// YAML parser if frontmatter ever nests these keys.
const frontmatter = (dir) =>
  readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ id: file.replace(/\.md$/, ""), text: readFileSync(`${dir}/${file}`, "utf8") }));
const dateOf = (text, key) => text.match(new RegExp(`^${key}: (\\d{4}-\\d{2}-\\d{2})`, "m"))?.[1];

// Archived projects keep a noindexed page for old links, so they stay out of the sitemap too.
const archivedProjects = frontmatter("./src/content/projects")
  .filter(({ text }) => /^archived: true$/m.test(text))
  .map(({ id }) => `/projects/${id}/`);
// Posts carry honest dates; other pages have none, so they get no lastmod rather than a guessed one.
const postDates = new Map(
  frontmatter("./src/content/posts").map(({ id, text }) => [
    `/blog/posts/${id}/`,
    dateOf(text, "updatedDate") ?? dateOf(text, "pubDate"),
  ]),
);

// https://astro.build/config
export default defineConfig({
  output: "static",
  vite: {
    plugins: [
      Icons({
        // experimental
        autoInstall: true,
        compiler: "astro",
      }),
      tailwindcss(),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: true,
      skipInline: false,
      drafts: false,
    },
  },
  site: "https://danestves.com",
  env: {
    schema: {
      // Optional so local and preview builds work without it; production sets it in Netlify.
      PUBLIC_POSTHOG_PROJECT_TOKEN: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
  integrations: [
    sitemap({
      // Tag pages are noindexed while the blog is this small (see src/pages/blog/tags).
      filter: (page) => {
        const { pathname } = new URL(page);
        return !pathname.startsWith("/blog/tags/") && !archivedProjects.includes(pathname);
      },
      serialize: (item) => {
        const date = postDates.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  image: {
    service: imageService({
      placeholder: "blurhash",
    }),
  },
  adapter: netlify(),
  experimental: {
    responsiveImages: true,
  },
  redirects: {
    "/work": "/projects/",
    // PolarSync is shut down; its store and project pages point at the rest of the work.
    "/store": "/projects/",
    "/store/polarsync": "/projects/",
    "/projects/polarsync": "/projects/",
  },
});
