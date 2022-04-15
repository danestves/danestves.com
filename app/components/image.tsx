// Dependencies
import * as React from "react";
import { useResponsiveImage } from "remix-image";
import type { ImageProps } from "remix-image";

function RenderImage(
  { alt = "", loaderUrl = "/api/image", responsive = [], ...props }: ImageProps,
  ref: React.LegacyRef<HTMLImageElement>
) {
  const responsiveProps = useResponsiveImage(props, loaderUrl, responsive);

  return <img alt="" {...props} {...responsiveProps} ref={ref} />;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(RenderImage);

export { Image };
