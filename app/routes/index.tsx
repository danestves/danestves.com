// Internals
import { HeroSection } from "~/components/sections/hero-section";
import type { Handle } from "~/types";

export const handle: Handle = {
  i18n: "sections",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
    </>
  );
}
