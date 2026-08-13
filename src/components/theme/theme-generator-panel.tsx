"use client";

import * as React from "react";
import { Sun, Moon, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { toHex, hexToOklch } from "@/lib/color";
import { useThemeCustomizer } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * The theme panel that fills the sidebar the Figma frame reserves as a grey block.
 * It drives the existing ThemeCustomizerProvider and owns no theme state of its own,
 * so anything else reading the context stays in sync.
 */

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

export function ThemeGeneratorSidebar({ className }: { className?: string }) {
  const {
    presets,
    presetId,
    setPresetId,
    mode,
    setMode,
    radius,
    setRadius,
    font,
    setFont,
    primaryOverride,
    setPrimaryOverride,
  } = useThemeCustomizer();

  const activePreset = presets.find((p) => p.id === presetId) ?? presets[0];
  const vars = mode === "light" ? activePreset.light : activePreset.dark;
  const primary = primaryOverride ?? vars.primary;

  return (
    <aside
      className={cn("flex w-full flex-col gap-5 border-r bg-card p-4", className)}
      aria-label="Theme"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Theme</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setPresetId(presets[0].id);
            setMode("dark");
            setPrimaryOverride(null);
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
              variant={mode === m ? "secondary" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
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

      <Field label="Base Color">
        <div className="flex flex-col gap-2">
          <Select value={presetId} onValueChange={(v) => v && setPresetId(v as string)}>
            <SelectTrigger className="h-8 w-full text-xs" aria-label="Base Color">
              {/* The value is the preset id, so map it back to the human label. */}
              <SelectValue>
                {(value: string | null) =>
                  presets.find((preset) => preset.id === value)?.label ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id} className="text-xs">
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetId(preset.id)}
                aria-label={preset.label}
                aria-pressed={presetId === preset.id}
                title={preset.label}
                className={cn(
                  "size-6 rounded-full border",
                  presetId === preset.id && "outline-2 outline-offset-2 outline-primary"
                )}
                style={{
                  background: mode === "light" ? preset.light.primary : preset.dark.primary,
                }}
              />
            ))}
          </div>
        </div>
      </Field>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Radius</Label>
          <span className="font-mono text-xs text-muted-foreground">
            {radius.toFixed(3)}rem
          </span>
        </div>
        <Slider
          min={0}
          max={1.5}
          step={0.125}
          value={[radius]}
          onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
        />
      </div>

      <Field label="Font">
        <Select value={font} onValueChange={(v) => v && setFont(v as string)}>
          <SelectTrigger className="h-8 w-full text-xs" aria-label="Font">
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

      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold">Brand Colors</span>
        <ColorRow
          label="Primary"
          value={primary}
          onChange={(value) => setPrimaryOverride(value)}
          onReset={primaryOverride ? () => setPrimaryOverride(null) : undefined}
        />
        <ColorRow label="Primary Foreground" value={vars.primaryForeground} />
        <span className="text-xs font-semibold">Base Colors</span>
        <ColorRow label="Background" value={vars.background} />
        <ColorRow label="Foreground" value={vars.foreground} />
        <ColorRow label="Muted" value={vars.muted} />
        <ColorRow label="Border" value={vars.border} />
        <ColorRow label="Destructive" value={vars.destructive} />
      </div>
    </aside>
  );
}
