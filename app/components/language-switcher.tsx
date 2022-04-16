// Dependencies
import * as React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

// Internals
import { Flag } from "./flag";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const persistLanguage = useFetcher();
  const persistLanguageRef = React.useRef(persistLanguage);

  const onChange = async (language: typeof languages[0]) => {
    persistLanguageRef.current.submit({ lang: language.code }, { action: "action/set-language", method: "post" });
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language);

  return (
    <div className="relative lg:w-40">
      <Listbox onChange={onChange} value={currentLanguage}>
        <Listbox.Button className="inline-flex items-center space-x-4 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary md:rounded-md md:py-2 md:px-4">
          <div className="h-9 w-9 rounded-full md:h-6 md:w-6">
            <Flag />
          </div>
          <span className="sr-only inline-flex font-semibold uppercase text-primary md:not-sr-only">
            {currentLanguage?.name}{" "}
            <span aria-label="waving hand" className="ml-1" role="img">
              👋🏻
            </span>
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 mt-1 w-min rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#303030]">
            {languages.map((lang) => (
              <Listbox.Option
                className={({ active, selected }) =>
                  clsx(
                    "mx-auto inline-flex w-full cursor-default select-none items-center space-x-4 rounded-md px-4 py-2 transition-colors duration-100 focus-within:bg-primary focus-within:text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary hover:bg-primary hover:text-white",
                    selected
                      ? "bg-primary/10 text-primary hover:bg-primary"
                      : active
                      ? "bg-primary text-white"
                      : "text-primary",
                    active && "!bg-primary !text-white outline outline-2 outline-offset-2 outline-secondary"
                  )
                }
                key={lang.code}
                value={lang}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full">
                  <Flag locale={lang.code} />
                </div>
                <span className="w-full justify-between font-semibold uppercase transition-colors duration-100">
                  {lang.name}
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

export { LanguageSwitcher };
