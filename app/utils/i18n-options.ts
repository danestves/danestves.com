// Dependencies
import type { InitOptions } from "i18next";

const options: InitOptions = {
  debug: process.env.NODE_ENV !== "production",
  fallbackLng: "en",
  fallbackNS: "common",
  react: {
    useSuspense: true,
  },
  supportedLngs: ["en", "es"],
};

export default options;
