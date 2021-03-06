async function markdownToHtmlDocument(markdownString: string) {
  const { unified } = await import("unified");
  const { default: markdown } = await import("remark-parse");
  const { default: remark2rehype } = await import("remark-rehype");
  const { default: rehypeStringify } = await import("rehype-stringify");
  const { default: doc } = await import("rehype-document");
  const { default: format } = await import("rehype-format");
  const result = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc)
    .use(format)
    .use(rehypeStringify)
    .process(markdownString);

  return result.value.toString();
}

export { markdownToHtmlDocument };
