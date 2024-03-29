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
      variant="outline"
      className="bg-[#2d2d2d] text-white hover:bg-[#1a1a1a] hover:text-white"
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
