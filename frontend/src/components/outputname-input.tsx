import { Input } from "./ui/input";
import { Action, State } from "@/types";
import { defaultOutputFilename } from "@/utils";

export default function OutputnameInput({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  const showComponent =
    !state.outputFilename.trim() &&
    defaultOutputFilename(state.filename, state.fileExists);
  const style = showComponent
    ? "flex w-full gap-2 border-2 rounded-md p-2"
    : "";
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <div className={style}>
        <span className="font-black">
          {showComponent && "Default output filename:"}
        </span>
        <span>
          {showComponent
            ? `${defaultOutputFilename(state.filename, state.fileExists)}`
            : ""}
        </span>
      </div>
      <Input
        value={state.outputFilename}
        onChange={(e) =>
          dispatch({ type: "setOutputFilename", payload: e.target.value })
        }
        className="w-full max-w-lg"
        disabled={!state.fileExists}
        placeholder="Output filename"
      />
    </div>
  );
}
