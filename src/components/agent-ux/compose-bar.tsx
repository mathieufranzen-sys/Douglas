"use client";

import { Plus, Paperclip, Mic, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ComposeBar({
  placeholder = "Type a message…",
}: {
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border bg-card p-3">
      <textarea
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm">
            <Plus className="size-4" strokeWidth={1.75} />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Paperclip className="size-4" strokeWidth={1.75} />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Mic className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="manual">
            <SelectTrigger className="h-8 w-auto gap-1 border-none px-2 text-xs shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manually approve</SelectItem>
              <SelectItem value="auto-safe">Act on safe changes</SelectItem>
              <SelectItem value="auto">Act autonomously</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="fable-5">
            <SelectTrigger className="h-8 w-auto gap-1 border-none px-2 text-xs shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fable-5">Fable 5 · Medium</SelectItem>
              <SelectItem value="fable-5-fast">Fable 5 · Fast</SelectItem>
              <SelectItem value="fable-5-pro">Fable 5 · Pro</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" className="size-8 rounded-full">
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
}
