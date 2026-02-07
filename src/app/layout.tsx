import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude",
  description: "Talk with Claude, an AI assistant from Anthropic",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen antialiased">
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
