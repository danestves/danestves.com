// Dependencies
import * as React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

// Internals
import { formatDate } from "~/utils/date";
import { Image } from "./image";
import type { MdxPage } from "~/types";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Prefer<P, T> = P & Omit<T, keyof P>;
type ElementPropsWithoutRef<T extends React.ElementType> = Pick<
  React.ComponentPropsWithoutRef<T>,
  keyof React.ComponentPropsWithoutRef<T>
>;
type OverwritableType<OwnProps, Type extends React.ElementType> = Prefer<OwnProps, ElementPropsWithoutRef<Type>>;
type PostCardProps<T> = {
  post: MdxPage["frontmatter"];
  as?: T;
  descriptionClassName?: string;
  isHome?: boolean;
};

function PostCard<T extends React.ElementType = "div">({
  post,
  // @ts-ignore: is safe
  as = "div",
  descriptionClassName,
  isHome,
  ...props
}: OverwritableType<PostCardProps<T>, T>) {
  const { i18n, t } = useTranslation();

  const Wrapper: React.ElementType = as;

  return (
    <Wrapper {...props}>
      <Image
        alt={post.title}
        className="flex aspect-video rounded-2xl bg-black/10 dark:bg-white/10"
        height={1080}
        responsive={[
          {
            size: {
              width: 640,
              height: 360,
            },
            maxWidth: 640,
          },
          {
            size: {
              width: 320,
              height: 180,
            },
            maxWidth: 320,
          },
        ]}
        src={post.cover}
        width={1920}
      />

      <p className="mt-4 text-xs font-semibold text-secondary-700 dark:text-secondary">
        {t("components.post-card.published")}{" "}
        <time dateTime={post.published_at}>
          {formatDate({
            date: new Date(post.published_at!).toISOString().slice(0, 19),
            formatter: i18n.language === "en" ? "MMMM d, YYYY" : "d MMMM YYYY",
            locale: i18n.language,
          })}
        </time>
      </p>
      <h2 className="mt-[6px] text-xl font-bold text-primary-light dark:text-primary">{post.title}</h2>
      <p className={clsx("mt-[6px] text-xs font-semibold text-[#838383]", descriptionClassName)}>
        {post?.seo?.description}
      </p>
    </Wrapper>
  );
}

export { PostCard };
export type { PostCardProps };
