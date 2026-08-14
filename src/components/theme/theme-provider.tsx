"use client";

import * as React from "react";
import { THEME_PRESETS, FONT_STACKS, VAR_KEY_MAP, type ThemePreset } from "@/lib/themes";

type Mode = "light" | "dark";

type ThemeState = {
  presetId: string;
  mode: Mode;
  radius: number;
  font: string;
  primaryOverride: string | null;
};

type ThemeContextValue = ThemeState & {
  presets: ThemePreset[];
  setPresetId: (id: string) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setRadius: (radius: number) => void;
  setFont: (font: string) => void;
  setPrimaryOverride: (color: string | null) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function applyTheme(state: ThemeState) {
  if (typeof document === "undefined") return;
  const preset = THEME_PRESETS.find((p) => p.id === state.presetId) ?? THEME_PRESETS[0];
  const vars = state.mode === "light" ? preset.light : preset.dark;
  const root = document.documentElement;

  (Object.keys(vars) as (keyof typeof vars)[]).forEach((key) => {
    root.style.setProperty(VAR_KEY_MAP[key], vars[key]);
  });

  if (state.primaryOverride) {
    root.style.setProperty("--primary", state.primaryOverride);
    root.style.setProperty("--ring", state.primaryOverride);
  }

  root.style.setProperty("--radius", `${state.radius}rem`);
  root.style.setProperty("--font-sans", FONT_STACKS[state.font] ?? FONT_STACKS.geist);

  root.classList.toggle("dark", state.mode === "dark");
}

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  // Douglas boots dark, on its own preset — THEME_PRESETS[0], primary #493CEF.
  const [state, setState] = React.useState<ThemeState>({
    presetId: THEME_PRESETS[0].id,
    mode: "dark",
    radius: THEME_PRESETS[0].radius,
    font: THEME_PRESETS[0].font,
    primaryOverride: null,
  });

  React.useEffect(() => {
    applyTheme(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const setPresetId = React.useCallback((id: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setState((s) => ({
      ...s,
      presetId: id,
      // A theme carries its whole look, light-or-dark included.
      mode: preset.mode,
      radius: preset.radius,
      font: preset.font,
      primaryOverride: null,
    }));
  }, []);

  const value: ThemeContextValue = {
    ...state,
    presets: THEME_PRESETS,
    setPresetId,
    setMode: (mode) => setState((s) => ({ ...s, mode })),
    toggleMode: () => setState((s) => ({ ...s, mode: s.mode === "light" ? "dark" : "light" })),
    setRadius: (radius) => setState((s) => ({ ...s, radius })),
    setFont: (font) => setState((s) => ({ ...s, font })),
    setPrimaryOverride: (color) => setState((s) => ({ ...s, primaryOverride: color })),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeCustomizer() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeCustomizer must be used within ThemeCustomizerProvider");
  return ctx;
}
