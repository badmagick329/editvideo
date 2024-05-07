import { Button } from "@/components/ui/button";
import { State, Action } from "@/types";
import InputWithLabel from "@/components/input-with-label";
import { CreateCrop, PreviewCrop } from "@/../wailsjs/go/ffmpeg/FFmpeg";
import { defaultOutputFilename } from "@/utils";

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
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full max-w-lg justify-center gap-4">
            <InputWithLabel
              label="Clip start"
              value={state.cropClipStart || ""}
              onChange={(e) =>
                dispatch({ type: "setCropClipStart", payload: e.target.value })
              }
              disabled={!state.fileExists}
              placeholder="clip start"
              type="text"
            />
            <InputWithLabel
              label="Clip end"
              value={state.cropClipEnd || ""}
              onChange={(e) =>
                dispatch({ type: "setCropClipEnd", payload: e.target.value })
              }
              disabled={!state.fileExists}
              placeholder="clip end"
              type="text"
            />
          </div>
        </div>
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
        <Button
          disabled={!state.fileExists || state.ffmpegRunning}
          onClick={() => {
            const cropX = (state.cropX || 0).toString();
            const cropY = (state.cropY || 0).toString();
            const cropWidth = (state.cropWidth || state.width).toString();
            const cropHeight = (state.cropHeight || state.height).toString();
            PreviewCrop(
              cropWidth,
              cropHeight,
              cropX,
              cropY,
              state.cropClipStart,
              state.cropClipEnd,
              state.duration,
              state.filename,
            );
          }}
        >
          Preview
        </Button>
        <Button
          disabled={!state.fileExists || state.ffmpegRunning}
          onClick={() => {
            const out =
              state.outputFilename ||
              defaultOutputFilename(state.filename, state.fileExists);
            const cropX = (state.cropX || 0).toString();
            const cropY = (state.cropY || 0).toString();
            const cropWidth = (state.cropWidth || state.width).toString();
            const cropHeight = (state.cropHeight || state.height).toString();
            CreateCrop(
              state.filename,
              out,
              cropWidth,
              cropHeight,
              cropX,
              cropY,
              state.cropClipStart,
              state.cropClipEnd,
              state.ffmpegParams,
            );
          }}
        >
          {state.ffmpegRunning ? "Running" : "Crop"}
        </Button>
      </div>
    </div>
  );
}
