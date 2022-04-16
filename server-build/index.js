var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_express = require("@remix-run/express");
var import_globals = require("@remix-run/node/globals");
var import_compression = __toESM(require("compression"));
var import_express2 = __toESM(require("express"));
var import_fs = __toESM(require("fs"));
var import_morgan = __toESM(require("morgan"));
var import_on_finished = __toESM(require("on-finished"));
var import_path = __toESM(require("path"));
var import_redirects = require("./redirects");
var import_fly = require("./fly");
(0, import_globals.installGlobals)();
const here = (...d) => import_path.default.join(__dirname, ...d);
const MODE = process.env.NODE_ENV;
const BUILD_DIR = import_path.default.join(process.cwd(), "build");
const app = (0, import_express2.default)();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  next();
});
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = req.get("X-Forwarded-Host") ?? req.get("host");
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.all("*", import_fly.getReplayResponse);
app.all("*", (0, import_redirects.getRedirectsMiddleware)({
  redirectsString: import_fs.default.readFileSync(here("./_redirects.txt"), "utf8")
}));
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});
app.use((0, import_compression.default)());
const publicAbsolutePath = here("../public");
app.use(import_express2.default.static(publicAbsolutePath, {
  maxAge: "1w",
  setHeaders(res, resourcePath) {
    const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "");
    if (relativePath.startsWith("build/info.json")) {
      res.setHeader("cache-control", "no-cache");
      return;
    }
    if (relativePath.startsWith("fonts") || relativePath.startsWith("build")) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    }
  }
}));
app.use((0, import_morgan.default)("tiny"));
app.use((req, res, next) => {
  (0, import_on_finished.default)(res, () => {
    const referrer = req.get("referer");
    if (res.statusCode === 404 && referrer) {
      console.info(`\u{1F47B} 404 on ${req.method} ${req.path} referred by: ${referrer}`);
    }
  });
  next();
});
app.all("*", MODE === "production" ? (0, import_express.createRequestHandler)({ build: require("../build") }) : (req, res, next) => {
  purgeRequireCache();
  return (0, import_express.createRequestHandler)({ build: require("../build"), mode: MODE })(req, res, next);
});
const port = process.env.PORT ?? 3e3;
app.listen(port, () => {
  require("../build");
  console.log(`Express server listening on port ${port}`);
});
function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
