import { Input } from "./components/ui/input";
import FileInput from "./components/file-input";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { GetDimensions } from "@/../wailsjs/go/main/App";

function App() {
  const [filename, setFilename] = useState<string>("");
  const [output, setOutput] = useState<string>("Output will be displayed here");
  const [fileExists, setFileExists] = useState<boolean>(false);
  const [clipStart, setClipStart] = useState<string>("");
  const [clipEnd, setClipEnd] = useState<string>("");

  useEffect(() => {
    if (!fileExists) {
      setOutput("");
      return;
    }
    console.log("fileExists", fileExists);
    (async () => {
      const res = await GetDimensions(filename);
      setOutput(res);
    })();
  }, [fileExists]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0e0e0e] text-white gap-4">
      <FileInput
        filename={filename}
        setFilename={setFilename}
        fileExists={fileExists}
        setFileExists={setFileExists}
      />
      <span>{output}</span>
      <div className="flex justify-center gap-4 w-full max-w-lg items-center">
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
