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
      <body className="min-h-full flex flex-col">
        <ThemeCustomizerProvider>
          <TooltipProvider>
            {/* Chrome is shared: every screen below is themed live by the sidebar. */}
            <div className="flex min-h-screen flex-col bg-background">
              <DouglasTitleBar />
              <DouglasUtilityBar />
              <div className="flex flex-1 lg:flex-row">
                <ThemeGeneratorSidebar className="hidden lg:sticky lg:top-[7.5rem] lg:flex lg:h-[calc(100vh-7.5rem)] lg:w-[280px] lg:shrink-0" />
                <main className="flex min-w-0 flex-1 flex-col">{children}</main>
              </div>
            </div>
          </TooltipProvider>
        </ThemeCustomizerProvider>
      </body>
    </html>
  );
}
