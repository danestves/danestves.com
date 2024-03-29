// Dependencies
import type { LinkProps as RemixLinkProps, NavLinkProps as RemixNavLinkProps } from "@remix-run/react";
import type { ExternalScriptsFunction } from "remix-utils";

export type Handle = {
  i18n?: string | Array<string>;
  id?: string;
  scripts?: ExternalScriptsFunction;
};

export interface LinkProps extends RemixLinkProps {
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  name?:
    | string
    | {
        en: string;
        es: string;
      };
}

export interface NavLinkProps extends RemixNavLinkProps {
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  name?:
    | string
    | {
        en: string;
        es: string;
      };
}

export * from "./content";
export * from "./github";
export * from "./youtube";
