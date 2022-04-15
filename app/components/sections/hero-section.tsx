// Dependencies
import { Image } from "remix-image";

// Internals
import { Rings } from "../rings";

function HeroSection() {
  return (
    <section className="container relative overflow-hidden" id="hero">
      <div className="relative left-1/2 mx-auto h-auto w-[563px] -translate-x-1/2 sm:left-[46%] md:left-[38%] lg:left-auto lg:w-full lg:max-w-[731px] lg:transform-none">
        <Rings className="h-auto w-full" />
      </div>

      <div className="absolute top-1/2 left-1/2 mt-2 -translate-x-1/2 -translate-y-1/2 md:mt-3">
        <div className="-mt-8 h-auto w-[249px] sm:w-full sm:max-w-[248px] md:mt-auto lg:max-w-[320px]">
          <Image
            alt="Daniel Esteves"
            src="/hero-mask.png"
            className="w-full"
            height={646}
            width={637}
            responsive={[
              {
                size: {
                  height: 324,
                  width: 320,
                },
                maxWidth: 320,
              },
            ]}
          />
        </div>
      </div>

      {/* Floating Card */}
      <div className="mx-auto -mt-16 w-full max-w-[332px] rounded-[20px] bg-secondary/80 pt-3 pr-5 pb-4 pl-8 backdrop-blur-sm dark:bg-secondary/[0.65] md:-mt-32 lg:absolute lg:top-1/2 lg:right-1/2 lg:mt-auto lg:mr-32">
        <h1 className="text-2xl font-black uppercase text-white">
          daniel esteves{" "}
          <span aria-label="victory hand" role="img">
            ✌️
          </span>
        </h1>
        <p className="mt-1 text-xs text-white">
          Senior Frontend Engineer @{" "}
          <a
            href="https://www.reworth.co/"
            rel="noopener noreferrer"
            target="_blank"
          >
            REWORTH
          </a>
          . <br />{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: "t('hero.description')",
            }}
          />
        </p>
      </div>

      {/* Search Trigger */}
      <div className="absolute bottom-1/4 hidden lg:right-[13%] lg:block xl:right-[20%]">
        {/* <Search /> */}
      </div>
    </section>
  );
}

export { HeroSection };
