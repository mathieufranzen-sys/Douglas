"use client";

import * as React from "react";
import { useThemeCustomizer } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Palette } from "lucide-react";

const FONT_OPTIONS = [
  { id: "geist", label: "Geist" },
  { id: "inter", label: "Inter" },
  { id: "serif", label: "Serif" },
];

export function ThemeCustomizerPanel() {
  const {
    presets,
    presetId,
    setPresetId,
    mode,
    toggleMode,
    radius,
    setRadius,
    font,
    setFont,
    primaryOverride,
    setPrimaryOverride,
  } = useThemeCustomizer();

  const activePreset = presets.find((p) => p.id === presetId) ?? presets[0];
  const currentPrimary =
    primaryOverride ?? (mode === "light" ? activePreset.light.primary : activePreset.dark.primary);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="default"
            size="lg"
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg gap-2"
          />
        }
      >
        <Palette className="size-4" />
        Theme
      </SheetTrigger>
      <SheetContent side="right" className="w-[340px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Theme customizer</SheetTitle>
          <SheetDescription>
            Swap brand identity live — the components don&apos;t change, only the tokens do.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Mode</Label>
            <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2">
              {mode === "light" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {mode === "light" ? "Light" : "Dark"}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Preset</Label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-md border p-2 text-xs transition-colors ${
                    presetId === p.id ? "border-primary ring-1 ring-primary" : "border-border"
                  }`}
                >
                  <span
                    className="size-6 rounded-full border"
                    style={{ background: mode === "light" ? p.light.primary : p.dark.primary }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Primary color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={toHexSafe(currentPrimary)}
                onChange={(e) => setPrimaryOverride(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border bg-transparent p-1"
              />
              <span className="text-xs text-muted-foreground">
                {primaryOverride ? "Custom override" : "From preset"}
              </span>
              {primaryOverride && (
                <Button variant="ghost" size="sm" onClick={() => setPrimaryOverride(null)}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Radius</Label>
              <span className="text-xs text-muted-foreground">{radius.toFixed(2)}rem</span>
            </div>
            <Slider
              min={0}
              max={1.5}
              step={0.125}
              value={[radius]}
              onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Font</Label>
            <Select value={font} onValueChange={(v) => v && setFont(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// oklch/hex-safe fallback for the native color input, which only accepts #rrggbb
function toHexSafe(color: string): string {
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) return color;
  return "#6366f1";
}
