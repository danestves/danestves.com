// Dependencies
import { forwardRef } from "react";
import { Link as RemixLink } from "@remix-run/react";
import type { LinkProps as RemixLinkProps } from "@remix-run/react";

type LinkProps = RemixLinkProps & {
  href?: string;
};

function RenderLink(
  { to, href, prefetch, reloadDocument, replace, state, ...props }: LinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  const hrefValue = href ?? to.toString();

  if (hrefValue.startsWith("http")) {
    return <a {...props} href={hrefValue} ref={ref} rel="noopener noreferrer" target="_blank" />;
  }

  return (
    <RemixLink
      prefetch={prefetch}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      to={href ? href : to}
      {...props}
      ref={ref}
    />
  );
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(RenderLink);

export { Link };
