import FileInput from "./components/file-input";
import { useEffect, useReducer } from "react";
import { Button } from "./components/ui/button";
import OutputnameInput from "./components/outputname-input";
import { EventsOn } from "@/../wailsjs/runtime/runtime";
import {
  reducerCallback,
  defaultState,
  setVideoInfo,
  createClip,
} from "@/utils";
import ErrorDisplay from "./components/error-display";
import FFmpegParamsInput from "./components/ffmpeg-params-input";
import OutputDisplay from "./components/output-display";
import ClipTimeInput from "./components/clip-time-input";

function App() {
  const [state, dispatch] = useReducer(reducerCallback, defaultState);

  useEffect(() => {
    if (!state.fileExists) {
      dispatch({ type: "fileDoesNotExist", payload: null });
      return;
    }
    setVideoInfo(state.filename, dispatch);
  }, [state.fileExists]);

  useEffect(() => {
    EventsOn("ffmpeg-running", (running: boolean) => {
      dispatch({ type: "setFFmpegRunning", payload: running });
    });
    EventsOn("ffmpeg-error", (err: string) => {
      dispatch({ type: "setError", payload: err });
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-[#0e0e0e] text-white justify-center">
      <FileInput state={state} dispatch={dispatch} />
      <OutputDisplay state={state} dispatch={dispatch} />
      <ErrorDisplay state={state} dispatch={dispatch} />
      <div className="flex w-full flex-col items-center gap-2">
        <FFmpegParamsInput state={state} dispatch={dispatch} />
        <OutputnameInput state={state} dispatch={dispatch} />
      </div>
      <div className="flex w-full max-w-lg items-center justify-center gap-4">
        <ClipTimeInput
          value={state.clipStart}
          onChange={(e) =>
            dispatch({ type: "setClipStart", payload: e.target.value })
          }
          disabled={!state.fileExists || state.ffmpegRunning}
          placeholder="Clip start time"
        />
        <ClipTimeInput
          value={state.clipEnd}
          onChange={(e) =>
            dispatch({ type: "setClipEnd", payload: e.target.value })
          }
          disabled={!state.fileExists || state.ffmpegRunning}
          placeholder="Clip end time"
        />
        <Button
          onClick={() => createClip(state)}
          disabled={!state.fileExists || state.ffmpegRunning}
        >
          {state.ffmpegRunning ? "Running" : "Clip"}
        </Button>
      </div>
    </div>
  );
}

export default App;
