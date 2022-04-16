// Dependencies
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

// Internals
import { externalLinks } from "~/external-links";
import { Link } from "./link";
import type { LinkProps } from "~/types";

const links: Array<LinkProps> = [
  {
    to: externalLinks.twitter,
    name: "Twitter",
  },
  {
    to: externalLinks.youtube,
    name: "YouTube",
  },
  {
    to: externalLinks.github,
    name: "GitHub",
  },
];

function RightSidebar() {
  const { i18n } = useTranslation();

  return (
    <aside className="fixed top-0 right-0 z-10 hidden h-full px-12 lg:block">
      <ul
        className="flex h-full rotate-180 flex-col items-center justify-center space-y-4"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        {links.map(({ name, ...link }) => (
          <li itemProp="name" key={nanoid()}>
            <Link
              className="text-xs font-semibold uppercase leading-3 text-body transition-colors duration-100 vertical-rl focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:text-primary dark:text-body-dark dark:hover:text-primary"
              itemProp="url"
              {...link}
            >
              {typeof name === "string"
                ? name
                : // @ts-ignore - i18n.language is a valid index
                  name?.[i18n.language]}
            </Link>
          </li>
        ))}
      </ul>

      <div className="fixed right-12 bottom-8 z-10">
        <Link
          className="font-semibold uppercase text-primary transition-colors duration-100 focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:text-primary-600"
          to="https://twitter.com/messages/compose?recipient_id=554765148"
        >
          contact{" "}
          <span aria-label="call me hand" role="img">
            🤙
          </span>
        </Link>
      </div>
    </aside>
  );
}

export { RightSidebar };
