// Dependencies
import * as mdxBundler from "mdx-bundler/client";
import { useMemo } from "react";

// Internals
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { CodePen, CodeSandbox } from "~/components/mdx";

const mdxComponents = {
  CodePen,
  CodeSandbox,
  Image,
  a: Link,
};

/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code);

  function KCDMdxComponent({ components, ...rest }: Parameters<typeof Component>["0"]) {
    return (
      <Component
        // @ts-expect-error
        components={{ ...mdxComponents, ...components }}
        {...rest}
      />
    );
  }

  return KCDMdxComponent;
}

export function useMdxComponent(code: string) {
  return useMemo(() => getMdxComponent(code), [code]);
}
