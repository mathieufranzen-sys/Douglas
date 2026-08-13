// Base color values below are shadcn/ui's own official presets, fetched directly from
// https://ui.shadcn.com/r/colors/<name>.json — nothing invented here. These are the exact
// tokens the shadcn CLI writes into your project when you pick a given base color.
// The "Primary override" control in the customizer panel is the only place a custom
// accent color gets layered on top, and only when someone explicitly picks one.

export type ThemeVars = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  radius: number; // rem — shadcn's own default across every base color
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

export const THEME_PRESETS: ThemePreset[] = [
  {
    // Douglas's own identity: shadcn's neutral greys carrying the brand indigo
    // #493CEF as primary. First in the list, so it is what the app boots on.
    id: "douglas",
    label: "Douglas",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.145 0 0)",
      primary: "oklch(0.503 0.253 275.5)", primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)", secondaryForeground: "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)", mutedForeground: "oklch(0.556 0 0)",
      accent: "oklch(0.97 0 0)", accentForeground: "oklch(0.205 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.922 0 0)", input: "oklch(0.922 0 0)",
      ring: "oklch(0.503 0.253 275.5)",
    },
    dark: {
      background: "oklch(0.145 0 0)", foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)", cardForeground: "oklch(0.985 0 0)",
      primary: "oklch(0.503 0.253 275.5)", primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0 0)", secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)", mutedForeground: "oklch(0.708 0 0)",
      accent: "oklch(0.269 0 0)", accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.503 0.253 275.5)",
    },
  },
  {
    id: "neutral",
    label: "Neutral",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)", primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)", secondaryForeground: "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)", mutedForeground: "oklch(0.556 0 0)",
      accent: "oklch(0.97 0 0)", accentForeground: "oklch(0.205 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.922 0 0)", input: "oklch(0.922 0 0)", ring: "oklch(0.708 0 0)",
    },
    dark: {
      background: "oklch(0.145 0 0)", foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)", cardForeground: "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)", primaryForeground: "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)", secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)", mutedForeground: "oklch(0.708 0 0)",
      accent: "oklch(0.269 0 0)", accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.556 0 0)",
    },
  },
  {
    id: "zinc",
    label: "Zinc",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.141 0.005 285.823)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.141 0.005 285.823)",
      primary: "oklch(0.21 0.006 285.885)", primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.967 0.001 286.375)", secondaryForeground: "oklch(0.21 0.006 285.885)",
      muted: "oklch(0.967 0.001 286.375)", mutedForeground: "oklch(0.552 0.016 285.938)",
      accent: "oklch(0.967 0.001 286.375)", accentForeground: "oklch(0.21 0.006 285.885)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.92 0.004 286.32)", input: "oklch(0.92 0.004 286.32)", ring: "oklch(0.705 0.015 286.067)",
    },
    dark: {
      background: "oklch(0.141 0.005 285.823)", foreground: "oklch(0.985 0 0)",
      card: "oklch(0.21 0.006 285.885)", cardForeground: "oklch(0.985 0 0)",
      primary: "oklch(0.92 0.004 286.32)", primaryForeground: "oklch(0.21 0.006 285.885)",
      secondary: "oklch(0.274 0.006 286.033)", secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.274 0.006 286.033)", mutedForeground: "oklch(0.705 0.015 286.067)",
      accent: "oklch(0.274 0.006 286.033)", accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.552 0.016 285.938)",
    },
  },
  {
    id: "stone",
    label: "Stone",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.147 0.004 49.25)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.147 0.004 49.25)",
      primary: "oklch(0.216 0.006 56.043)", primaryForeground: "oklch(0.985 0.001 106.423)",
      secondary: "oklch(0.97 0.001 106.424)", secondaryForeground: "oklch(0.216 0.006 56.043)",
      muted: "oklch(0.97 0.001 106.424)", mutedForeground: "oklch(0.553 0.013 58.071)",
      accent: "oklch(0.97 0.001 106.424)", accentForeground: "oklch(0.216 0.006 56.043)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.923 0.003 48.717)", input: "oklch(0.923 0.003 48.717)", ring: "oklch(0.709 0.01 56.259)",
    },
    dark: {
      background: "oklch(0.147 0.004 49.25)", foreground: "oklch(0.985 0.001 106.423)",
      card: "oklch(0.216 0.006 56.043)", cardForeground: "oklch(0.985 0.001 106.423)",
      primary: "oklch(0.923 0.003 48.717)", primaryForeground: "oklch(0.216 0.006 56.043)",
      secondary: "oklch(0.268 0.007 34.298)", secondaryForeground: "oklch(0.985 0.001 106.423)",
      muted: "oklch(0.268 0.007 34.298)", mutedForeground: "oklch(0.709 0.01 56.259)",
      accent: "oklch(0.268 0.007 34.298)", accentForeground: "oklch(0.985 0.001 106.423)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.553 0.013 58.071)",
    },
  },
  {
    id: "mauve",
    label: "Mauve",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.145 0.008 326)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.145 0.008 326)",
      primary: "oklch(0.212 0.019 322.12)", primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.96 0.003 325.6)", secondaryForeground: "oklch(0.212 0.019 322.12)",
      muted: "oklch(0.96 0.003 325.6)", mutedForeground: "oklch(0.542 0.034 322.5)",
      accent: "oklch(0.96 0.003 325.6)", accentForeground: "oklch(0.212 0.019 322.12)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.922 0.005 325.62)", input: "oklch(0.922 0.005 325.62)", ring: "oklch(0.711 0.019 323.02)",
    },
    dark: {
      background: "oklch(0.145 0.008 326)", foreground: "oklch(0.985 0 0)",
      card: "oklch(0.212 0.019 322.12)", cardForeground: "oklch(0.985 0 0)",
      primary: "oklch(0.922 0.005 325.62)", primaryForeground: "oklch(0.212 0.019 322.12)",
      secondary: "oklch(0.263 0.024 320.12)", secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.263 0.024 320.12)", mutedForeground: "oklch(0.711 0.019 323.02)",
      accent: "oklch(0.263 0.024 320.12)", accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.542 0.034 322.5)",
    },
  },
  {
    id: "olive",
    label: "Olive",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.153 0.006 107.1)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.153 0.006 107.1)",
      primary: "oklch(0.228 0.013 107.4)", primaryForeground: "oklch(0.988 0.003 106.5)",
      secondary: "oklch(0.966 0.005 106.5)", secondaryForeground: "oklch(0.228 0.013 107.4)",
      muted: "oklch(0.966 0.005 106.5)", mutedForeground: "oklch(0.58 0.031 107.3)",
      accent: "oklch(0.966 0.005 106.5)", accentForeground: "oklch(0.228 0.013 107.4)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.93 0.007 106.5)", input: "oklch(0.93 0.007 106.5)", ring: "oklch(0.737 0.021 106.9)",
    },
    dark: {
      background: "oklch(0.153 0.006 107.1)", foreground: "oklch(0.988 0.003 106.5)",
      card: "oklch(0.228 0.013 107.4)", cardForeground: "oklch(0.988 0.003 106.5)",
      primary: "oklch(0.93 0.007 106.5)", primaryForeground: "oklch(0.228 0.013 107.4)",
      secondary: "oklch(0.286 0.016 107.4)", secondaryForeground: "oklch(0.988 0.003 106.5)",
      muted: "oklch(0.286 0.016 107.4)", mutedForeground: "oklch(0.737 0.021 106.9)",
      accent: "oklch(0.286 0.016 107.4)", accentForeground: "oklch(0.988 0.003 106.5)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.58 0.031 107.3)",
    },
  },
  {
    id: "mist",
    label: "Mist",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.148 0.004 228.8)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.148 0.004 228.8)",
      primary: "oklch(0.218 0.008 223.9)", primaryForeground: "oklch(0.987 0.002 197.1)",
      secondary: "oklch(0.963 0.002 197.1)", secondaryForeground: "oklch(0.218 0.008 223.9)",
      muted: "oklch(0.963 0.002 197.1)", mutedForeground: "oklch(0.56 0.021 213.5)",
      accent: "oklch(0.963 0.002 197.1)", accentForeground: "oklch(0.218 0.008 223.9)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.925 0.005 214.3)", input: "oklch(0.925 0.005 214.3)", ring: "oklch(0.723 0.014 214.4)",
    },
    dark: {
      background: "oklch(0.148 0.004 228.8)", foreground: "oklch(0.987 0.002 197.1)",
      card: "oklch(0.218 0.008 223.9)", cardForeground: "oklch(0.987 0.002 197.1)",
      primary: "oklch(0.925 0.005 214.3)", primaryForeground: "oklch(0.218 0.008 223.9)",
      secondary: "oklch(0.275 0.011 216.9)", secondaryForeground: "oklch(0.987 0.002 197.1)",
      muted: "oklch(0.275 0.011 216.9)", mutedForeground: "oklch(0.723 0.014 214.4)",
      accent: "oklch(0.275 0.011 216.9)", accentForeground: "oklch(0.987 0.002 197.1)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.56 0.021 213.5)",
    },
  },
  {
    id: "taupe",
    label: "Taupe",
    radius: DEFAULT_RADIUS,
    font: "geist",
    light: {
      background: "oklch(1 0 0)", foreground: "oklch(0.147 0.004 49.3)",
      card: "oklch(1 0 0)", cardForeground: "oklch(0.147 0.004 49.3)",
      primary: "oklch(0.214 0.009 43.1)", primaryForeground: "oklch(0.986 0.002 67.8)",
      secondary: "oklch(0.96 0.002 17.2)", secondaryForeground: "oklch(0.214 0.009 43.1)",
      muted: "oklch(0.96 0.002 17.2)", mutedForeground: "oklch(0.547 0.021 43.1)",
      accent: "oklch(0.96 0.002 17.2)", accentForeground: "oklch(0.214 0.009 43.1)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.922 0.005 34.3)", input: "oklch(0.922 0.005 34.3)", ring: "oklch(0.714 0.014 41.2)",
    },
    dark: {
      background: "oklch(0.147 0.004 49.3)", foreground: "oklch(0.986 0.002 67.8)",
      card: "oklch(0.214 0.009 43.1)", cardForeground: "oklch(0.986 0.002 67.8)",
      primary: "oklch(0.922 0.005 34.3)", primaryForeground: "oklch(0.214 0.009 43.1)",
      secondary: "oklch(0.268 0.011 36.5)", secondaryForeground: "oklch(0.986 0.002 67.8)",
      muted: "oklch(0.268 0.011 36.5)", mutedForeground: "oklch(0.714 0.014 41.2)",
      accent: "oklch(0.268 0.011 36.5)", accentForeground: "oklch(0.986 0.002 67.8)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.547 0.021 43.1)",
    },
  },
];

export const VAR_KEY_MAP: Record<keyof ThemeVars, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  border: "--border",
  input: "--input",
  ring: "--ring",
};
