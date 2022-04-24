// Dependencies
import * as mdxBundler from "mdx-bundler/client";
import * as React from "react";

// Internals
import { CodePen } from "~/components/mdx";

const mdxComponents = {
  CodePen,
};

/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code);

  function KCDMdxComponent({ components, ...rest }: Parameters<typeof Component>["0"]) {
    return <Component components={{ ...mdxComponents, ...components }} {...rest} />;
  }

  return KCDMdxComponent;
}

export function useMdxComponent(code: string) {
  return React.useMemo(() => getMdxComponent(code), [code]);
}
