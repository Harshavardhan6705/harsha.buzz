import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  // Matches the original pages' <meta name="viewport" content="width=device-width">
  width: "device-width",
};

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg?v=1", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=1", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png?v=1",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
