// Dependencies
import { useTranslation } from "react-i18next";

// Internals
import { Link } from "../link";
import { Image } from "../image";
import { Rings } from "../rings";
import { Search } from "../search";

function HeroSection() {
  const { t } = useTranslation("sections");

  return (
    <section className="container relative overflow-hidden" id="hero">
      <div className="relative left-1/2 mx-auto h-auto w-[563px] -translate-x-1/2 sm:left-[46%] md:left-[38%] lg:left-auto lg:w-full lg:max-w-[731px] lg:transform-none">
        <Rings className="h-auto w-full" />
      </div>

      <div className="absolute top-1/2 left-1/2 mt-2 -translate-x-1/2 -translate-y-1/2 md:mt-3">
        <div className="-mt-12 h-auto w-[249px] sm:w-full sm:max-w-[248px] md:mt-auto lg:max-w-[320px]">
          <Image
            alt="Daniel Esteves"
            className="w-full"
            height={646}
            responsive={[
              {
                size: {
                  height: 504,
                  width: 498,
                },
                maxWidth: 498,
              },
            ]}
            src="/hero-mask.png"
            width={637}
          />
        </div>
      </div>

      {/* Floating Card */}
      <div className="mx-auto -mt-16 w-full max-w-[332px] -translate-y-1/2 rounded-[20px] bg-primary/[.65] pt-3 pr-5 pb-4 pl-8 text-[#293845] backdrop-blur-[2px] dark:text-body-darker md:-mt-32 lg:absolute lg:top-1/2 lg:right-1/2 lg:mt-auto lg:mr-32">
        <h1 className="text-2xl font-black uppercase">
          daniel esteves{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h1>
        <p className="mt-1 text-xs">
          Senior Frontend Engineer @{" "}
          <Link
            className="rounded underline decoration-1 underline-offset-2 hover:decoration-2 focus:decoration-2 focus:outline-none"
            to="https://www.reworth.co/"
          >
            REWORTH
          </Link>
          . <br />{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: t("hero.description"),
            }}
          />
        </p>
      </div>

      {/* Search Trigger */}
      <div className="absolute bottom-1/4 hidden lg:right-[13%] lg:block xl:right-[20%]">
        <Search />
      </div>
    </section>
  );
}

export { HeroSection };
