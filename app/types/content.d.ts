export type MdxComponent = {
  frontmatter: MdxPage["frontmatter"];
  slug: string;
  title: string;
  code: string;
  timestamp: Date;
  description?: string;
};

export type MdxPage = {
  code: string;
  slug: string;
  frontmatter: {
    title?: string;
    published?: boolean;
    published_at?: string;
    cover?: {
      id?: string;
      alt?: string;
    };
    seo?: {
      title?: string;
      description?: string;
    };
    meta?: Record<string, string | string[]> & {
      keywords?: Array<string>;
    };
  };
};
