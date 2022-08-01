// Dependencies
import * as React from "react";
import clsx from "clsx";

type TextAreaProps = React.ComponentProps<"textarea"> & {
  name: string;
  caption?: string;
  label?: string;
  rules: string;
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
  const useId = React.useId();
  const id = `${propId}-${useId}`;

  return (
    <fieldset>
      {label ? (
        <label className="block text-sm font-medium text-body dark:text-body-dark" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <textarea
        autoComplete={autoComplete}
        className={clsx(
          "mt-1 block w-full rounded-md bg-transparent shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
          "text-body dark:text-body-dark",
          "placeholder-body/50 dark:placeholder-body-dark/50",
          "border-body/80 dark:border-body-dark/80",
          className
        )}
        id={id}
        name={name}
        ref={ref}
        {...props}
      />
    </fieldset>
  );
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(RenderTextArea);

export type { TextAreaProps };
export { TextArea };
