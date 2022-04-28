// Dependencies
import * as React from "react";
import clsx from "clsx";

function RenderKbd(
  { className, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
  ref: React.LegacyRef<HTMLElement>
) {
  return (
    <kbd
      {...props}
      className={clsx(
        "inline-flex min-h-[2.2em] min-w-[2.2em] items-center justify-center rounded-md border border-b-2 border-gray-300 bg-gray-50 px-2 text-xs dark:border-gray-400/20 dark:bg-black/20",
        className
      )}
      ref={ref}
    >
      {props.children}
    </kbd>
  );
}

const Kbd = React.forwardRef<HTMLElement, React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>>(
  RenderKbd
);

export { Kbd };
