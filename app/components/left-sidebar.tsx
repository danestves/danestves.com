// Dependencies
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

// Internals
import { NavLink } from "./navlink";
import type { NavLinkProps } from "~/types";
import { externalLinks } from "~/external-links";

const links: Array<NavLinkProps> = [
  {
    to: "/about",
    name: {
      en: "About me",
      es: "Acerca de mi",
    },
    prefetch: "intent",
  },
  {
    to: externalLinks.github,
    name: "GitHub",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    to: externalLinks.resume,
    name: {
      en: "Resume",
      es: "Currículum",
    },
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    to: "/blog",
    name: "Blog",
    prefetch: "intent",
  },
];

function LeftSidebar() {
  const { i18n } = useTranslation();

  return (
    <aside className="fixed top-0 left-0 z-10 hidden h-full px-12 lg:block">
      <ul
        className="flex h-full rotate-180 flex-col items-center justify-center space-y-4"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        {links.map(({ name, to, prefetch, ...link }) => (
          <li itemProp="name" key={nanoid()}>
            <NavLink
              className="text-xs font-semibold uppercase leading-3 text-body transition-colors duration-100 vertical-rl focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary-700 hover:text-primary-light dark:text-body-dark dark:hover:text-primary"
              itemProp="url"
              prefetch={prefetch}
              to={to}
              {...link}
            >
              {typeof name === "string"
                ? name
                : // @ts-ignore - i18n.language is a valid index
                  name?.[i18n.language]}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="fixed bottom-8 left-12 z-10">
        <NavLink
          className="font-semibold uppercase text-primary transition-colors duration-100 focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:text-primary-600"
          to="/blog"
        >
          blog
        </NavLink>
      </div>
    </aside>
  );
}

export { LeftSidebar };
