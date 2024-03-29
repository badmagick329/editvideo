import { Input } from "@/components/ui/input";
import { Action, State } from "@/types";

export default function FFmpegParamsInput({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <>
      <label>FFmpeg Params</label>
      <Input
        value={state.ffmpegParams}
        onChange={(e) => {
          dispatch({ type: "setFFmpegParams", payload: e.target.value });
        }}
        className="w-full max-w-lg"
        disabled={!state.fileExists}
        placeholder="FFmpeg Params"
      />
    </>
  );
}
