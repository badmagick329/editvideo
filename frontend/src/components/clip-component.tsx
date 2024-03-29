import { Button } from "@/components/ui/button";
import { createClip } from "@/utils";
import { Action, State } from "@/types";
import InputWithLabel from "@/components/input-with-label";

export default function ClipComponent({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  if (!state.showClipInputs) {
    return null;
  }

  return (
    <div className="flex w-full max-w-lg items-end justify-center gap-4">
      <InputWithLabel
        label="Clip start"
        value={state.clipStart}
        onChange={(e) =>
          dispatch({ type: "setClipStart", payload: e.target.value })
        }
        disabled={!state.fileExists || state.ffmpegRunning}
        placeholder="Clip start time"
        type="text"
      />
      <InputWithLabel
        label="Clip end"
        value={state.clipEnd}
        onChange={(e) =>
          dispatch({ type: "setClipEnd", payload: e.target.value })
        }
        disabled={!state.fileExists || state.ffmpegRunning}
        placeholder="Clip end time"
        type="text"
      />
      <Button
        onClick={() => createClip(state)}
        disabled={!state.fileExists || state.ffmpegRunning}
      >
        {state.ffmpegRunning ? "Running" : "Clip"}
      </Button>
    </div>
  );
}
