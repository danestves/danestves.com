var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var redirects_exports = {};
__export(redirects_exports, {
  getRedirectsMiddleware: () => getRedirectsMiddleware
});
module.exports = __toCommonJS(redirects_exports);
var import_path_to_regexp = require("path-to-regexp");
function typedBoolean(value) {
  return Boolean(value);
}
function getRedirectsMiddleware({
  redirectsString
}) {
  const possibleMethods = [
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "*"
  ];
  const redirects = redirectsString.split("\n").map((line, lineNumber) => {
    if (!line.trim() || line.startsWith("#"))
      return null;
    let methods, from, to;
    const [one, two, three] = line.split(" ").map((l) => l.trim()).filter(Boolean);
    if (!one)
      return null;
    const splitOne = one.split(",");
    if (possibleMethods.some((m) => splitOne.includes(m))) {
      methods = splitOne;
      from = two;
      to = three;
    } else {
      methods = ["*"];
      from = one;
      to = two;
    }
    if (!from || !to) {
      console.error(`Invalid redirect on line ${lineNumber + 1}: "${line}"`);
      return null;
    }
    const keys = [];
    const toUrl = to.includes("//") ? new URL(to) : new URL(`https://same_host${to}`);
    try {
      return {
        methods,
        from: (0, import_path_to_regexp.pathToRegexp)(from, keys),
        keys,
        toPathname: (0, import_path_to_regexp.compile)(toUrl.pathname, {
          encode: encodeURIComponent
        }),
        toUrl
      };
    } catch (error) {
      console.error(`Failed to parse redirect on line ${lineNumber}: "${line}"`);
      return null;
    }
  }).filter(typedBoolean);
  return function redirectsMiddleware(req, res, next) {
    const host = req.header("X-Forwarded-Host") ?? req.header("host");
    const protocol = (host == null ? void 0 : host.includes("localhost")) ? "http" : "https";
    let reqUrl;
    try {
      reqUrl = new URL(`${protocol}://${host}${req.url}`);
    } catch (error) {
      console.error(`Invalid URL: ${protocol}://${host}${req.url}`);
      next();
      return;
    }
    for (const redirect of redirects) {
      try {
        if (!redirect.methods.includes("*") && !redirect.methods.includes(req.method)) {
          continue;
        }
        const match = req.path.match(redirect.from);
        if (!match)
          continue;
        const params = {};
        const paramValues = match.slice(1);
        for (let paramIndex = 0; paramIndex < paramValues.length; paramIndex++) {
          const paramValue = paramValues[paramIndex];
          const key = redirect.keys[paramIndex];
          if (key && paramValue) {
            params[key.name] = paramValue;
          }
        }
        const toUrl = redirect.toUrl;
        toUrl.protocol = protocol;
        if (toUrl.host === "same_host")
          toUrl.host = reqUrl.host;
        for (const [key, value] of reqUrl.searchParams.entries()) {
          toUrl.searchParams.append(key, value);
        }
        toUrl.pathname = redirect.toPathname(params);
        res.redirect(307, toUrl.toString());
        return;
      } catch (error) {
        console.error(`Error processing redirects:`, {
          error,
          redirect,
          "req.url": req.url
        });
      }
    }
    next();
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRedirectsMiddleware
});
