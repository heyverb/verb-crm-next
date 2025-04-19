import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InputFile({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}>
      <Input id="picture" type="file" {...props} />
    </div>
  );
}
