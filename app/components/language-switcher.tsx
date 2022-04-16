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
    persistLanguageRef.current.submit(
      { lang: language.code },
      { action: "action/set-language", method: "post" }
    );
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language);

  return (
    <div className="relative lg:w-40">
      <Listbox value={currentLanguage} onChange={onChange}>
        <Listbox.Button className="inline-flex items-center space-x-4 rounded-full focus:outline-none focus:ring-4 focus:ring-secondary/50 md:rounded-md md:py-2 md:px-4">
          <div className="h-9 w-9 rounded-full md:h-6 md:w-6">
            <Flag />
          </div>
          <span className="sr-only inline-flex font-semibold uppercase text-secondary md:not-sr-only">
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
          <Listbox.Options className="absolute right-0 mt-1 w-min overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#303030]">
            {languages.map((lang) => (
              <Listbox.Option
                key={lang.code}
                className={({ active, selected }) =>
                  clsx(
                    "group mx-auto inline-flex w-full cursor-default select-none items-center space-x-4 py-2 px-4 transition-colors duration-200",
                    active && !selected && "bg-secondary",
                    selected && "dark:bg-[#202020]"
                  )
                }
                value={lang}
              >
                {({ selected }) => (
                  <>
                    <div className="h-6 w-6 rounded-full">
                      <Flag locale={lang.code} />
                    </div>
                    <span
                      className={clsx(
                        "w-full justify-between font-semibold uppercase transition-colors duration-200 group-hover:text-white",
                        selected ? "text-white" : "text-secondary"
                      )}
                    >
                      {lang.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

export { LanguageSwitcher };
