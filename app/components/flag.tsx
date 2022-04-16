// Dependencies
import { useTranslation } from "react-i18next";
import { Image } from "remix-image";

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
      src={src}
      alt="Country flag"
      responsive={[
        {
          size: {
            width: 24,
            height: 24,
          },
          maxWidth: 24,
        },
      ]}
    />
  );
};

export { Flag };
