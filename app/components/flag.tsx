// Dependencies
import { useTranslation } from "react-i18next";

// Internals
import { Image } from "./image";

type FlagProps = {
  locale?: string;
};

const Flag = ({ ...props }: FlagProps): JSX.Element => {
  let { i18n } = useTranslation("common");
  let locale = props.locale || i18n.language;

  let src = `/img/flag/US.png`;
  if (locale === "es") {
    src = `/img/flag/VE.png`;
  }

  return (
    <Image
      alt="Country flag"
      height={1024}
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
