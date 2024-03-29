import { Action } from "@/types";
import { Button } from "@/components/ui/button";

export default function ToggleShowButton({
  dispatch,
  text,
}: {
  dispatch: React.Dispatch<Action>;
  text: string;
}) {
  return (
    <Button
      size="lg"
      onClick={() => {
        dispatch({
          type: "toggleShowInputs",
          payload: null,
        });
      }}
    >
      {text}
    </Button>
  );
}
