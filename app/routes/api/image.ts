// Dependencies
import { DiskCache, fsResolver, imageLoader } from "remix-image/server";
import type { LoaderConfig } from "remix-image/server";
import type { LoaderFunction } from "@remix-run/node";

// Internals
import { sharpTransformer } from "~/utils/image-transformer.server";

const config: LoaderConfig = {
  cache: new DiskCache(),
  resolver: fsResolver,
  selfUrl: "http://localhost:3000",
  transformer: sharpTransformer,
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
