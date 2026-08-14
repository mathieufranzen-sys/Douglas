"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { toHex, hexToOklch } from "@/lib/color";
import { COLOR_GROUPS, type ThemeVars } from "@/lib/themes";
import { useThemeCustomizer } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Douglas's chrome, split the way tweakcn.com/editor/theme splits its own: a title
 * banner, a full-width utility bar, and a sidebar that edits theme tokens. All three
 * read from useThemeCustomizer() and never touch theme-provider.tsx's state contract —
 * they only drive it.
 */

const FIGMA_URL =
  "https://www.figma.com/design/y2p1cRz0jVS0gHCI5dPavR/Untitled?node-id=291-127590";
const PORTFOLIO_URL = "#";

const SCREENS = [
  { href: "/", label: "Prompt Input" },
  { href: "/inbox", label: "Inbox Agent" },
  { href: "/build", label: "Build Conversation" },
];

const FONT_OPTIONS = [
  { id: "geist", label: "Geist" },
  { id: "inter", label: "Inter" },
  { id: "serif", label: "Serif" },
];

/** background/foreground pairs read as "Background"/"Foreground"; border-and-input keys keep their own name. */
function labelForKey(key: keyof ThemeVars): string {
  if (key === "border") return "Border";
  if (key === "input") return "Input";
  if (key === "ring") return "Ring";
  return key.endsWith("Foreground") ? "Foreground" : "Background";
}

export function DouglasTitleBar({ className }: { className?: string }) {
  return (
    <header className={cn("flex h-16 items-center justify-between border-b bg-background px-4", className)}>
      <div className="flex items-baseline gap-2.5">
        <span className="text-sm font-semibold tracking-tight">Douglas</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          The design system for agent interfaces.
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<a href={FIGMA_URL} target="_blank" rel="noreferrer" />}
        >
          Figma
          <ExternalLink data-icon="inline-end" strokeWidth={1.75} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" />}
        >
          Portfolio
          <ExternalLink data-icon="inline-end" strokeWidth={1.75} />
        </Button>
      </div>
    </header>
  );
}

export function DouglasUtilityBar({ className }: { className?: string }) {
  const { mode, setMode, presetId, setPresetId } = useThemeCustomizer();

  return (
    <div className={cn("relative flex h-14 w-full flex-row items-center justify-end gap-4 border-b bg-background px-4", className)}>
      <nav className="flex items-center gap-1">
        {SCREENS.map((screen) => (
          <Link
            key={screen.href}
            href={screen.href}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {screen.label}
          </Link>
        ))}
      </nav>

      <div className="h-5 w-px bg-border" aria-hidden />

      <div className="flex items-center gap-2">
        <Switch
          size="sm"
          checked={mode === "dark"}
          onCheckedChange={(checked) => setMode(checked ? "dark" : "light")}
          aria-label="Dark mode"
        />
        <span className="text-xs text-muted-foreground">{mode === "dark" ? "Dark" : "Light"}</span>
      </div>

      <Button variant="outline" size="sm" onClick={() => setPresetId(presetId)}>
        <RotateCcw data-icon="inline-start" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}

/** A single token row: swatch, editable oklch, hex readout. */
function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);

  const hex = toHex(value);

  return (
    <div className="flex items-center gap-2 py-1">
      <label className="size-6 shrink-0 cursor-pointer overflow-hidden rounded-md border" style={{ background: value }}>
        <span className="sr-only">{`Pick ${label}`}</span>
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(hexToOklch(e.target.value))}
          className="size-full cursor-pointer opacity-0"
        />
      </label>
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onChange(draft)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onChange(draft);
        }}
        aria-label={`${label} value`}
        className="h-7 min-w-0 flex-1 font-mono text-[0.6875rem]"
      />
    </div>
  );
}

export function ThemeGeneratorSidebar({ className }: { className?: string }) {
  const {
    presets,
    presetId,
    setPresetId,
    mode,
    radius,
    setRadius,
    font,
    setFont,
    primaryOverride,
    setPrimaryOverride,
  } = useThemeCustomizer();

  const activePreset = presets.find((p) => p.id === presetId) ?? presets[0];
  const vars = mode === "light" ? activePreset.light : activePreset.dark;

  const valueFor = (key: keyof ThemeVars) => (key === "primary" ? primaryOverride ?? vars[key] : vars[key]);
  const setValueFor = (key: keyof ThemeVars) => (value: string) => {
    if (key === "primary") setPrimaryOverride(value);
    // Other tokens aren't independently overridable — Primary is the one brand knob.
  };

  return (
    <aside
      className={cn("flex w-full flex-col gap-4 border-r bg-background p-3", className)}
      aria-label="Theme"
    >
      <Select value={presetId} onValueChange={(v) => v && setPresetId(v as string)}>
        <SelectTrigger className="h-8 w-full text-xs" aria-label="Theme">
          <SelectValue>{(value: string | null) => presets.find((p) => p.id === value)?.label ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {presets.map((p) => (
            <SelectItem key={p.id} value={p.id} className="text-xs">
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tabs defaultValue="colors" className="flex-1 overflow-hidden">
        <TabsList className="w-full">
          <TabsTrigger value="colors">Color</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="radius">Radius</TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="overflow-y-auto">
          <ColorGroups valueFor={valueFor} setValueFor={setValueFor} />
        </TabsContent>
        <TabsContent value="typography">
          <FontField font={font} setFont={setFont} />
        </TabsContent>
        <TabsContent value="radius">
          <RadiusField radius={radius} setRadius={setRadius} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function ColorGroups({
  valueFor,
  setValueFor,
}: {
  valueFor: (key: keyof ThemeVars) => string;
  setValueFor: (key: keyof ThemeVars) => (value: string) => void;
}) {
  return (
    <Accordion defaultValue={["Primary", "Secondary"]} multiple>
      {COLOR_GROUPS.map((group) => (
        <AccordionItem key={group.label} value={group.label}>
          <AccordionTrigger className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.label}
          </AccordionTrigger>
          <AccordionContent>
            {group.keys.map((key) => (
              <ColorRow key={key} label={labelForKey(key)} value={valueFor(key)} onChange={setValueFor(key)} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function FontField({ font, setFont }: { font: string; setFont: (font: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Font</Label>
      <Select value={font} onValueChange={(v) => v && setFont(v as string)}>
        <SelectTrigger className="h-8 w-full text-xs" aria-label="Font">
          <SelectValue>{(value: string | null) => FONT_OPTIONS.find((f) => f.id === value)?.label ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((f) => (
            <SelectItem key={f.id} value={f.id} className="text-xs">
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function RadiusField({ radius, setRadius }: { radius: number; setRadius: (radius: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-xs font-medium text-muted-foreground">Radius</Label>
        <span className="font-mono text-xs text-muted-foreground">{radius.toFixed(3)}rem</span>
      </div>
      <Slider min={0} max={1.5} step={0.125} value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} />
    </div>
  );
}
