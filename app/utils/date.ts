// Dependencies
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);

type FormatDateProps = {
  date: string | Date;
  formatter?: string;
  locale?: "en" | "es" | string;
};

const formatDate = ({ date, formatter = "mm/dd/yyyy", locale = "en" }: FormatDateProps): string => {
  return dayjs(date).locale(locale).format(formatter);
};

type FromNowProps = {
  date: string | Date;
  locale?: "en" | "es" | string;
};

const fromNow = ({ date, locale = "en" }: FromNowProps) => {
  return dayjs(new Date(date)).locale(locale).fromNow();
};

export { formatDate, fromNow };
export type { FormatDateProps, FromNowProps };
