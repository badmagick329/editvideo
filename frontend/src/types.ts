export type State = {
  filename: string;
  output: string;
  width: number;
  height: number;
  duration: string;
  outputFilename: string;
  ffmpegParams: string;
  fileExists: boolean;
  clipStart: string;
  clipEnd: string;
  ffmpegRunning: boolean;
  error: string;
  showClipInputs: boolean;
  showCropInputs: boolean;
  cropX: number | null;
  cropY: number | null;
  cropWidth: number | null;
  cropHeight: number | null;
  cropClipStart: string;
  cropClipEnd: string;
};

export type Action = {
  type: ActionType;
  payload: any;
};

const actions = [
  "setFilename",
  "setOutput",
  "setWidth",
  "setHeight",
  "setDuration",
  "setOutputFilename",
  "setFFmpegParams",
  "setFileExists",
  "setClipStart",
  "setClipEnd",
  "setFFmpegRunning",
  "setError",
  "toggleShowInputs",
  "setCropX",
  "setCropY",
  "setCropWidth",
  "setCropHeight",
  "fileDoesNotExist",
  "setVideoInfo",
  "setCropClipStart",
  "setCropClipEnd",
];

export type ActionType = (typeof actions)[number];
