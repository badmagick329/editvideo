import { Input } from "./ui/input";
import { FileExists } from "@/../wailsjs/go/main/App";
import { useEffect } from "react";

export default function FileInput({
  filename,
  setFilename,
  fileExists,
  setFileExists,
}: {
  filename: string;
  setFilename: (filename: string) => void;
  fileExists: boolean;
  setFileExists: (fileExists: boolean) => void;
}) {
  useEffect(() => {
    (async () => {
      const res = await FileExists(filename);
      setFileExists(res);
    })();
  }, [filename]);

  return (
    <div className="flex pt-6 gap-4 items-center w-full max-w-lg">
      <Input
        placeholder="Enter video filepath"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="w-2/3"
      />
      <span className="w-1/3 text-lg">{fileExists ? "File found ✅" : ""}</span>
    </div>
  );
}
