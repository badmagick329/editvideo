import { Action, State } from "@/types";
import { useEffect } from "react";

export default function OutputDisplay({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  useEffect(() => {
    if (!state.fileExists) return;
    dispatch({
      type: "setVideoInfoDisplay",
      payload: {
        clipStart: "0",
        clipEnd: state.duration.toString(),
      },
    });
  }, [state.fileExists, state.width, state.height, state.duration]);

  return <span>{state.output}</span>;
}
