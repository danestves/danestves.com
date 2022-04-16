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
var fly_exports = {};
__export(fly_exports, {
  getReplayResponse: () => getReplayResponse
});
module.exports = __toCommonJS(fly_exports);
const { FLY, PRIMARY_REGION, FLY_REGION } = process.env;
const isPrimaryRegion = PRIMARY_REGION === FLY_REGION;
const getReplayResponse = function getReplayResponse2(req, res, next) {
  const { method, path: pathname } = req;
  if (method === "GET" || method === "OPTIONS" || method === "HEAD") {
    return next();
  }
  if (!FLY || isPrimaryRegion)
    return next();
  if (pathname.includes("__metronome")) {
    return next();
  }
  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION
  };
  console.info(`Replaying:`, logInfo);
  res.set("fly-replay", `region=${PRIMARY_REGION}`);
  return res.sendStatus(409);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getReplayResponse
});
