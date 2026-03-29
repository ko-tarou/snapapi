import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapAPI - Instant REST API from JSON | Free Mock API Generator",
  description: "Create instant mock REST APIs from JSON in 5 seconds. No signup required. Full CRUD, auto data generation, delay simulation. Free forever.",
  keywords: ["mock api", "json to rest api", "instant api from json", "mock api generator", "free mock api", "json mock server online", "fake rest api", "api testing"],
  openGraph: {
    title: "SnapAPI - Drop your JSON, get a REST API in 5 seconds",
    description: "Create instant mock REST APIs from JSON. No signup. Full CRUD. Auto data generation. Free forever.",
    url: "https://snapapi.akokoa1221.workers.dev",
    siteName: "SnapAPI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapAPI - Instant REST API from JSON",
    description: "Drop your JSON, get a REST API in 5 seconds. No signup required.",
  },
  alternates: {
    canonical: "https://snapapi.akokoa1221.workers.dev",
  },
  robots: {
    index: true,
    follow: true,
  },
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
