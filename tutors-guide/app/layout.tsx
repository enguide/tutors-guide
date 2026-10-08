import type { Metadata } from "next";

import "./globals.css";
import "katex/dist/katex.min.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "Tutors Guide",
  description: "Comprehensive test prep and tutoring platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}