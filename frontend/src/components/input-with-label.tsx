import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputWithLabel({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  placeholder: string;
  type: string;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col space-y-1 gap-1">
      <Label htmlFor={label}>{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={type}
      />
    </div>
  );
}
