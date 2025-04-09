import alpinejs from "@astrojs/alpinejs";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { imageService } from "@unpic/astro/service";
import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
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
  integrations: [sitemap(), alpinejs()],
  image: {
    service: imageService({
      placeholder: "blurhash",
    }),
  },
  adapter: netlify(),
  experimental: {
    responsiveImages: true,
  },
  redirects: {
    "/work": "https://www.linkedin.com/in/danestves/#experience",
  },
});
