// Internals
import { GeneralObserver } from "../general-observer";

export interface CodePenProps {
  /** CodePen id */
  codePenId: string;
  /** Height for the iFrame */
  height?: number;
  /** Which tabs to display */
  tabs?: string[] | "js" | "css" | "scss" | "less" | "result";
  /** Load pen in a preview state? **/
  clickToLoad?: boolean;
  /** Make the CodePen editable **/
  editable?: boolean;
  /** Theme of the CodePen **/
  theme?: string | "light" | "dark" | "default";
}

function CodePen({
  codePenId,
  height = 500,
  tabs = "result",
  clickToLoad = false,
  editable = false,
  theme = "default",
}: CodePenProps) {
  return (
    <GeneralObserver height={height}>
      <iframe
        allowFullScreen
        className="codepen"
        frameBorder="no"
        height={height}
        scrolling="no"
        src={`https://codepen.io/team/codepen/embed${
          clickToLoad ? "/preview" : ""
        }/${codePenId}?height=265&theme-id=${theme}&default-tab=${tabs}${editable ? "&editable=true" : ""}`}
        style={{
          width: "100%",
        }}
        title={`codepen-${codePenId}`}
      />
    </GeneralObserver>
  );
}

export default CodePen;
