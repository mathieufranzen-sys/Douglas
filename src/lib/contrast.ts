/**
 * WCAG grading for the live theme. Two success criteria are in play and they have
 * different thresholds, so the pairs are tagged rather than graded on one scale:
 *
 * - 1.4.3 Contrast (minimum) — text: 4.5:1 for AA, 7:1 for AAA.
 * - 1.4.11 Non-text contrast — UI boundaries and focus indicators: 3:1, with no AAA
 *   level defined, so those rows read Pass/Fail rather than AA/AAA.
 *
 * Douglas renders body copy at 12–14px, below WCAG's large-text cutoff (18.66px bold
 * or 24px), so every text pair is graded at the normal-text thresholds. Radius and
 * typeface don't enter into either criterion.
 */

import type { ThemeVars } from "@/lib/themes";
import { contrastRatio } from "@/lib/color";

export type ContrastKind = "text" | "non-text";
export type Grade = "AAA" | "AA" | "Pass" | "Fail";

export type ContrastPair = {
  label: string;
  foreground: keyof ThemeVars;
  background: keyof ThemeVars;
  kind: ContrastKind;
  /** Where in the UI this pair actually lands. */
  where: string;
};

export const CONTRAST_PAIRS: ContrastPair[] = [
  { label: "Body text", foreground: "foreground", background: "background", kind: "text", where: "Page copy" },
  { label: "Muted text", foreground: "mutedForeground", background: "background", kind: "text", where: "Timestamps, hints" },
  { label: "Card text", foreground: "cardForeground", background: "card", kind: "text", where: "Every card" },
  { label: "Muted on card", foreground: "mutedForeground", background: "card", kind: "text", where: "Card descriptions" },
  { label: "Popover text", foreground: "popoverForeground", background: "popover", kind: "text", where: "Menus, selects" },
  { label: "Primary button", foreground: "primaryForeground", background: "primary", kind: "text", where: "Confirm, Send" },
  { label: "Primary on page", foreground: "primary", background: "background", kind: "text", where: "Links, active icons" },
  { label: "Secondary button", foreground: "secondaryForeground", background: "secondary", kind: "text", where: "Secondary actions" },
  { label: "Accent", foreground: "accentForeground", background: "accent", kind: "text", where: "Hover, chips" },
  { label: "Destructive", foreground: "destructiveForeground", background: "destructive", kind: "text", where: "Error banners" },
  { label: "Warning", foreground: "warningForeground", background: "warning", kind: "text", where: "Conflict cards" },
  { label: "Success", foreground: "successForeground", background: "success", kind: "text", where: "Done states" },
  { label: "Info", foreground: "infoForeground", background: "info", kind: "text", where: "Confidence badge" },
  { label: "Border", foreground: "border", background: "background", kind: "non-text", where: "Card outlines" },
  { label: "Input", foreground: "input", background: "background", kind: "non-text", where: "Field outlines" },
  { label: "Focus ring", foreground: "ring", background: "background", kind: "non-text", where: "Keyboard focus" },
];

export function grade(ratio: number, kind: ContrastKind): Grade {
  if (kind === "non-text") return ratio >= 3 ? "Pass" : "Fail";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "Fail";
}

/**
 * Truncated rather than rounded: 2.9964 must not print as "3.00" next to a Fail on the
 * 3:1 criterion. A displayed figure always means the bar was genuinely cleared.
 */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}

/** The bar this pair had to clear, for the row's explanation. */
export function threshold(kind: ContrastKind): string {
  return kind === "non-text" ? "3:1" : "4.5:1 AA · 7:1 AAA";
}

export type ContrastResult = ContrastPair & {
  /** null when a token holds something we can't read as a colour. */
  ratio: number | null;
  grade: Grade | null;
};

export function auditTheme(valueFor: (key: keyof ThemeVars) => string): ContrastResult[] {
  return CONTRAST_PAIRS.map((pair) => {
    const ratio = contrastRatio(valueFor(pair.foreground), valueFor(pair.background));
    return {
      ...pair,
      ratio,
      grade: ratio === null ? null : grade(ratio, pair.kind),
    };
  });
}

export function summarise(results: ContrastResult[]) {
  const graded = results.filter((r) => r.grade !== null);
  return {
    total: graded.length,
    failing: graded.filter((r) => r.grade === "Fail").length,
    aaa: graded.filter((r) => r.grade === "AAA").length,
    /** Text pairs only — non-text rows have no AAA level to reach. */
    textTotal: graded.filter((r) => r.kind === "text").length,
  };
}
