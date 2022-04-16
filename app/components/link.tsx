// Dependencies
import * as React from "react";
import { Link as RemixLink } from "@remix-run/react";
import type { LinkProps } from "@remix-run/react";

function RenderLink(
  { to, prefetch, reloadDocument, replace, state, ...props }: LinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  if (to.toString().startsWith("http")) {
    return <a {...props} href={to.toString()} ref={ref} rel="noopener noreferrer" target="_blank" />;
  }

  return (
    <RemixLink
      prefetch={prefetch}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      to={to}
      {...props}
      ref={ref}
    />
  );
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(RenderLink);

export { Link };
