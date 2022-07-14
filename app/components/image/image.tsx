// Dependencies
import * as React from "react";
import { Image as RemixImage } from "remix-image";
import type { ImageProps as RemixImageProps } from "remix-image";

// Internals
import { useNextGenImageFormat } from "~/hooks/use-next-gen-image-format";

export type ImageProps = RemixImageProps;

function RenderImage({ ...props }: ImageProps, ref: React.Ref<HTMLImageElement>) {
  return (
    <RemixImage
      {...props}
      options={{
        contentType: useNextGenImageFormat(),
        ...props.options,
      }}
      ref={ref}
      style={{
        ...props.style,
        minHeight: "inherit",
        minWidth: "inherit",
      }}
    />
  );
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(RenderImage);

export default Image;
