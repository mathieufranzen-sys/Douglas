import { FileIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArtifactCard({
  title,
  size,
  onDownload,
}: {
  title: string;
  size: string;
  onDownload?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FileIcon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{size}</span>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onDownload}>
        <Download className="size-4" strokeWidth={1.75} />
      </Button>
    </div>
  );
}
