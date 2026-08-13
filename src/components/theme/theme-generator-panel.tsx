"use client";

import * as React from "react";
import { Sun, Moon, RotateCcw, FileCode2, Shuffle, Contrast, Hand } from "lucide-react";

import { cn } from "@/lib/utils";
import { toHex, hexToOklch } from "@/lib/color";
import { useThemeCustomizer } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * The Theme Generator, laid out as the sidebar and top bar the Figma frame reserves as
 * grey blocks. It drives the existing ThemeCustomizerProvider — nothing here owns theme
 * state of its own, so the floating ThemeCustomizerPanel and this panel stay in sync.
 *
 * Style, Icon Library, Menu Color and Menu Accent mirror components.json rather than a
 * runtime token, so they are local presentational state: shown, remembered, inert.
 */

const STYLE_OPTIONS = ["base-nova", "vega", "default", "new-york"];
const ICON_LIBRARIES = ["Lucide", "Radix", "Phosphor"];
const MENU_COLORS = ["Default / Solid", "Muted", "Transparent"];
const MENU_ACCENTS = ["Subtle", "Strong", "None"];

const FONT_OPTIONS = [
  { id: "geist", label: "Geist" },
  { id: "inter", label: "Inter" },
  { id: "serif", label: "Serif" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function OptionSelect({
  value,
  onValueChange,
  options,
  label,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onValueChange(v as string)}>
      <SelectTrigger className="h-8 w-full text-xs" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-xs">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** A single token row: swatch, editable oklch, hex readout. */
function ColorRow({
  label,
  value,
  onChange,
  onReset,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onReset?: () => void;
}) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);

  const readOnly = !onChange;
  const hex = toHex(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="font-mono text-[0.6875rem] text-muted-foreground">{hex}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <label
          className="size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border"
          style={{ background: value }}
        >
          <span className="sr-only">{`Pick ${label}`}</span>
          <input
            type="color"
            value={hex}
            disabled={readOnly}
            onChange={(e) => onChange?.(hexToOklch(e.target.value))}
            className="size-full cursor-pointer opacity-0"
          />
        </label>
        <Input
          value={draft}
          readOnly={readOnly}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onChange?.(draft)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange?.(draft);
          }}
          aria-label={`${label} value`}
          className="h-8 min-w-0 flex-1 font-mono text-xs"
        />
        {onReset && (
          <Button variant="ghost" size="icon-sm" onClick={onReset} aria-label={`Reset ${label}`}>
            <RotateCcw strokeWidth={1.75} />
          </Button>
        )}
      </div>
    </div>
  );
}

/** Shared state for the two grey zones, so the top bar and sidebar never disagree. */
function useGeneratorState() {
  const theme = useThemeCustomizer();
  const [style, setStyle] = React.useState(STYLE_OPTIONS[0]);
  const [iconLibrary, setIconLibrary] = React.useState(ICON_LIBRARIES[0]);
  const [menuColor, setMenuColor] = React.useState(MENU_COLORS[0]);
  const [menuAccent, setMenuAccent] = React.useState(MENU_ACCENTS[0]);

  const activePreset = theme.presets.find((p) => p.id === theme.presetId) ?? theme.presets[0];
  const vars = theme.mode === "light" ? activePreset.light : activePreset.dark;
  const primary = theme.primaryOverride ?? vars.primary;

  return {
    ...theme,
    activePreset,
    vars,
    primary,
    style,
    setStyle,
    iconLibrary,
    setIconLibrary,
    menuColor,
    setMenuColor,
    menuAccent,
    setMenuAccent,
  };
}

/** The 106px band across the top: mode, base colour, radius, plus whatever the page adds. */
export function ThemeGeneratorTopBar({
  children,
  className,
}: {
  /** Trailing slot — the host page drops its navigation in here. */
  children?: React.ReactNode;
  className?: string;
}) {
  const { mode, setMode, presets, presetId, setPresetId, radius, setRadius } =
    useGeneratorState();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3 border-b bg-card px-6 py-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Agent UX</span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
          20 components
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-lg border p-0.5">
        {(["light", "dark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              mode === m
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "light" ? (
              <Sun className="size-3.5" strokeWidth={1.75} />
            ) : (
              <Moon className="size-3.5" strokeWidth={1.75} />
            )}
            {m === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setPresetId(preset.id)}
            aria-label={preset.label}
            aria-pressed={presetId === preset.id}
            title={preset.label}
            className={cn(
              "size-6 rounded-full border transition-[outline]",
              presetId === preset.id && "outline-2 outline-offset-2 outline-primary"
            )}
            style={{
              background: mode === "light" ? preset.light.primary : preset.dark.primary,
            }}
          />
        ))}
      </div>

      <div className="flex min-w-40 flex-1 items-center gap-3">
        <Label className="shrink-0 text-xs font-medium text-muted-foreground">Radius</Label>
        <Slider
          min={0}
          max={1.5}
          step={0.125}
          value={[radius]}
          onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
          className="min-w-24 flex-1"
        />
        <span className="w-14 shrink-0 text-right font-mono text-xs text-muted-foreground">
          {radius.toFixed(3)}rem
        </span>
      </div>

      {children}
    </div>
  );
}

/** The 237px column down the left: the full generator. */
export function ThemeGeneratorSidebar({ className }: { className?: string }) {
  const g = useGeneratorState();

  return (
    <aside
      className={cn("flex w-full flex-col gap-5 border-r bg-card p-4", className)}
      aria-label="Theme generator"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Theme Generator</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            g.setPresetId("neutral");
            g.setPrimaryOverride(null);
          }}
          aria-label="Reset theme"
        >
          <RotateCcw strokeWidth={1.75} />
        </Button>
      </div>

      <Field label="Mode">
        <div className="grid grid-cols-2 gap-1.5">
          {(["light", "dark"] as const).map((m) => (
            <Button
              key={m}
              variant={g.mode === m ? "secondary" : "outline"}
              size="sm"
              onClick={() => g.setMode(m)}
              className="justify-center"
            >
              {m === "light" ? (
                <Sun data-icon="inline-start" strokeWidth={1.75} />
              ) : (
                <Moon data-icon="inline-start" strokeWidth={1.75} />
              )}
              {m === "light" ? "Light" : "Dark"}
            </Button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-3">
        <Field label="Style">
          <OptionSelect
            label="Style"
            value={g.style}
            onValueChange={g.setStyle}
            options={STYLE_OPTIONS}
          />
        </Field>
        <Field label="Icon Library">
          <OptionSelect
            label="Icon Library"
            value={g.iconLibrary}
            onValueChange={g.setIconLibrary}
            options={ICON_LIBRARIES}
          />
        </Field>
        <Field label="Base Color">
          <Select value={g.presetId} onValueChange={(v) => v && g.setPresetId(v as string)}>
            <SelectTrigger className="h-8 w-full text-xs" aria-label="Base Color">
              {/* The value is the preset id, so map it back to the human label. */}
              <SelectValue>
                {(value: string | null) =>
                  g.presets.find((preset) => preset.id === value)?.label ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {g.presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id} className="text-xs">
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Menu Color">
          <OptionSelect
            label="Menu Color"
            value={g.menuColor}
            onValueChange={g.setMenuColor}
            options={MENU_COLORS}
          />
        </Field>
        <Field label="Menu Accent">
          <OptionSelect
            label="Menu Accent"
            value={g.menuAccent}
            onValueChange={g.setMenuAccent}
            options={MENU_ACCENTS}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Presets</Label>
        <div className="grid grid-cols-3 gap-1.5">
          <Button variant="outline" size="xs" disabled>
            <FileCode2 data-icon="inline-start" strokeWidth={1.75} />
            Import
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              const pick = g.presets[Math.floor(Math.random() * g.presets.length)];
              g.setPresetId(pick.id);
            }}
          >
            <Shuffle data-icon="inline-start" strokeWidth={1.75} />
            Random
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => g.setMode(g.mode === "light" ? "dark" : "light")}
          >
            <Contrast data-icon="inline-start" strokeWidth={1.75} />
            Contrast
          </Button>
        </div>
        <Button variant="outline" size="sm" disabled className="w-full justify-center">
          <Hand data-icon="inline-start" strokeWidth={1.75} />
          Hold to save theme
        </Button>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="w-full">
          <TabsTrigger value="colors" className="flex-1 text-xs">
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex-1 text-xs">
            Typography
          </TabsTrigger>
          <TabsTrigger value="other" className="flex-1 text-xs">
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="flex flex-col gap-4 pt-4">
          <span className="text-xs font-semibold">Brand Colors</span>
          <ColorRow
            label="Primary"
            value={g.primary}
            onChange={(value) => g.setPrimaryOverride(value)}
            onReset={g.primaryOverride ? () => g.setPrimaryOverride(null) : undefined}
          />
          <ColorRow label="Primary Foreground" value={g.vars.primaryForeground} />
          <span className="text-xs font-semibold">Base Colors</span>
          <ColorRow label="Background" value={g.vars.background} />
          <ColorRow label="Foreground" value={g.vars.foreground} />
          <ColorRow label="Muted" value={g.vars.muted} />
          <ColorRow label="Border" value={g.vars.border} />
          <ColorRow label="Destructive" value={g.vars.destructive} />
        </TabsContent>

        <TabsContent value="typography" className="flex flex-col gap-3 pt-4">
          <Field label="Font family">
            <Select value={g.font} onValueChange={(v) => v && g.setFont(v as string)}>
              <SelectTrigger className="h-8 w-full text-xs" aria-label="Font family">
                <SelectValue>
                  {(value: string | null) =>
                    FONT_OPTIONS.find((f) => f.id === value)?.label ?? value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </TabsContent>

        <TabsContent value="other" className="flex flex-col gap-3 pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Radius</Label>
              <span className="font-mono text-xs text-muted-foreground">
                {g.radius.toFixed(3)}rem
              </span>
            </div>
            <Slider
              min={0}
              max={1.5}
              step={0.125}
              value={[g.radius]}
              onValueChange={(v) => g.setRadius(Array.isArray(v) ? v[0] : v)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
