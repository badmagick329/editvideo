import { Action, State } from "@/types";
import InputWithLabel from "@/components/input-with-label";

export default function FFmpegParamsInput({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <InputWithLabel
      label="FFmpeg Params"
      value={state.ffmpegParams}
      onChange={(e) => {
        dispatch({ type: "setFFmpegParams", payload: e.target.value });
      }}
      disabled={!state.fileExists}
      placeholder="FFmpeg Params"
      type="text"
    />
  );
}
