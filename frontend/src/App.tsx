import FileInput from "@/components/file-input";
import { useEffect, useReducer } from "react";
import OutputnameInput from "@/components/outputname-input";
import { EventsOn } from "@/../wailsjs/runtime/runtime";
import { reducerCallback, defaultState, setVideoInfo } from "@/utils";
import ErrorDisplay from "@/components/error-display";
import FFmpegParamsInput from "@/components/ffmpeg-params-input";
import OutputDisplay from "@/components/output-display";
import ClipComponent from "@/components/clip-component";
import CropComponent from "@/components/crop-component";
import ToggleShowButton from "@/components/toggle-show-button";

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
      const error = `Error running ffmpeg: ${err}`;
      dispatch({ type: "setError", payload: error });
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-[#0e0e0e] pt-6 text-white gap-2">
      <FileInput state={state} dispatch={dispatch} />
      <OutputDisplay state={state} dispatch={dispatch} />
      <ErrorDisplay state={state} dispatch={dispatch} />
      <div className="flex w-full flex-col items-center gap-4">
        <FFmpegParamsInput state={state} dispatch={dispatch} />
        <OutputnameInput state={state} dispatch={dispatch} />
      </div>
      <div className="flex w-[32rem] flex-col items-center gap-4 py-4 px-2 rounded-md border-2">
        <ToggleShowButton
          dispatch={dispatch}
          text={
            state.showClipInputs ? "Switch to crop view" : "Switch to clip view"
          }
        />
        <ClipComponent state={state} dispatch={dispatch} />
        <CropComponent state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

export default App;
