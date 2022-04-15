// Dependencies
import * as React from "react";
import { MimeType } from "remix-image";

function useNextGenImageFormat() {
  const [format, setFormat] = React.useState<MimeType | undefined>(
    MimeType.WEBP
  );

  React.useEffect(() => {
    const elem = document.createElement("canvas");

    if (elem.getContext && elem.getContext("2d")) {
      // was able or not to get WebP representation
      setFormat(
        elem.toDataURL("image/avif").indexOf("data:image/avif") == 0
          ? MimeType.AVIF
          : elem.toDataURL("image/webp").indexOf("data:image/webp") == 0
          ? MimeType.WEBP
          : undefined
      );
    }
  }, []);

  return format;
}

export { useNextGenImageFormat };
