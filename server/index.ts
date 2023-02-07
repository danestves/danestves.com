// Dependencies
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import onFinished from "on-finished";
import path from "path";

// Internals
import { getRedirectsMiddleware } from "./redirects";
import { getReplayResponse } from "./fly";

const here = (...d: Array<string>) => path.join(__dirname, ...d);

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");

const loadBuild = () => {
  let build = require(BUILD_DIR);
  return build;
};

const app = express();

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown");
  // if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  next();
});

app.all("*", getReplayResponse);

app.all(
  "*",
  getRedirectsMiddleware({
    redirectsString: fs.readFileSync(here("./_redirects.txt"), "utf8"),
  })
);

app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

app.use(
  compression({
    filter: (req, res) => {
      // disable compression for document requests to allow chunked streaming
      if (req.headers["accept"] && req.headers["accept"].indexOf("text/html") !== -1) {
        return false;
      }

      return compression.filter(req, res);
    },
  })
);

const publicAbsolutePath = here("../public");

app.use(
  express.static(publicAbsolutePath, {
    immutable: true,
    maxAge: "1y",
    setHeaders(res, resourcePath) {
      const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "");
      if (relativePath.startsWith("build/info.json")) {
        res.setHeader("cache-control", "no-cache");
        return;
      }

      // If we ever change our font (which we quite possibly never will)
      // then we'll just want to change the filename or something...
      // Remix fingerprints its assets so we can cache forever
      if (relativePath.startsWith("fonts") || relativePath.startsWith("build")) {
        res.setHeader("cache-control", "public, max-age=31536000, immutable");
      }
    },
  })
);

app.use(morgan("tiny"));

// log the referrer for 404s
app.use((req, res, next) => {
  onFinished(res, () => {
    const referrer = req.get("referer");
    if (res.statusCode === 404 && referrer) {
      console.info(`👻 404 on ${req.method} ${req.path} referred by: ${referrer}`);
    }
  });
  next();
});

app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: loadBuild(), mode: MODE })
    : (req, res, next) => {
        purgeRequireCache();
        return createRequestHandler({ build: require(BUILD_DIR), mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  // preload the build so we're ready for the first request
  // we want the server to start accepting requests asap, so we wait until now
  // to preload the build
  require(BUILD_DIR);
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't const
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
