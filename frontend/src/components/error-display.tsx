import { Action, State } from "@/types";
import { useEffect } from "react";

export default function ErrorDisplay({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  useEffect(() => {
    if (state.error) {
      dispatch({ type: "setError", payload: "" });
    }
  }, [
    state.ffmpegParams,
    state.filename,
    state.outputFilename,
    state.clipStart,
    state.clipEnd,
    state.cropX,
    state.cropY,
    state.cropWidth,
    state.cropHeight,
  ]);

  return <span className="text-red-600">{state.error}</span>;
}
