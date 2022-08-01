// Dependencies
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

// Internals
import { externalLinks } from "~/external-links";
import { useSticky } from "~/hooks/use-sticky";
import { GithubIcon } from "./icons/github";
import { MenuIcon } from "./icons/menu";
import { TwitterIcon } from "./icons/twitter";
import { XIcon } from "./icons/x";
import { YoutubeIcon } from "./icons/youtube";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { NavLink } from "./navlink";
import { Search } from "./search";
import { ThemeSwitcher } from "./theme-switcher";
import type { NavLinkProps } from "~/types";

const links: Array<NavLinkProps> = [
  {
    to: "/about",
    name: {
      en: "About me",
      es: "Acerca de mí",
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

const socialLinks: Array<NavLinkProps> = [
  {
    to: externalLinks.twitter,
    icon: TwitterIcon,
    name: "Twitter",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    to: externalLinks.youtube,
    icon: YoutubeIcon,
    name: "YouTube",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    to: externalLinks.github,
    icon: GithubIcon,
    name: "GitHub",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

const mobileLinks: Array<NavLinkProps> = [
  {
    to: "/",
    name: {
      en: "Home",
      es: "Inicio",
    },
  },
  ...links,
];

function Header() {
  const { i18n } = useTranslation();
  const isSticky = useSticky(16);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-20 w-full px-6 transition-all duration-100 lg:px-12",
        isSticky ? "bg-white/95 py-2 shadow backdrop-blur dark:bg-body-darker/75" : "py-6"
      )}
    >
      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-0">
          <Popover className="lg:hidden">
            <Popover.Button className="block rounded-md focus:outline-none focus:ring-4 focus:ring-secondary/50">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-auto w-[31px] text-secondary" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                className="fixed inset-x-0 top-0 z-10 origin-top-left bg-white/80 p-2 backdrop-blur-lg transition dark:bg-body-darker/80 lg:hidden"
                focus
              >
                <div className="overflow-hidden rounded-lg  shadow-md ring-1 ring-black/10 dark:ring-white/10">
                  <div className="flex items-center justify-between px-5 pt-4">
                    <NavLink
                      className="focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary"
                      to="/"
                    >
                      <Logo className="h-8 w-auto text-secondary" />
                    </NavLink>
                    <div className="-mr-2">
                      <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 ring-1 ring-black/10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:bg-gray-100 hover:text-gray-500 dark:bg-body-darker dark:text-gray-200 dark:ring-white/10">
                        <span className="sr-only">Close menu</span>
                        <XIcon aria-hidden="true" className="h-6 w-6" />
                      </Popover.Button>
                    </div>
                  </div>
                  <ul className="px-2 pt-2 pb-3" itemScope itemType="https://schema.org/SiteNavigationElement">
                    {mobileLinks.map(({ name, to, ...link }) => (
                      <li itemProp="name" key={nanoid()}>
                        <Popover.Button
                          as={NavLink}
                          itemProp="url"
                          to={to}
                          {...link}
                          className="block rounded-md py-2 px-3 text-base font-semibold uppercase text-body/60 transition-colors duration-100 focus-within:rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:text-primary dark:text-body-dark dark:hover:text-primary"
                        >
                          {typeof name === "string"
                            ? name
                            : // @ts-ignore - i18n.language is a valid index
                              name?.[i18n.language]}
                        </Popover.Button>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gray-50/20 py-3 px-5 dark:bg-[#191919]/20">
                    <div className="mx-auto flex max-w-xs justify-between">
                      {socialLinks.map(({ icon: Icon, name, to, ...item }) => (
                        <Popover.Button
                          as={NavLink}
                          key={nanoid()}
                          to={to}
                          {...item}
                          className="block rounded-md px-3 py-2 text-base font-semibold uppercase focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary"
                        >
                          <span className="sr-only">{typeof name === "string" ? name : null}</span>
                          {Icon && (
                            <Icon
                              className={clsx(
                                "h-6 w-6",
                                typeof name === "string"
                                  ? name?.toLowerCase().includes("github") && "text-[#333] dark:text-white"
                                  : null
                              )}
                            />
                          )}
                        </Popover.Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <div className="block lg:hidden">
            <ThemeSwitcher />
          </div>

          <NavLink
            className="hidden h-9 w-9 focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary lg:inline-block"
            to="/"
          >
            <span className="sr-only">@danestves</span>
            <Logo aria-hidden="true" className="h-9 w-9 text-secondary" />
          </NavLink>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2">
          <NavLink
            className="inline-block h-9 w-9 focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary lg:hidden"
            to="/"
          >
            <span className="sr-only">@danestves</span>
            <Logo aria-hidden="true" className="h-9 w-9 text-secondary" />
          </NavLink>

          {/* We put a padding left to simulate that in desktop is centered */}
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="block lg:hidden">
            <Search />
          </div>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export { Header };
