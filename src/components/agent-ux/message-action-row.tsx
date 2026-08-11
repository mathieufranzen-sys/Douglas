import { Copy, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageActionRow({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Button variant="ghost" size="icon-sm">
        <Copy className="size-3.5" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon-sm">
        <ThumbsUp className="size-3.5" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon-sm">
        <ThumbsDown className="size-3.5" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon-sm">
        <Share2 className="size-3.5" strokeWidth={1.75} />
      </Button>
      <span className="ml-1 text-xs">{timestamp}</span>
    </div>
  );
}
