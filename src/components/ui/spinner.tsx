import { Loader2 } from "lucide-react";

type OverlaySpinnerProps = {
  show: boolean;
  label?: string;
};

export function OverlaySpinner({ show, label = "Loading..." }: OverlaySpinnerProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-4 shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
