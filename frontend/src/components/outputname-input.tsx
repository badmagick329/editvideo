import { Action, State } from "@/types";
import { defaultOutputFilename } from "@/utils";
import InputWithLabel from "@/components/input-with-label";

export default function OutputnameInput({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  let defaultText = defaultOutputFilename(state.filename, state.fileExists);
  if (state.outputFilename) {
    defaultText = "";
  }
  const labelText = defaultText
    ? `Output filename. Default output filename: ${defaultText}`
    : "Output filename";
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <InputWithLabel
        label={labelText}
        value={state.outputFilename}
        onChange={(e) =>
          dispatch({ type: "setOutputFilename", payload: e.target.value })
        }
        disabled={!state.fileExists}
        placeholder="Output filename"
        type="text"
      />
    </div>
  );
}
