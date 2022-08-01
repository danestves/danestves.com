// Dependencies
import { createElement, useState } from "react";
import { useTheme } from "remix-themes";
import { ClientOnly } from "remix-utils";

/**
 * This allows you to render something that depends on the theme without
 * worrying about whether it'll SSR properly when we don't actually know
 * the user's preferred theme.
 *
 * Code by https://github.com/kentcdodds/kentcdodds.com/blob/main/app/utils/theme-provider.tsx#L189
 */
function Themed({
  dark,
  light,
  initialOnly = false,
}: {
  dark: React.ReactNode | string;
  light: React.ReactNode | string;
  initialOnly?: boolean;
}) {
  const [theme] = useTheme();
  const [initialTheme] = useState(theme);
  const themeToReference = initialOnly ? initialTheme : theme;
  const serverRenderWithUnknownTheme = !theme && typeof window !== "object";
  if (serverRenderWithUnknownTheme) {
    // stick them both in and our little script will update the DOM to match
    // what we'll render in the client during hydration.
    return (
      <ClientOnly>
        {() => (
          <>
            {createElement("dark-mode", null, dark)}
            {createElement("light-mode", null, light)}
          </>
        )}
      </ClientOnly>
    );
  } else {
    return <ClientOnly>{() => (themeToReference === "light" ? light : dark)}</ClientOnly>;
  }
}

export { Themed };
