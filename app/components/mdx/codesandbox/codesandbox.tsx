// Internals
import { GeneralObserver } from "../general-observer";

export type CodeSandboxProps = {
  /** CodeSandbox id */
  codeSandboxId: string;
};

function CodeSandbox({ codeSandboxId }: CodeSandboxProps) {
  return (
    <GeneralObserver>
      <iframe
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        className="codesandbox-mdx-embed w-full overflow-hidden rounded border-none"
        data-testid="codesandbox"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        src={`https://codesandbox.io/embed/${codeSandboxId}`}
        style={{
          height: "500px",
        }}
        title={`codeSandbox-${codeSandboxId}`}
      />
    </GeneralObserver>
  );
}

export default CodeSandbox;
