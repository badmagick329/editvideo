import { Input } from "./ui/input";
import { FileExists } from "@/../wailsjs/go/main/App";
import { Action, State } from "@/types";
import { useEffect } from "react";

export default function FileInput({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  useEffect(() => {
    (async () => {
      const res = await FileExists(state.filename);
      dispatch({ type: "setFileExists", payload: res });
    })();
  }, [state.filename]);

  return (
    <div className="flex gap-4 items-center w-full max-w-lg">
      <Input
        placeholder="Enter video filepath"
        value={state.filename}
        onChange={(e) =>
          dispatch({ type: "setFilename", payload: e.target.value })
        }
        className="w-2/3"
      />
      <span className="w-1/3 text-lg">
        {state.fileExists ? "File found ✅" : ""}
      </span>
    </div>
  );
}
