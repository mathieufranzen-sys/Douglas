/**
 * oklch <-> hex conversion, so the theme panel can show both notations side by side the
 * way shadcnstudio's generator does. The theme tokens themselves stay in oklch — hex is
 * only ever a readout or the value coming back off a native colour input.
 */

type Rgb = { r: number; g: number; b: number };

function parseOklch(value: string): { l: number; c: number; h: number } | null {
  const match = value.trim().match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (!match) return null;
  const rawL = match[1];
  const l = rawL.endsWith("%") ? parseFloat(rawL) / 100 : parseFloat(rawL);
  return { l, c: parseFloat(match[2]), h: parseFloat(match[3]) };
}

function gammaEncode(channel: number): number {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

function gammaDecode(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function oklchToRgb({ l, c, h }: { l: number; c: number; h: number }): Rgb {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3);

  const [long, medium, short] = lms;
  const linear = [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ];

  const [r, g, bb] = linear.map((v) => Math.min(1, Math.max(0, gammaEncode(v))));
  return { r, g, b: bb };
}

/** Renders any theme token as `#rrggbb`. Falls back to the input when it is already hex. */
export function toHex(value: string): string {
  const trimmed = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const parsed = parseOklch(trimmed);
  if (!parsed) return "#000000";

  const { r, g, b } = oklchToRgb(parsed);
  const channel = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** sRGB channels in 0–1, gamma-encoded, to the oklch string the tokens use. */
function rgbToOklch({ r, g, b }: Rgb): string {
  const [lr, lg, lb] = [r, g, b].map(gammaDecode);

  const long = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const medium = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const short = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const l = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
  const a = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
  const bAxis = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

  const c = Math.sqrt(a * a + bAxis * bAxis);
  let h = (Math.atan2(bAxis, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  const round = (v: number, digits: number) => Number(v.toFixed(digits));
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 2)})`;
}

/** Turns a hex value from a colour input back into the oklch the tokens expect. */
export function hexToOklch(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "oklch(0 0 0)";
  return rgbToOklch(rgb);
}

function parseHex(hex: string): Rgb | null {
  let normalized = hex.trim().replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(normalized)) {
    normalized = normalized
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  // 8-digit hex carries alpha; the tokens are opaque, so the last pair is dropped.
  if (/^[0-9a-f]{8}$/i.test(normalized)) normalized = normalized.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(normalized.slice(i, i + 2), 16) / 255);
  return { r, g, b };
}

/** `h s% l%` in degrees/percent to gamma-encoded sRGB. */
function hslToRgb(h: number, s: number, l: number): Rgb {
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const sector = (((h % 360) + 360) % 360) / 60;
  const x = chroma * (1 - Math.abs((sector % 2) - 1));
  const m = l - chroma / 2;

  const table: [number, number, number][] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ];
  const [r, g, b] = table[Math.floor(sector) % 6];
  return { r: r + m, g: g + m, b: b + m };
}

/** Pulls the leading numbers out of a colour function's argument list. */
function numbersIn(value: string): number[] {
  return (value.match(/-?[\d.]+/g) ?? []).map(Number);
}

const NAMED: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
};

/**
 * Normalises any colour notation a pasted shadcn theme might use into oklch, so an
 * imported token reads and edits exactly like a built-in one. Returns null when the
 * value isn't a colour we can read (a gradient, a color-mix(), a var() reference…),
 * which the caller reports rather than silently mangling.
 */
export function toOklch(value: string): string | null {
  const trimmed = value.trim().replace(/;$/, "");
  if (!trimmed) return null;

  const named = NAMED[trimmed.toLowerCase()];
  if (named) return hexToOklch(named);

  // Already oklch — keep the author's own numbers rather than round-tripping them.
  if (/^oklch\(/i.test(trimmed)) return trimmed;

  if (trimmed.startsWith("#")) {
    const rgb = parseHex(trimmed);
    return rgb ? rgbToOklch(rgb) : null;
  }

  if (/^rgba?\(/i.test(trimmed)) {
    const [r, g, b] = numbersIn(trimmed);
    if ([r, g, b].some((n) => n === undefined || Number.isNaN(n))) return null;
    // Percentages are rare here; plain 0–255 is what these exports carry.
    return rgbToOklch({ r: r / 255, g: g / 255, b: b / 255 });
  }

  // `hsl(220 13% 91%)`, and the bare `220 13% 91%` that shadcn v3 themes store so the
  // consumer can wrap them in hsl() themselves.
  const bareHsl = /^-?[\d.]+\s+[\d.]+%\s+[\d.]+%/.test(trimmed);
  if (/^hsla?\(/i.test(trimmed) || bareHsl) {
    const [h, s, l] = numbersIn(trimmed);
    if ([h, s, l].some((n) => n === undefined || Number.isNaN(n))) return null;
    return rgbToOklch(hslToRgb(h, s / 100, l / 100));
  }

  return null;
}
