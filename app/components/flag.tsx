// Dependencies
import { useTranslation } from "react-i18next";
import { Image } from "remix-image";

// Internals
import { useNextGenImageFormat } from "~/hooks/use-next-gen-image-format";

type FlagProps = {
  locale?: string;
};

const Flag = ({ ...props }: FlagProps): JSX.Element => {
  let { i18n } = useTranslation("common");
  let locale = props.locale || i18n.language;

  let src = `/flag/US.png`;
  if (locale === "es") {
    src = `/flag/VE.png`;
  }

  return (
    <Image
      alt="Country flag"
      height={1024}
      options={{
        contentType: useNextGenImageFormat(),
      }}
      responsive={[
        {
          size: {
            width: 72,
            height: 72,
          },
          maxWidth: 72,
        },
      ]}
      src={src}
      width={1024}
    />
  );
};

export { Flag };
