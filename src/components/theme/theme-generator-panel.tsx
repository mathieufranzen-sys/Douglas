"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RotateCcw,
  ExternalLink,
  Maximize,
  Minimize,
  ClipboardPaste,
  Contrast,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toHex, hexToOklch } from "@/lib/color";
import { COLOR_GROUPS, type ThemeVars } from "@/lib/themes";
import { parseThemeCss, type ParsedThemeCss } from "@/lib/parse-theme-css";
import { auditTheme, formatRatio, summarise, threshold, type Grade } from "@/lib/contrast";
import { useThemeCustomizer } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  { href: "/", label: "Components" },
  { href: "/prompt", label: "Prompt Input" },
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
    <header className={cn("flex h-16 items-center justify-between overflow-hidden border-b bg-background px-4", className)}>
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

/** Tracks the browser's real fullscreen state, since the user can also exit it with Esc. */
function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      // Fullscreen the page content only — the title bar, utility bar and theme
      // sidebar shouldn't be part of full page mode.
      document.getElementById("page-content")?.requestFullscreen();
    }
  };

  return { isFullscreen, toggle };
}

export function DouglasUtilityBar({ className }: { className?: string }) {
  const { presetId, setPresetId, mode, setMode } = useThemeCustomizer();
  const pathname = usePathname();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  return (
    <div className={cn("relative flex h-14 w-full flex-row items-center justify-end gap-4 overflow-hidden border-b bg-background px-4", className)}>
      <nav className="flex items-center gap-1">
        {SCREENS.map((screen) => (
          <Link
            key={screen.href}
            href={screen.href}
            aria-current={pathname === screen.href ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              pathname === screen.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
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

      <Button
        variant="outline"
        size="icon-sm"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize strokeWidth={1.75} /> : <Maximize strokeWidth={1.75} />}
      </Button>

      <ImportCssDialog />
      <AccessibilityDialog />

      <Button variant="outline" size="sm" onClick={() => setPresetId(presetId)}>
        <RotateCcw data-icon="inline-start" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}

/**
 * The value each token actually resolves to right now: the active preset's, unless the
 * panel has an override for the mode on screen. Shared by the editor and the audit so
 * they can never disagree about what is applied.
 */
function useResolvedVars() {
  const { presets, presetId, mode, overrides } = useThemeCustomizer();
  const preset = presets.find((p) => p.id === presetId) ?? presets[0];
  const vars = mode === "light" ? preset.light : preset.dark;
  return (key: keyof ThemeVars) => overrides[mode][key] ?? vars[key];
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

/**
 * Paste-a-theme, the way tweakcn imports one: the CSS text is parsed locally, nothing
 * is fetched from a remote site. Whatever it recognises is layered over the active
 * preset as overrides, so the pasted look lands on Douglas's own components at once.
 */
function ImportCssDialog() {
  const { setOverrides, setRadius } = useThemeCustomizer();
  const [open, setOpen] = React.useState(false);
  const [css, setCss] = React.useState("");
  const [result, setResult] = React.useState<ParsedThemeCss | null>(null);

  const applied = result ? Object.keys(result.light).length + Object.keys(result.dark).length : 0;

  const runImport = () => {
    const parsed = parseThemeCss(css);
    setResult(parsed);
    if (!Object.keys(parsed.light).length && !Object.keys(parsed.dark).length) return;

    setOverrides({ light: parsed.light, dark: parsed.dark });
    if (parsed.radius !== null) setRadius(parsed.radius);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setResult(null);
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <ClipboardPaste data-icon="inline-start" strokeWidth={1.75} />
        Import CSS
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import a theme</DialogTitle>
          <DialogDescription>
            Paste the `:root` and `.dark` blocks from a tweakcn export, a shadcn registry
            entry, or any shadcn site&apos;s stylesheet. Accepts oklch, hex, hsl and rgb.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={css}
          onChange={(e) => setCss(e.target.value)}
          placeholder={":root {\n  --background: #ffffff;\n  --primary: oklch(0.62 0.19 260);\n}"}
          rows={12}
          aria-label="Theme CSS"
          className="max-h-[45vh] overflow-y-auto font-mono text-xs"
        />

        {result && (
          <div className="flex flex-col gap-1 text-xs">
            {applied > 0 ? (
              <span className="text-foreground">
                Applied {applied} token{applied === 1 ? "" : "s"}
                {Object.keys(result.light).length > 0 && Object.keys(result.dark).length > 0
                  ? " across light and dark"
                  : Object.keys(result.dark).length > 0
                    ? " to dark"
                    : " to light"}
                {result.radius !== null && `, radius ${result.radius}rem`}.
              </span>
            ) : (
              <span className="text-destructive">
                No Douglas tokens found in that paste — nothing was changed.
              </span>
            )}
            {result.unreadable.length > 0 && (
              <span className="text-muted-foreground">
                Couldn&apos;t read a colour from {result.unreadable.join(", ")}.
              </span>
            )}
            {result.ignored.length > 0 && (
              <span className="text-muted-foreground">
                Douglas has no token for {result.ignored.join(", ")}.
              </span>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>Close</DialogClose>
          <Button size="sm" onClick={runImport} disabled={!css.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const GRADE_STYLES: Record<Grade, string> = {
  AAA: "bg-primary/15 text-primary",
  AA: "bg-muted text-foreground",
  Pass: "bg-muted text-foreground",
  Fail: "bg-destructive/15 text-destructive",
};

/** Audits the live theme against WCAG 1.4.3 and 1.4.11, recomputing as tokens change. */
function AccessibilityDialog() {
  const { mode } = useThemeCustomizer();
  const valueFor = useResolvedVars();

  const results = auditTheme(valueFor);
  const { total, failing, aaa, textTotal } = summarise(results);

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Contrast data-icon="inline-start" strokeWidth={1.75} />
        Accessibility
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Accessibility check</DialogTitle>
          <DialogDescription>
            Contrast of the live {mode} theme. Text pairs are graded against WCAG 1.4.3
            (4.5:1 AA, 7:1 AAA); borders and the focus ring against 1.4.11 (3:1, which
            defines no AAA level). Radius and typeface don&apos;t affect either.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-md px-2 py-1 font-medium",
              failing === 0 ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
            )}
          >
            {failing === 0 ? `All ${total} pairs pass` : `${failing} of ${total} failing`}
          </span>
          <span className="text-muted-foreground">
            {aaa} of {textTotal} text pairs reach AAA
          </span>
        </div>

        <div className="-mx-1 max-h-[50vh] overflow-y-auto px-1">
          <div className="flex flex-col">
            {results.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 border-b py-2 last:border-b-0"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border text-[0.625rem] font-semibold"
                  style={{
                    background: valueFor(row.background),
                    color: valueFor(row.foreground),
                  }}
                >
                  Aa
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{row.label}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {row.where} · {threshold(row.kind)}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {row.ratio === null ? "—" : formatRatio(row.ratio)}
                </span>
                <span
                  className={cn(
                    "w-12 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[0.625rem] font-semibold",
                    row.grade ? GRADE_STYLES[row.grade] : "bg-muted text-muted-foreground"
                  )}
                >
                  {row.grade ?? "n/a"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ThemeGeneratorSidebar({ className }: { className?: string }) {
  const { presetId, setPresetId, presets, radius, setRadius, font, setFont, setVar } =
    useThemeCustomizer();
  const valueFor = useResolvedVars();

  const setValueFor = (key: keyof ThemeVars) => (value: string) => setVar(key, value);

  return (
    <aside
      className={cn("flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden border-r bg-background p-3", className)}
      aria-label="Theme"
    >
      {/* The preset picker stays at the same level as the color/typography/radius
          choices below it — same panel, same column — instead of living in the
          utility bar with unrelated controls. */}
      <Select value={presetId} onValueChange={(v) => v && setPresetId(v as string)}>
        <SelectTrigger className="h-9 w-full shrink-0 text-sm" aria-label="Theme">
          <SelectValue>{(value: string | null) => presets.find((p) => p.id === value)?.label ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {presets.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Only this column scrolls — the preset picker above and the tab list below
          stay put. */}
      <Tabs defaultValue="colors" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TabsList className="w-full shrink-0">
          <TabsTrigger value="colors">Color</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="radius">Radius</TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ColorGroups valueFor={valueFor} setValueFor={setValueFor} />
        </TabsContent>
        <TabsContent value="typography" className="min-h-0 flex-1 overflow-y-auto pr-1">
          <FontField font={font} setFont={setFont} />
        </TabsContent>
        <TabsContent value="radius" className="min-h-0 flex-1 overflow-y-auto pr-1">
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
