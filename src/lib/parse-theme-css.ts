/**
 * Reads a pasted shadcn theme — the `:root { … } .dark { … }` block any tweakcn export,
 * shadcn registry entry or live site's stylesheet carries — and maps it onto Douglas's
 * own tokens. Same approach as tweakcn's own importer: parse the CSS text, don't fetch
 * or scrape the site, so nothing depends on a remote page's markup holding still.
 */

import { VAR_KEY_MAP, type ThemeVars } from "@/lib/themes";
import { toOklch } from "@/lib/color";

export type ParsedThemeCss = {
  light: Partial<ThemeVars>;
  dark: Partial<ThemeVars>;
  /** `--radius`, in rem, when the paste carried one. */
  radius: number | null;
  /** Variables Douglas has no token for (--chart-*, --sidebar-*, …). */
  ignored: string[];
  /** Variables we found but whose value isn't a colour we can read. */
  unreadable: string[];
};

/** `--card-foreground` → `cardForeground`, derived from the map the provider already owns. */
const CSS_NAME_TO_KEY = new Map<string, keyof ThemeVars>(
  (Object.entries(VAR_KEY_MAP) as [keyof ThemeVars, string][]).map(([key, cssVar]) => [
    cssVar.replace(/^--/, ""),
    key,
  ])
);

/**
 * Body of the first `selector { … }` rule. Inner-most closing brace wins, which is what
 * we want: it keeps working when the rule is nested inside `@layer base { … }`.
 */
function blockFor(css: string, selector: string): string | null {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Allows `:root, .light {` and `.dark, [data-theme="dark"] {` style selector lists.
  const match = css.match(new RegExp(`${escaped}[^{]*\\{([^}]*)\\}`));
  return match?.[1] ?? null;
}

function declarationsIn(block: string): [string, string][] {
  return (block.match(/--[\w-]+\s*:\s*[^;]+/g) ?? []).map((declaration) => {
    const separator = declaration.indexOf(":");
    return [
      declaration.slice(0, separator).trim().replace(/^--/, ""),
      declaration.slice(separator + 1).trim(),
    ];
  });
}

function radiusToRem(value: string): number | null {
  const amount = parseFloat(value);
  if (Number.isNaN(amount)) return null;
  if (/px\s*$/.test(value)) return amount / 16;
  return amount;
}

export function parseThemeCss(input: string): ParsedThemeCss {
  const light: Partial<ThemeVars> = {};
  const dark: Partial<ThemeVars> = {};
  const ignored = new Set<string>();
  const unreadable = new Set<string>();
  let radius: number | null = null;

  const rootBlock = blockFor(input, ":root");
  const darkBlock = blockFor(input, ".dark");

  // A paste with no rule at all is treated as a bare list of light-mode declarations,
  // so half-copied snippets still land somewhere useful.
  const lightBlock = rootBlock ?? (darkBlock === null ? input : null);

  const fill = (block: string | null, target: Partial<ThemeVars>) => {
    if (!block) return;
    for (const [name, rawValue] of declarationsIn(block)) {
      if (name === "radius") {
        radius = radiusToRem(rawValue) ?? radius;
        continue;
      }

      const key = CSS_NAME_TO_KEY.get(name);
      if (!key) {
        ignored.add(`--${name}`);
        continue;
      }

      const colour = toOklch(rawValue);
      if (!colour) {
        unreadable.add(`--${name}`);
        continue;
      }
      target[key] = colour;
    }
  };

  fill(lightBlock, light);
  fill(darkBlock, dark);

  return {
    light,
    dark,
    radius,
    ignored: [...ignored].sort(),
    unreadable: [...unreadable].sort(),
  };
}
