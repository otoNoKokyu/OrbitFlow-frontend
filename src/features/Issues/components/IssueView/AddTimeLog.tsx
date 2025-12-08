import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TimeLogEditorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (estimate: number, logged: number) => void;
  defaultEstimate?: number;
  defaultLogged?: number;
}

export default function TimeLogEditor({
  open,
  onClose,
  onSubmit,
  defaultEstimate = 0,
  defaultLogged = 0
}: TimeLogEditorProps) {
  const [estimate, setEstimate] = useState(defaultEstimate);
  const [logged, setLogged] = useState(defaultLogged);

  const handleSubmit = () => {
    onSubmit(estimate, logged);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Time Log</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Estimate (hours)</label>
            <Input
              type="number"
              value={estimate}
              onChange={(e) => setEstimate(Number(e.target.value))}
              placeholder="Enter estimate"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Logged Time (hours)</label>
            <Input
              type="number"
              value={logged}
              onChange={(e) => setLogged(Number(e.target.value))}
              placeholder="Enter logged time"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
