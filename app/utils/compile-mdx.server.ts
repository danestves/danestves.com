// Dependencies
import calculateReadingTime from "reading-time";
import { bundleMDX } from "mdx-bundler";

// Internals
import { getQueue } from "./p-queue.server";
import type { GitHubFile } from "~/types";

function arrayToObject<Item extends Record<string, unknown>>(
  array: Array<Item>,
  { keyname, valuename }: { keyname: keyof Item; valuename: keyof Item }
) {
  const obj: Record<string, Item[keyof Item]> = {};

  for (const item of array) {
    const key = item[keyname];
    if (typeof key !== "string") {
      throw new Error(`Type of ${key} should be a string`);
    }
    const value = item[valuename];
    obj[key] = value;
  }

  return obj;
}

function removePreContainerDivs() {
  return async function preContainerDivsTransformer(tree: any) {
    const { visit } = await import("unist-util-visit");
    visit(tree, { type: "element", tagName: "pre" }, function visitor(node, index, parent) {
      if (parent?.type !== "element") return;
      if (parent.tagName !== "div") return;
      if (parent.children.length !== 1 && index === 0) return;
      Object.assign(parent, node);
    });
  };
}

async function compileMdxImpl<FrontmatterType extends Record<string, unknown>>({
  slug,
  files,
}: {
  slug: string;
  files: Array<GitHubFile>;
}) {
  const { default: rehypeAutolinkHeadings } = await import("rehype-autolink-headings");
  const { default: rehypeCodeTitles } = await import("rehype-code-titles");
  const { default: rehypeImageLazyLoading } = await import("rehype-plugin-image-native-lazy-loading");
  const { default: rehypePrism } = await import("rehype-prism-plus");
  const { default: rehypeProbeImageSize } = await import("rehype-probe-image-size");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: remarkGfm } = await import("remark-gfm");
  // @ts-ignore - remark-hint is not typed
  const { default: remarkHint } = await import("remark-hint");

  const indexPattern = /index.mdx?$/;
  const indexFile = files.find(({ path }) => path.match(indexPattern));
  if (!indexFile) {
    return null;
  }

  const rootDir = indexFile.path.replace(indexPattern, "");
  const relativeFiles = files.map(({ path, content }) => ({
    path: path.replace(rootDir, "./"),
    content,
  }));

  const filesObject = arrayToObject(relativeFiles, {
    keyname: "path",
    valuename: "content",
  });

  try {
    const { code, frontmatter } = await bundleMDX({
      source: indexFile.content,
      files: filesObject,
      // @ts-ignore - rehype-plugin-image-native-lazy-loading and rehype-probe-image-size are not correctly typed
      mdxOptions: (options) => ({
        rehypePlugins: [
          ...(options.rehypePlugins ?? []),
          rehypeImageLazyLoading,
          [rehypeProbeImageSize, { staticDir: "public" }],
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeCodeTitles,
          [
            rehypePrism,
            {
              showLineNumbers: true,
            },
          ],
          removePreContainerDivs,
        ],
        remarkPlugins: [...(options.remarkPlugins ?? []), remarkGfm, remarkHint],
      }),
    });

    const readingTime = calculateReadingTime(indexFile.content);

    return { code, frontmatter: frontmatter as FrontmatterType, readingTime };
  } catch (e) {
    throw new Error(`MDX Compilation failed for ${slug}`);
  }
}

async function queuedCompileMdx<FrontmatterType extends Record<string, unknown>>(
  ...params: Parameters<typeof compileMdxImpl>
) {
  const queue = await getQueue();

  const result = await queue.add(() => compileMdxImpl<FrontmatterType>(...params));

  return result;
}

export { queuedCompileMdx as compileMdx };
