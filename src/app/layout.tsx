import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapAPI - Instant REST API from JSON",
  description:
    "Drop your JSON, get a REST API in 5 seconds. No signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
