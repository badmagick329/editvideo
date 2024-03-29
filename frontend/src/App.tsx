import { Input } from "./components/ui/input";
import FileInput from "./components/file-input";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { GetVideoInfo } from "@/../wailsjs/go/main/App";
import {
  SetParams,
  DefaultParams,
  CreateClip,
} from "@/../wailsjs/go/ffmpeg/FFmpeg";
import OutputnameInput from "./components/outputname-input";

function App() {
  const [filename, setFilename] = useState<string>("");
  const [output, setOutput] = useState<string>("Output will be displayed here");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [duration, setDuration] = useState<string>("");
  const [outputFilename, setOutputFilename] = useState<string>("");
  const [ffmpegParams, setFfmpegParams] = useState<string>("");
  const [fileExists, setFileExists] = useState<boolean>(false);
  const [clipStart, setClipStart] = useState<string>("");
  const [clipEnd, setClipEnd] = useState<string>("");

  function defaultOutputFilename() {
    if (!fileExists) return "";
    let splitName = filename.split(".");
    let outputFilename = "";
    for (let i = 0; i < splitName.length - 1; i++) {
      outputFilename += splitName[i];
    }
    outputFilename += "_out.mp4";
    return outputFilename;
  }

  useEffect(() => {
    if (!fileExists) return;
    console.log("width height or duration changed");
    setOutput(`Width: ${width}. Height: ${height}, Duration: ${duration}s`);
    setClipStart("0");
    setClipEnd(duration.toString());
  }, [fileExists, width, height, duration]);

  useEffect(() => {
    if (!fileExists) {
      setOutput("");
      setFfmpegParams("");
      setClipStart("");
      setClipEnd("");
      setOutputFilename("");
      return;
    }
    (async () => {
      const [newWidth, newHeight, newDuration] = await GetVideoInfo(filename);
      const defaultParams = await DefaultParams();
      console.log("width", newWidth);
      console.log("height", newHeight);
      console.log("duration", newDuration);
      setWidth(parseInt(newWidth));
      setHeight(parseInt(newHeight));
      setDuration(newDuration);
      console.log("updated width height and duration");
      setFfmpegParams(defaultParams.join(" "));
    })();
  }, [fileExists]);

  useEffect(() => {
    SetParams(ffmpegParams);
  }, [ffmpegParams]);

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-[#0e0e0e] text-white justify-center">
      <FileInput
        filename={filename}
        setFilename={setFilename}
        fileExists={fileExists}
        setFileExists={setFileExists}
      />
      <span>{output}</span>
      <div className="flex w-full flex-col items-center gap-2">
        <label>FFmpeg Params</label>
        <Input
          value={ffmpegParams}
          onChange={(e) => setFfmpegParams(e.target.value)}
          className="w-full max-w-lg"
          disabled={!fileExists}
          placeholder="FFmpeg Params"
        />
        <OutputnameInput
          outputFilename={outputFilename}
          setOutputFilename={setOutputFilename}
          defaultOutputFilename={defaultOutputFilename}
          fileExists={fileExists}
        />
      </div>
      <div className="flex w-full max-w-lg items-center justify-center gap-4">
        <Input
          placeholder="Clip start time"
          value={clipStart}
          onChange={(e) => setClipStart(e.target.value)}
          disabled={!fileExists}
        />
        <Input
          placeholder="Clip end time"
          value={clipEnd}
          onChange={(e) => setClipEnd(e.target.value)}
          disabled={!fileExists}
        />
        <Button
          onClick={async () => {
            console.log("clip start", clipStart);
            console.log("clip end", clipEnd);
            console.log("filename", filename);
            const out = outputFilename || defaultOutputFilename();
            console.log("outputFilename", out);
            await CreateClip(filename, out, clipStart, clipEnd);
            // const res = await ClipVideo(filename, clipStart, clipEnd);
            // setOutput(res);
          }}
          disabled={!fileExists}
        >
          Clip
        </Button>
      </div>
    </div>
  );
}

export default App;
