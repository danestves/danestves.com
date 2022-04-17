// Dependencies
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

// Internals
import { externalLinks } from "~/external-links";
import { Logo } from "./logo";
import { NavLink } from "./navlink";
import type { NavLinkProps } from "~/types";

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
  },
  {
    to: "/contact",
    name: {
      en: "Contact",
      es: "Contacto",
    },
  },
];

function Footer() {
  const { i18n, t } = useTranslation("common");

  return (
    <footer className="w-full py-8">
      <div className="container flex flex-col justify-center space-y-8">
        <NavLink
          className="mx-auto inline-block h-9 w-9 focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary"
          to="/"
        >
          <span className="sr-only">@danestves</span>
          <Logo aria-hidden="true" className="h-9 w-9 text-secondary" />
        </NavLink>

        <ul className="flex flex-col items-center justify-center xs:flex-row xs:space-x-4">
          {links.map(({ name, to, prefetch, ...link }) => (
            <li key={nanoid()}>
              <NavLink
                className="text-xs font-semibold uppercase leading-3 text-body/80 transition-colors duration-100 focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:text-primary dark:text-body-dark/80 dark:hover:text-primary"
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

        <p className="text-center text-xs font-semibold leading-3 text-body dark:text-body-dark">
          © {new Date().getFullYear()} Daniel Esteves. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}

export { Footer };
