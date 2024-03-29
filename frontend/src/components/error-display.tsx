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
    dispatch({ type: "setError", payload: "" });
  }, [
    state.ffmpegParams,
    state.filename,
    state.outputFilename,
    state.clipStart,
    state.clipEnd,
  ]);

  return <span className="text-red-600">{state.error}</span>;
}
