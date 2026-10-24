import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    pubDate: z.date(),
    title: z.string(),
    subtitle: z.string(),
    live: z.string(),
    // "app" is a product danestves LLC publishes; "package" is open source.
    kind: z.enum(["app", "package"]),
    // schema.org applicationCategory, read by the app JSON-LD in projects-layout.
    category: z
      .enum(["FinanceApplication", "HealthApplication", "BusinessApplication", "UtilitiesApplication"])
      .optional(),
    // Archived projects keep their page but leave every listing.
    archived: z.boolean().default(false),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    install: z.string().optional(),
    logo: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    // Landscape share image (og:image). Pages without one share the site card.
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    // The search title when the name alone does not say what it is, e.g. "Vela, a private period tracker".
    seoTitle: z.string().optional(),
    screens: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string(),
          caption: z.string(),
          width: z.number(),
          height: z.number(),
        }),
      )
      .default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    // Only set after a real edit; BlogPosting.dateModified falls back to pubDate.
    updatedDate: z.date().optional(),
    description: z.string(),
    author: z.string(),
    // Landscape share image (og:image). Posts without one share the site card.
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  projects,
  posts,
};
