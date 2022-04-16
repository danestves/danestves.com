// Dependencies
import * as React from "react";
import { NavLink as RemixNavLink } from "@remix-run/react";
import type { NavLinkProps } from "@remix-run/react";

// Internals
import { Link } from "./link";

function RenderLink(
  {
    to,
    children,
    className,
    prefetch,
    reloadDocument,
    replace,
    state,
    style,
    ...props
  }: NavLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  if (to.toString().startsWith("http")) {
    return (
      <Link
        to={to}
        className={className?.toString()}
        prefetch={prefetch}
        reloadDocument={reloadDocument}
        replace={replace}
        state={state}
        style={style as React.CSSProperties}
        {...props}
        ref={ref}
      >
        {children as React.ReactNode}
      </Link>
    );
  }

  return (
    <RemixNavLink
      to={to}
      className={className}
      prefetch={prefetch}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      {...props}
      ref={ref}
    >
      {children}
    </RemixNavLink>
  );
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(RenderLink);

export { NavLink };
