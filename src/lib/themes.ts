// Five curated themes for presenting the Douglas design system, the way tweakcn ships a
// handful of built-in themes rather than a raw shadcn base-colour list. Each keeps the
// same neutral foundation (background/card/muted/border…) and swaps only the brand
// accent, so every component reads consistently no matter which one is active.
// The "Primary override" control in the sidebar layers a custom accent on top of
// whichever preset is active, without touching any of its other tokens.

export type ThemeVars = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
  border: string;
  input: string;
  ring: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  /** A theme is a whole look: accent colour, light-or-dark, typeface and radius. */
  mode: "light" | "dark";
  radius: number; // rem
  font: string;
  light: ThemeVars;
  dark: ThemeVars;
};

export const FONT_STACKS: Record<string, string> = {
  geist: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  serif: "'Georgia', 'Iowan Old Style', serif",
};

const DEFAULT_RADIUS = 0.625;

// Shared across every preset: a warning/info pair should read as "caution" or
// "informational" regardless of which brand accent is active.
const SEMANTIC_LIGHT = {
  warning: "oklch(0.554 0.135 66.442)", warningForeground: "oklch(0.985 0 0)",
  info: "oklch(0.546 0.245 262.881)", infoForeground: "oklch(0.985 0 0)",
};
const SEMANTIC_DARK = {
  warning: "oklch(0.769 0.146 70.08)", warningForeground: "oklch(0.216 0.006 56.043)",
  info: "oklch(0.707 0.165 254.624)", infoForeground: "oklch(0.216 0.006 56.043)",
};

// The neutral foundation every preset below builds on — only `primary`/`ring` differ.
const NEUTRAL_LIGHT = {
  background: "oklch(1 0 0)", foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)", cardForeground: "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)", popoverForeground: "oklch(0.145 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)", secondaryForeground: "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)", mutedForeground: "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)", accentForeground: "oklch(0.205 0 0)",
  destructive: "oklch(0.577 0.245 27.325)", destructiveForeground: "oklch(0.985 0 0)",
  border: "oklch(0.922 0 0)", input: "oklch(0.922 0 0)",
  ...SEMANTIC_LIGHT,
};
const NEUTRAL_DARK = {
  background: "oklch(0.145 0 0)", foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)", cardForeground: "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)", popoverForeground: "oklch(0.985 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  secondary: "oklch(0.269 0 0)", secondaryForeground: "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)", mutedForeground: "oklch(0.708 0 0)",
  accent: "oklch(0.269 0 0)", accentForeground: "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)", destructiveForeground: "oklch(0.985 0 0)",
  border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)",
  ...SEMANTIC_DARK,
};

function preset(
  id: string,
  label: string,
  primary: string,
  look: { mode: "light" | "dark"; font: string; radius: number }
): ThemePreset {
  return {
    id,
    label,
    mode: look.mode,
    radius: look.radius,
    font: look.font,
    light: { ...NEUTRAL_LIGHT, primary, ring: primary },
    dark: { ...NEUTRAL_DARK, primary, ring: primary },
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // Douglas's own identity, #493CEF. First in the list, so it is what the app boots on.
  preset("douglas", "Douglas", "oklch(0.503 0.253 275.5)", {
    mode: "dark",
    font: "geist",
    radius: DEFAULT_RADIUS,
  }),
  preset("ember", "Ember", "oklch(0.646 0.194 41.12)", {
    mode: "light",
    font: "serif",
    radius: 0.25,
  }),
  preset("meadow", "Meadow", "oklch(0.627 0.17 149.21)", {
    mode: "light",
    font: "inter",
    radius: 1,
  }),
  preset("azure", "Azure", "oklch(0.546 0.215 262.88)", {
    mode: "dark",
    font: "inter",
    radius: 0.375,
  }),
  preset("plum", "Plum", "oklch(0.558 0.252 302.32)", {
    mode: "dark",
    font: "serif",
    radius: 1.25,
  }),
];

export const VAR_KEY_MAP: Record<keyof ThemeVars, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  warning: "--warning",
  warningForeground: "--warning-foreground",
  info: "--info",
  infoForeground: "--info-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
};

/** Color rows grouped the way the sidebar's accordion presents them. */
export const COLOR_GROUPS: { label: string; keys: (keyof ThemeVars)[] }[] = [
  { label: "Primary", keys: ["primary", "primaryForeground"] },
  { label: "Secondary", keys: ["secondary", "secondaryForeground"] },
  { label: "Accent", keys: ["accent", "accentForeground"] },
  { label: "Base", keys: ["background", "foreground"] },
  { label: "Card", keys: ["card", "cardForeground"] },
  { label: "Popover", keys: ["popover", "popoverForeground"] },
  { label: "Muted", keys: ["muted", "mutedForeground"] },
  { label: "Destructive", keys: ["destructive", "destructiveForeground"] },
  { label: "Warning", keys: ["warning", "warningForeground"] },
  { label: "Info", keys: ["info", "infoForeground"] },
  { label: "Border & Input", keys: ["border", "input", "ring"] },
];
