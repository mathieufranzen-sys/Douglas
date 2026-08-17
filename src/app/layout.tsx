import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeCustomizerProvider } from "@/components/theme/theme-provider";
import {
  DouglasTitleBar,
  DouglasUtilityBar,
  ThemeGeneratorSidebar,
} from "@/components/theme/theme-generator-panel";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Douglas",
  description: "Douglas — a design system for agent interfaces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // `dark` up front so the first paint is already dark, before the provider runs.
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
        <ThemeCustomizerProvider>
          <TooltipProvider>
            {/* Chrome is shared: every screen below is themed live by the sidebar. The
                shell is pinned to the viewport height so the bars and the sidebar never
                scroll themselves — only <main> does. */}
            <div className="flex h-screen flex-col bg-background">
              <DouglasTitleBar className="shrink-0" />
              <DouglasUtilityBar className="shrink-0" />
              <div className="flex min-h-0 flex-1 lg:flex-row">
                <ThemeGeneratorSidebar className="hidden lg:flex lg:h-full lg:w-[280px] lg:shrink-0" />
                {/* id targeted by the utility bar's fullscreen toggle, so full page mode
                    shows only the screen's own content — not the title bar, utility bar
                    or theme sidebar. */}
                <main id="page-content" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </div>
          </TooltipProvider>
        </ThemeCustomizerProvider>
      </body>
    </html>
  );
}
