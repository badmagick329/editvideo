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
  "fileDoesNotExist",
  "setVideoInfo",
];

export type ActionType = (typeof actions)[number];
