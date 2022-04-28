// Dependencies
import * as React from "react";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";

type ViewsProps = {
  slug: string;
};

function Views({ slug }: ViewsProps) {
  const { i18n, t } = useTranslation("common");
  const persistViews = useFetcher();
  const persistViewsRef = React.useRef(persistViews);

  React.useEffect(() => {
    persistViewsRef.current = persistViews;
  }, [persistViews]);

  React.useEffect(() => {
    persistViewsRef.current.submit(
      {
        slug,
      },
      {
        action: `_content/refresh-views`,
        method: "post",
      }
    );
  }, [i18n.language, slug]);

  const views = persistViews.data?.views;

  return (
    <span className="rounded-full bg-secondary px-3 py-2 text-xs font-bold text-black">
      {views ? views.toLocaleString(i18n.language) : "---"}{" "}
      {views === 1 ? t("components.views.singular") : t("components.views.plural")}
    </span>
  );
}

export { Views };
export type { ViewsProps };
