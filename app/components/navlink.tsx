// Dependencies
import { forwardRef } from "react";
import { NavLink as RemixNavLink } from "@remix-run/react";
import type { NavLinkProps } from "@remix-run/react";

// Internals
import { Link } from "./link";

function RenderLink(
  { to, children, className, prefetch, reloadDocument, replace, state, style, ...props }: NavLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  if (to.toString().startsWith("http")) {
    return (
      <Link
        className={className?.toString()}
        prefetch={prefetch}
        reloadDocument={reloadDocument}
        replace={replace}
        state={state}
        style={style as React.CSSProperties}
        to={to}
        {...props}
        ref={ref}
      >
        {children as React.ReactNode}
      </Link>
    );
  }

  return (
    <RemixNavLink
      className={className}
      prefetch={prefetch}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      to={to}
      {...props}
      ref={ref}
    >
      {children}
    </RemixNavLink>
  );
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(RenderLink);

export { NavLink };
