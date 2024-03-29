import { Button } from "@/components/ui/button";
import { State, Action } from "@/types";
import InputWithLabel from "@/components/input-with-label";

export default function CropComponent({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  if (!state.showCropInputs) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full max-w-lg justify-center gap-4">
          <InputWithLabel
            label="X"
            value={state.cropX || ""}
            onChange={(e) =>
              dispatch({ type: "setCropX", payload: e.target.value })
            }
            disabled={!state.fileExists}
            placeholder="x coordinate"
            type="number"
          />
          <InputWithLabel
            label="Y"
            value={state.cropY || ""}
            onChange={(e) =>
              dispatch({ type: "setCropY", payload: e.target.value })
            }
            disabled={!state.fileExists}
            placeholder="y coordinate"
            type="number"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full max-w-lg justify-center gap-4">
          <InputWithLabel
            label="Width"
            value={state.cropWidth || ""}
            onChange={(e) =>
              dispatch({ type: "setCropWidth", payload: e.target.value })
            }
            disabled={!state.fileExists}
            placeholder="width"
            type="number"
          />
          <InputWithLabel
            label="Height"
            value={state.cropHeight || ""}
            onChange={(e) =>
              dispatch({ type: "setCropHeight", payload: e.target.value })
            }
            disabled={!state.fileExists}
            placeholder="height"
            type="number"
          />
        </div>
      </div>

      <div className="flex w-full max-w-lg items-center justify-center gap-4">
        <Button disabled={!state.fileExists || state.ffmpegRunning}>
          Preview
        </Button>
        <Button disabled={!state.fileExists || state.ffmpegRunning}>
          {state.ffmpegRunning ? "Running" : "Crop"}
        </Button>
      </div>
    </div>
  );
}
