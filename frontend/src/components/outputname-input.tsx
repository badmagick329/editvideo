import { Input } from "./ui/input";

export default function OutputnameInput({
  outputFilename,
  setOutputFilename,
  defaultOutputFilename,
  fileExists,
}: {
  outputFilename: string;
  setOutputFilename: (outputFilename: string) => void;
  defaultOutputFilename: () => string;
  fileExists: boolean;
}) {
  const showComponent = !outputFilename.trim() && defaultOutputFilename();
  const style = showComponent
    ? "flex w-full gap-2 border-2 rounded-md p-2"
    : "";
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <div className={style}>
        <span className="font-black">
          {showComponent && "Default output filename:"}
        </span>
        <span>{showComponent ? `${defaultOutputFilename()}` : ""}</span>
      </div>
      <Input
        value={outputFilename}
        onChange={(e) => setOutputFilename(e.target.value)}
        className="w-full max-w-lg"
        disabled={!fileExists}
        placeholder="Output filename"
      />
    </div>
  );
}
