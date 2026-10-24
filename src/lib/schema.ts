const SITE = "https://danestves.com";

/** One JSON-LD node. Pages pass these to BaseLayout, which wraps them in a single @graph. */
export type JsonLdNode = Record<string, unknown>;

/** Stable @ids so page nodes can point at the entities below instead of repeating them. */
export const ids = {
  org: `${SITE}/#organization`,
  person: `${SITE}/#daniel`,
  website: `${SITE}/#website`,
} as const;

/** Emitted on every page: the studio, its founder, and the site. */
export const siteNodes: JsonLdNode[] = [
  {
    "@type": "Organization",
    "@id": ids.org,
    name: "danestves LLC",
    legalName: "danestves LLC",
    alternateName: "danestves",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/web-app-manifest-512x512.png`, width: 512, height: 512 },
    description:
      "danestves LLC is the software studio of Daniel Esteves. It builds and publishes Outlayr and Vela, and builds iOS, Android and web apps for clients.",
    email: "hi@danestves.com",
    founder: { "@id": ids.person },
    address: {
      "@type": "PostalAddress",
      streetAddress: "651 N Broad St, Suite 201",
      addressLocality: "Middletown",
      addressRegion: "DE",
      postalCode: "19709",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hi@danestves.com",
      url: `${SITE}/contact/`,
    },
  },
  {
    "@type": "Person",
    "@id": ids.person,
    name: "Daniel Esteves",
    alternateName: "danestves",
    // No dedicated about page yet; /studio/ is the page that introduces him.
    url: `${SITE}/studio/`,
    image: `${SITE}/images/daniel.jpg`,
    jobTitle: "Founder and software developer",
    worksFor: { "@id": ids.org },
    sameAs: [
      "https://github.com/danestves",
      "https://www.linkedin.com/in/danestves/",
      "https://x.com/danestves",
      "https://www.youtube.com/@danestves",
    ],
  },
  {
    "@type": "WebSite",
    "@id": ids.website,
    url: `${SITE}/`,
    name: "danestves LLC",
    alternateName: "danestves",
    inLanguage: "en",
    publisher: { "@id": ids.org },
  },
];

/** BreadcrumbList from [name, path] pairs, e.g. [["Home", "/"], ["Projects", "/projects/"]]. */
export function breadcrumb(trail: [name: string, path: string][]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: new URL(path, SITE).href,
    })),
  };
}
