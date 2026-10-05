import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export interface LoaderProps {
  className?: string;
  message?: string;
  fullScreen?: boolean;
}

export function Loader({
  className,
  message = "Loading…",
  fullScreen = false,
}: LoaderProps) {
  const content = (
    <div className={cn("flex flex-col items-center gap-3 py-12", className)}>
      <Spinner size="lg" label={message} />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] flex-1 items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
