// Dependencies
import { useTranslation } from "react-i18next";
import { Image } from "remix-image";

// Internals
import { fromNow } from "~/utils/date";
import { YoutubeIcon } from "../icons/youtube";
import { Link } from "../link";
import type { Videos } from "~/types";

function VideosSection(props: Videos) {
  const { i18n, t } = useTranslation("sections");

  return (
    <section className="relative mt-5 w-full overflow-hidden pl-4 lg:-mt-24 lg:px-4" id="latest-videos">
      <h2 className="mx-auto w-full max-w-5xl text-[26px] font-black uppercase text-primary-light dark:text-primary lg:pl-8">
        <span>{t("videos.title")}</span> <YoutubeIcon className="ml-3 inline-block h-[22px] w-8" />
      </h2>

      <div className="overflow-x-auto">
        <div className="mx-auto mt-3 w-[977px] rounded-[20px] bg-[#00247D]/80 p-5 backdrop-blur-lg dark:bg-primary/80 lg:py-8 lg:px-12">
          <ul className="grid grid-cols-4 gap-5">
            {props.items?.map((video) => (
              <li key={video.id}>
                <Link className="block" to={`https://www.youtube.com/watch?v=${video.id}`}>
                  <div className="aspect-video">
                    <Image
                      alt={video.snippet.title}
                      className="rounded-xl"
                      height={720}
                      responsive={[
                        {
                          size: {
                            width: 640,
                            height: 360,
                          },
                          maxWidth: 640,
                        },
                        {
                          size: {
                            width: 320,
                            height: 180,
                          },
                          maxWidth: 320,
                        },
                      ]}
                      src={video.snippet.thumbnails.maxres.url}
                      width={1280}
                    />
                  </div>

                  <h3 className="font-roboto lg:line-clamp-2 sr-only text-xs font-bold text-white lg:not-sr-only lg:mt-3">
                    {video?.snippet?.title}
                  </h3>

                  <p className="font-roboto sr-only text-xs font-medium text-white lg:not-sr-only lg:mt-2">
                    {video?.statistics?.viewCount} views •{" "}
                    {fromNow({
                      date: video?.snippet?.publishedAt,
                      locale: i18n.language,
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { VideosSection };
