// Dependencies
import * as React from "react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

type TextAreaProps = React.ComponentProps<"textarea"> & {
  name: string;
  caption?: string;
  label?: string;
};

function RenderTextArea(
  {
    label,
    name,
    "aria-describedby": ariaDescribedBy,
    autoComplete = "off",
    caption,
    className,
    id: propId,
    ...props
  }: TextAreaProps,
  ref: React.LegacyRef<HTMLTextAreaElement>
) {
  const useId = nanoid(6);
  const { t } = useTranslation("errors");
  const { error, getInputProps } = useField(name);
  const id = `${propId}-${useId}`;

  return (
    <div>
      <div
        className={clsx(
          "rounded-md border px-3 py-2 shadow-sm transition duration-100 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-600 dark:focus-within:border-primary-600",
          error ? "border-red-500/80" : "border-body/80 dark:border-body-dark/80"
        )}
      >
        {label ? (
          <label
            className={clsx("block text-sm font-medium", error ? "text-red-500" : "text-body dark:text-body-dark")}
            htmlFor={id}
          >
            {label}
          </label>
        ) : null}

        <textarea
          aria-describedby={error ? `${id}-error` : ariaDescribedBy ? ariaDescribedBy : `${id}-description`}
          aria-invalid={error ? "true" : undefined}
          autoComplete={autoComplete}
          className={clsx(
            "block w-full border-0 bg-transparent p-0 outline-none placeholder:font-medium focus:ring-0 sm:text-base",
            error ? "text-red-500" : "text-body dark:text-body-dark",
            error ? "placeholder-red-500/50" : "placeholder-body/50 dark:placeholder-body-dark/50",
            className
          )}
          id={id}
          name={name}
          {...getInputProps({ ...props, ref })}
        />
      </div>

      {error ? (
        <p className="mt-2 text-base text-red-500" id={`${id}-error`}>
          {t(`${name}.errors.${error}`)}
        </p>
      ) : caption ? (
        <p
          className="mt-2 text-base italic text-body/80 dark:text-body-dark/80"
          id={ariaDescribedBy ?? `${id}-description`}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(RenderTextArea);

export type { TextAreaProps };
export { TextArea };
