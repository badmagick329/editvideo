import { Input } from "./ui/input";
import { FileExists } from "@/../wailsjs/go/main/App";
import { Action, State } from "@/types";
import { useEffect } from "react";
import InputWithLabel from "@/components/input-with-label";

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
    <InputWithLabel
      label={state.fileExists ? "Video file ✅" : "Enter video filepath"}
      value={state.filename}
      onChange={(e) =>
        dispatch({ type: "setFilename", payload: e.target.value })
      }
      disabled={state.ffmpegRunning}
      placeholder="Enter video filepath"
      type="text"
    />
  );
}
