// Dependencies
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

// Internals
import { PostCard } from "../post-card";

type PostsSectionProps = {
  posts: Array<{
    timestamp: Date;
    frontmatter: Record<string, unknown>;
    slug: string;
    title: string;
  }>;
};

function PostsSection({ posts }: PostsSectionProps) {
  const { t } = useTranslation("sections");

  return (
    <section className="container py-20" id="posts">
      <h2 className="text-center text-[26px] font-black uppercase text-primary-light dark:text-primary">
        {t("posts.title")}{" "}
        <span aria-label="victory hand" role="img">
          ✌️
        </span>
      </h2>

      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
        {posts?.map((post) => (
          <div key={post.slug}>
            <PostCard
              as={Link}
              className="block overflow-hidden rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-primary"
              descriptionClassName="line-clamp-3"
              post={post.frontmatter}
              prefetch="intent"
              to={`/blog/${post.slug}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export { PostsSection };
export type { PostsSectionProps };
