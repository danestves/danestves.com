// Netlify runs a function with this file name after every successful deploy. On production deploys it sends
// the sitemap's URLs to IndexNow, which shares them with Bing, Yandex, Seznam and Naver. Google ignores IndexNow.
const SITE = "https://danestves.com";
// The key is public by design: IndexNow checks that SITE/<key>.txt holds it.
const KEY = "d99a0d2cc5f17cea641530552f6a95a7";

export default async (req: Request) => {
  const { payload } = (await req.json()) as { payload: { context: string } };
  if (payload.context !== "production") return;

  const sitemap = await fetch(`${SITE}/sitemap-0.xml`).then((res) => res.text());
  const urlList = [...sitemap.matchAll(/<loc>(.+?)<\/loc>/g)].map(([, url]) => url);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  console.log(`IndexNow answered ${res.status} for ${urlList.length} URLs`);
};
