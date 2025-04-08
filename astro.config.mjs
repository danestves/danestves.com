import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { imageService } from "@unpic/astro/service";
import opengraphImages, { presets } from "astro-opengraph-images";
import { defineConfig } from "astro/config";
import fs from "node:fs";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      Icons({
        // experimental
        autoInstall: true,
        compiler: "astro",
      }),
      tailwindcss(),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: true,
      skipInline: false,
      drafts: false,
    },
  },
  site: "https://danestves.com",
  integrations: [
    sitemap(),
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Geist",
            weight: 400,
            style: "normal",
            data: fs.readFileSync("node_modules/@fontsource/geist/files/geist-latin-400-normal.woff"),
          },
        ],
      },
      render: presets.blackAndWhite,
    }),
  ],
  image: {
    service: imageService({
      fallbackService: "astro",
      placeholder: "blurhash",
    }),
  },
  redirects: {
    "/work": "https://www.linkedin.com/in/danestves/#experience",
  },
});
