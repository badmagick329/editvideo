import { State, Action } from "@/types";
import {
  CreateClip,
  DefaultParams,
  SetParams,
  GetVideoInfo,
} from "@/../wailsjs/go/ffmpeg/FFmpeg";

export function reducerCallback(state: State, action: Action) {
  switch (action.type) {
    case "setFilename":
      return { ...state, filename: action.payload };
    case "setOutput":
      return { ...state, output: action.payload };
    case "setWidth":
      return { ...state, width: action.payload };
    case "setHeight":
      return { ...state, height: action.payload };
    case "setDuration":
      return { ...state, duration: action.payload };
    case "setOutputFilename":
      return { ...state, outputFilename: action.payload };
    case "setFFmpegParams":
      return { ...state, ffmpegParams: action.payload };
    case "setFileExists":
      return { ...state, fileExists: action.payload };
    case "setClipStart":
      return { ...state, clipStart: action.payload };
    case "setClipEnd":
      return { ...state, clipEnd: action.payload };
    case "setFFmpegRunning":
      return { ...state, ffmpegRunning: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    case "fileDoesNotExist":
      return {
        ...state,
        fileExists: false,
        output: "",
        ffmpegParams: "",
        clipStart: "",
        clipEnd: "",
        outputFilename: "",
      };
    case "setVideoInfo":
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        duration: action.payload.duration,
        ffmpegParams: action.payload.ffmpegParams,
      };
    case "setVideoInfoDisplay":
      return {
        ...state,
        output: `Width: ${state.width}. Height: ${state.height}. Duration: ${state.duration}s`,
        clipStart: action.payload.clipStart,
        clipEnd: action.payload.clipEnd,
      };
    default:
      return state;
  }
}

export const defaultState: State = {
  filename: "",
  output: "Output will be displayed here",
  width: 0,
  height: 0,
  duration: "",
  outputFilename: "",
  ffmpegParams: "",
  fileExists: false,
  clipStart: "",
  clipEnd: "",
  ffmpegRunning: false,
  error: "",
};

export async function setVideoInfo(
  filename: string,
  dispatch: React.Dispatch<Action>,
) {
  const [newWidth, newHeight, newDuration] = await GetVideoInfo(filename);
  const defaultParams = await DefaultParams();
  const width = parseInt(newWidth) || 0;
  const height = parseInt(newHeight) || 0;
  const ffmpegParams = defaultParams.join(" ");
  dispatch({
    type: "setVideoInfo",
    payload: { width, height, duration: newDuration, ffmpegParams },
  });
}

export function defaultOutputFilename(filename: string, fileExists: boolean) {
  if (!fileExists) return "";
  let splitName = filename.split(".");
  let outputFilename = "";
  for (let i = 0; i < splitName.length - 1; i++) {
    outputFilename += splitName[i];
  }
  outputFilename += "_out.mp4";
  return outputFilename;
}

export async function createClip(state: State) {
  const out =
    state.outputFilename ||
    defaultOutputFilename(state.filename, state.fileExists);
  SetParams(state.ffmpegParams);
  await CreateClip(state.filename, out, state.clipStart, state.clipEnd);
}
