// Dependencies
import { forwardRef } from "react";
import { Image as RemixImage, remixImageLoader } from "remix-image";
import type { ImageProps as RemixImageProps } from "remix-image";

// Internals
import { useNextGenImageFormat } from "~/hooks/use-next-gen-image-format";

export type ImageProps = RemixImageProps;

function RenderImage({ ...props }: ImageProps, ref: React.Ref<HTMLImageElement>) {
  return (
    <RemixImage
      {...props}
      loader={remixImageLoader}
      loaderUrl="/api/image"
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

const Image = forwardRef<HTMLImageElement, ImageProps>(RenderImage);

export default Image;
