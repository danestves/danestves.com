// Dependencies
import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

export const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "__danestves_theme",
    expires: new Date("2222-11-29"),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeStorage);
