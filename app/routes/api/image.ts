// Dependencies
import {
  DiskCache,
  fetchResolver,
  fsResolver,
  imageLoader,
} from "remix-image/server";
import type { LoaderConfig, Resolver } from "remix-image/server";
import type { LoaderFunction } from "@remix-run/node";

// Internals
import { sharpTransformer } from "~/utils/image-transformer.server";

export const customResolver: Resolver = async (
  asset,
  url,
  options,
  basePath
) => {
  if (url.startsWith("/") && (url.length === 1 || url[1] !== "/")) {
    return fsResolver(asset, url, options, basePath);
  } else {
    return fetchResolver(asset, url, options, basePath);
  }
};

const config: LoaderConfig = {
  cache: new DiskCache(),
  resolver: customResolver,
  selfUrl: process.env.SELF_URL!,
  transformer: sharpTransformer,
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
